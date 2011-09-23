var WebMapHelper = {

    MAX_GOOGLE_ZOOM:      19,
    TILE_SIZE:           256
};

var WebMap = {
    infoWindowOptions: {},
    layers : {},
    infoWindows : {},
    map : null,
    searchBoundary: null,
    busyCount: 0, //How many callers have called busyStart

    initialize : function() {

        this.setMapDimensions();

        var GM = google.maps;
        var $container = $('#map');
        this.container = $container;

        var options = {
          mapTypeId: GM.MapTypeId.ROADMAP,
          zoom: 5,
          center: new GM.LatLng(54.41893,-111.181641),
          minZoom: 3,
          maxZoom: 16,
          mapTypeControl: true,
          mapTypeControlOptions: {
            mapTypeIds : [GM.MapTypeId.ROADMAP, GM.MapTypeId.SATELLITE, GM.MapTypeId.HYBRID, GM.MapTypeId.TERRAIN ],
            style: GM.MapTypeControlStyle.HORIZONTAL_BAR
          },
          overviewMapControl: true,
          overviewMapControlOptions: {
            opened: false
          },
          panControl: true,
          scaleControl: true,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
               style: GM.ZoomControlStyle.LARGE
          }
        };

        this.map = new GM.Map($container[0], options);
//        this.mapReset();

        this.addCopyright();

        this.dlsOverlay = new GM.ImageMapType(this.dlsOptions() );
        this.ntsOverlay = new GM.ImageMapType(this.ntsOptions() );
        WebMap.map.overlayMapTypes.push(WebMap.dlsOverlay);
        WebMap.map.overlayMapTypes.push(WebMap.ntsOverlay);

        // Debug info
        GM.event.addListener(this.map, 'zoom_changed', function() {
            $('#zoom_level').html(this.getZoom());
        });
        GM.event.addListener(this.map, 'mousemove', function(event) {
            $('#map_cursor').html(''+event.latLng);
        });

        $('#Start').bind('click', this.mapReset);

    },

    setMapDimensions : function () {
          var mapdiv = document.getElementById("map");
          var useragent = navigator.userAgent;
          var divh;

            if(document.body.offsetHeight){
                 divh=document.body.offsetHeight;
            }
            else if(document.body.style.pixelHeight){
                 divh=document.body.style.pixelHeight;
            }

          if (useragent.indexOf('iPhone') != -1) {
           mapdiv.style.height = '328px';
          }
          else if (useragent.indexOf('iPod') != -1) {
           mapdiv.style.height = '328px';
          }
          else
          {
          var maph = (divh - 96).toString() + 'px';
          mapdiv.style.height = maph;
          }

        //  mapdiv.style.width = '100%';

//          if (map) {google.maps.event.trigger(map, 'resize');}
    },

    addCopyright : function() {
        var copyrightNode = document.createElement('div');
        copyrightNode.id = 'map-copyright';
        copyrightNode.innerHTML = '<a href="http://www.labradortechnologies.com" target="_blank">Grid data &copy;2011 Labrador Technologies</a>';
        copyrightNode.index = 1;

        this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(copyrightNode);
        return copyrightNode;
    },

    initBusyIndicator: function() {
        $(document)
            .ajaxStart(function(){WebMap.startBusy();} )
            .ajaxStop( function(){WebMap.endBusy();  } );
    },

    mapReset : function() {
        WebMap.map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(WebMap.searchBoundary.south, WebMap.searchBoundary.west),
                                               new google.maps.LatLng(WebMap.searchBoundary.north, WebMap.searchBoundary.east)));
        return false;
    },

    getTileUrl : function(tile, zoom) {
         if (!WebMap.mapContainsTile(this.tileRegions, zoom, tile.x, tile.y))
            return null;

        //Distribute requests over paths for IE performance
        var pathPrefix = this.pathRoot[ (tile.x+tile.y) % this.pathRoot.length ];

        var xpad = WebMap.ZERO_PADDING[zoom*2  ];
        var ypad = WebMap.ZERO_PADDING[zoom*2+1];
        var zpad = 2;

        return pathPrefix
                + '/z' + WebMap.zeroPad(zoom, zpad)
                + '/y' + WebMap.zeroPad(tile.y, ypad)
                + '/x' + WebMap.zeroPad(tile.x, xpad)
                + '.png';
    },

    startBusy: function() {
      if (this.busyCount++==0)
        $('#busy_indicator').show();
    },

    endBusy: function() {
      if (--this.busyCount==0)
        $('#busy_indicator').hide();
    },

    //check if tile is within map region limits
    mapContainsTile : function(regions, z,x,y) {
        var zmult  = Math.pow(2, (WebMapHelper.MAX_GOOGLE_ZOOM - z));
        var zl = x * zmult;
        var zr = zl + zmult-1;

        var zt = y * zmult;
        var zb = zt + zmult - 1;

        for (var i in regions) {
            var region = regions[i];
            if (region[0]) {
              //Handle include region - anything which falls partially in
              if ( (z  >= region[1]) && (z  <= region[2] ) &&
                   (zr >= region[3]) && (zl <= region[4] ) &&
                   (zb >= region[5]) && (zt <= region[6] )     )
               return true;

            } else {
             //handle exclusion - only tiles which are completely in
              if ( (z  >= region[1]) && (z  <= region[2] ) &&
                   (zl >= region[3]) && (zr <= region[4] ) &&
                   (zt >= region[5]) && (zb <= region[6] )     )
               return false;
            }

        }

        //no regions match
        return false;
    },

    //zero pad a string
    zeroPad : function(n,len) {
      var r = "" + n;
      if (r.length >= len)
        return r;
      r = "000000000"+r;
      return r.substring(r.length-len);
    },

    dlsOptions: function() {
         return {
               name: 'DLS Grid',
               alt : 'DLS Coordinate grid',

               minZoom: 3,
               maxZoom: 17,
               isPng: true,
               opacity: 0.6,
               tileSize: new google.maps.Size(WebMapHelper.TILE_SIZE, WebMapHelper.TILE_SIZE),

               pathRoot   :[ 'http://dlsgrid.etriever.com' ],
               /* This needs to be changed at some time to use multiple servers like the NTS grid
                  because IE limits the number of connections to a single server.
                  However to do this will require moving the tiles into different buckets on S3.
                  (This will be done automatically if the tiles are regenerated - Marc
               pathRoot   :[ 'http://dlsgrid0.etriever.com' ,
                             'http://dlsgrid1.etriever.com',
                             'http://dlsgrid2.etriever.com',
                             'http://dlsgrid3.etriever.com' ],  */

                //set of ranges to display : [include, minz, maxz, minx,maxx, miny, maxy]
                //all values in base tile units
                tileRegions  : [ [true, 0,19, 84485,120208, 152252,180059] ],

               getTileUrl: WebMap.getTileUrl
        }
    },

    ntsOptions : function() {
        return {
           name: 'NTS Grid',
           alt:  'NTS Coordinate grid',

           minZoom: 3,
           maxZoom: 17,
           isPng: true,
           opacity: 1.0,
           tileSize: new google.maps.Size(WebMapHelper.TILE_SIZE, WebMapHelper.TILE_SIZE),

           pathRoot   :[ 'http://ntsgrid0.etriever.com',
                         'http://ntsgrid1.etriever.com',
                         'http://ntsgrid2.etriever.com',
                         'http://ntsgrid3.etriever.com' ],

            //set of ranges to display : [include, minz, maxz, minx,maxx, miny, maxy]
            //all values in base tile units
            tileRegions  :  [
                                [ true,  0,19, 75727,87379, 152252,173180], //sheets 93 & 94
                                [ true,  0,19, 87379,95753, 169570,180052]  //sheets 82 & 83
                            ],

           getTileUrl: WebMap.getTileUrl
        }
    },

     /* Not sure how to incorporate these layout things, so just inserting here */
    defaultLayoutOverrides :     { west: {
                                        onresize:               "WebMap.mapResize"
                                      , onclose:                "WebMap.mapResize"
                                      , onopen:                 "WebMap.mapResize"
                                   }
                                   ,east: {
                                        onresize:               "WebMap.mapResize"
                                      , onclose:                "WebMap.mapResize"
                                      , onopen:                 "WebMap.mapResize"
                                   }},

    //Padding per zoom level in y,x pairs
    //should match Config.rb - zero_pad
    ZERO_PADDING       : [ 1,1,  1,1,  1,1,  1,1,  1,1,
                           1,2,  2,2,  2,1,  2,2,  3,2,
                           3,3,  3,3,  3,4,  4,4,  4,4,
                           4,5,  5,5,  5,5,  5,5,  6,6 ],

    DISPLAY_BOUNDARY_URL: 'web_map/get_search_boundary'


};