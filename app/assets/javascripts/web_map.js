var WebMapHelper = {

    MAX_GOOGLE_ZOOM:      19,
    TILE_SIZE:           256,
    TOWNSHIP_PIXELS:    86720, //Highest/Widest township in base pixels (calculated when doing the grids)
    //Speed up some math by pre-calculating
    DEG_TO_RAD:      Math.PI / 180.0,
    RAD_TO_DEG:      180.0 / Math.PI,
    PI4:             4 * Math.PI,
    INV_PI4:         0.25 / Math.PI,
    MULT:               null,
    INV_MULT:           null,
    LNG_TO_X:           null,
    LNG_X_OFFSET:       null,
    LNG_FROM_X:         null,

    //Copied from my grid calculation code (Marc)
    //Pixels here are pixels at the highest zoom level
    lngToXPixel: function(lng) {
        return Math.round(this.LNG_TO_X * lng + this.LNG_X_OFFSET);
    },
    xPixelToLng: function(x) {
        return (x - this.LNG_X_OFFSET) * this.LNG_FROM_X;
    },
    latToYPixel: function(lat) {
        var sin = Math.sin(lat * this.DEG_TO_RAD);
        var y1 = 0.5 - this.INV_PI4 * Math.log((1 + sin) / (1 - sin));
        return Math.round(this.MULT * y1);
    },
    yPixelToLat: function(y) {
        var y1 = y * this.INV_MULT;
        var v = Math.exp((0.5 - y1) * this.PI4);
        var lat = Math.asin((v - 1) / (v + 1));
        return lat * this.RAD_TO_DEG;
    },

    zoomForUnit: function(unit) {
        if (unit=='baseline')
          return this.zoomForPixel( this.TOWNSHIP_PIXELS * 4 );
        else if (unit=='township')
          return this.zoomForPixel( this.TOWNSHIP_PIXELS );
        else if (unit=='section')
          return this.zoomForPixel( this.TOWNSHIP_PIXELS / 6 );
        else if (unit=='quarter')
          return this.zoomForPixel( this.TOWNSHIP_PIXELS / 12 );
        else //Township
          return this.zoomForPixel( this.TOWNSHIP_PIXELS );
    },

    zoomForPixel: function(pixels) {
        if (!this.container)
            this.container = $('#map');
        var viewPortSize = Math.min(this.container.width(), this.container.height() );
        var zoom = this.MAX_GOOGLE_ZOOM;

        while ( (zoom>0) && (pixels > viewPortSize) ) {
            zoom--;
            viewPortSize *= 2;
        }

        return zoom;
    },

    init: function() {
        this.PIXELS_AT_MAX_ZOOM = this.TILE_SIZE << this.MAX_GOOGLE_ZOOM;
        this.MULT = this.PIXELS_AT_MAX_ZOOM;
        this.INV_MULT = 1.0 / this.MULT;

        this.LNG_TO_X = this.PIXELS_AT_MAX_ZOOM / 360.0;
        this.LNG_FROM_X = 360.0 / this.PIXELS_AT_MAX_ZOOM;
        this.LNG_X_OFFSET = Math.round(this.PIXELS_AT_MAX_ZOOM / 2);
    }
};

var WebMap = {
    infoWindowOptions: {},
    layers : {},
    infoWindows : {},
    map : null,
    searchBoundary: null,
    busyCount: 0, //How many callers have called busyStart

    initialize : function() {

        WebMapHelper.init();
        this.setMapDimensions();

        var GM = google.maps;
        var $container = $('#map');
        this.container = $container;

        var options = {
          mapTypeId: GM.MapTypeId.ROADMAP,
          zoom: 5,
          center: new GM.LatLng(54.41893,-111.181641),
          minZoom: 4,
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

        this.layers.well = new WebMapMarkerLayer();
        this.initBusyIndicator();
        this.layers.well.enabled(true);
        WebMapFields.enabled(true);
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

//    mapReset : function() {
//        WebMap.map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(WebMap.searchBoundary.south, WebMap.searchBoundary.west),
//                                               new google.maps.LatLng(WebMap.searchBoundary.north, WebMap.searchBoundary.east)));
//        return false;
//    },

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

    //Padding per zoom level in y,x pairs
    //should match Config.rb - zero_pad
    ZERO_PADDING       : [ 1,1,  1,1,  1,1,  1,1,  1,1,
                           1,2,  2,2,  2,1,  2,2,  3,2,
                           3,3,  3,3,  3,4,  4,4,  4,4,
                           4,5,  5,5,  5,5,  5,5,  6,6 ]

};

//Notes:
//   Tries to load areas(cells) larger than the viewport to avoid too many server calls
//   Adds padding around viewport to handle objects which might be slightly off-screen
//       and avoid reloads on small scrolls.
//   May load more than one cell at a time
var WebMapCellLoader = function(minZoom, maxZoom, small, enableCache, searchBoundary) {
    var cellZoom = minZoom;

    if (small) {
        cellZoom = Math.min(maxZoom, minZoom+1);
        this.cell_width_multiplier  = 1.0;
        this.cell_height_multiplier = 1.0;
        this.scroll_padding         =   0;
    }

    this.pixel_multiplier = Math.pow(2, WebMapHelper.MAX_GOOGLE_ZOOM - cellZoom);
    this.cell_width  = WebMap.container.width()  * this.cell_width_multiplier  * this.pixel_multiplier;
    this.cell_height = WebMap.container.height() * this.cell_height_multiplier * this.pixel_multiplier;

    if (!searchBoundary)
        searchBoundary = { west:-125, east:-80, north:60, south:42};
    this.search_bounds = searchBoundary;
    this.search_x_min = WebMapHelper.lngToXPixel(  searchBoundary.west ) ;
    this.search_x_max = WebMapHelper.lngToXPixel(  searchBoundary.east ) ;
    this.search_y_min = WebMapHelper.latToYPixel(  searchBoundary.north ) ;
    this.search_y_max = WebMapHelper.latToYPixel(  searchBoundary.south ) ;

    this.enableCache = enableCache;

    this.reset();
};

WebMapCellLoader.prototype.reset = function() {
    this.loaded = []; //Track loaded sections - sparse array of arrays [x][y]
},

WebMapCellLoader.prototype.loadCells = function(currentZoom, bounds, url, params, dataCallback) {
    var cellList = [];
    var coordList= [];
    var scale={};
    this.getCellsToLoad(currentZoom, bounds, cellList, coordList, scale);
    if (coordList.length<=0) return false; //Nothing to do

    params.scale = scale;
    params.regions = cellList;
    var that = this;
    that.markCells(coordList, 1); //loading

    $.ajax({
        url: url,
        dataType: 'json',
        data: params,
        cache:this.enableCache,
        error: function(){
            that.markCells(coordList, false); //Not loaded
        },
        success: function(data, statusText, jqXHR) {
            //Maybe we need some error handling
            dataCallback(data, statusText, jqXHR);
            that.markCells(coordList, 2); //Loaded
        }
    });

    return true;
};

WebMapCellLoader.prototype.getCellsToLoad = function(currentZoom, bounds, cellList, coordList, scale) {
    var mult = Math.pow(2, WebMapHelper.MAX_GOOGLE_ZOOM - currentZoom);
    var mpad = this.scroll_padding * mult;

    //Pixel range at base
    var x_min = WebMapHelper.lngToXPixel(  bounds.getSouthWest().lng() ) - mpad;
    var x_max = WebMapHelper.lngToXPixel(  bounds.getNorthEast().lng() ) + mpad;
    var y_min = WebMapHelper.latToYPixel(  bounds.getNorthEast().lat() ) - mpad;
    var y_max = WebMapHelper.latToYPixel(  bounds.getSouthWest().lat() ) + mpad;

    //Limit to search boundary
    x_min = Math.max(x_min, this.search_x_min);
    x_max = Math.min(x_max, this.search_x_max);
    y_min = Math.max(y_min, this.search_y_min);
    y_max = Math.min(y_max, this.search_y_max);


    //Find nearest cells
    x_min = Math.floor(x_min/this.cell_width )*this.cell_width;
    y_min = Math.floor(y_min/this.cell_height)*this.cell_height;

    //To record full range
    var x_min1=this.search_x_max, x_max1=this.search_x_min,
        y_min1=this.search_y_max, y_max1=this.search_y_min;

    //Loop through each cell in the range and add it if necessary
    for (var x=x_min; x<x_max; x+=this.cell_width) {
        for (var y=y_min; y<y_max; y+=this.cell_height) {
            if (this.isLoaded(x,y)) continue;

            var x_;
            x_ = Math.max(x,               this.search_x_min);
            var w = WebMapHelper.xPixelToLng( x_ );
            x_min1 = Math.min(x_min1, x_);
            x_ = Math.min(x+this.cell_width-1, this.search_x_max-1);
            var e = WebMapHelper.xPixelToLng( x_ );
            x_max1 = Math.max(x_max1, x_);

            var y_;
            y_ = Math.max(y,               this.search_y_min);
            var n = WebMapHelper.yPixelToLat( y_ );
            y_min1 = Math.min(y_min1, y_);
            y_ = Math.min(y+this.cell_height-1, this.search_y_max-1);
            var s = WebMapHelper.yPixelToLat( Math.min(y+this.cell_height-1, this.search_y_max-1 ) );
            y_max1 = Math.max(y_max1, y_);

            cellList.push( {w:w, e:e, s:s, n:n} );
            coordList.push( {x:x, y:y} );
        }
    }

    //So the server can adjust the markers depending on the area being filled
    scale.h = Math.floor( (x_max1 - x_min1) / this.pixel_multiplier );
    scale.v = Math.floor( (y_max1 - y_min1) / this.pixel_multiplier );
};

WebMapCellLoader.prototype.isLoaded = function(x, y) {
    var col = this.loaded[x];
    if (!col)
        col = this.loaded[x] = [];
    return col[y];
};

WebMapCellLoader.prototype.markCells = function(list, value) {  //1=Loading, 2=Loaded
    for (var i=0; i< list.length; i++) {
        var o = list[i];
        var col = this.loaded[o.x];
        col[o.y] = value;
    }
};

//Load more than one screenfull at a time to reduce server calls
WebMapCellLoader.prototype.cell_width_multiplier = 2.0; //Cell size as a multiple of windows size
WebMapCellLoader.prototype.cell_height_multiplier = 2.0;
// Add a border around the viewport so that objects that are slightly off-screen still render.
// We also don't want the user to wait for objects to load that are just off-screen
WebMapCellLoader.prototype.scroll_padding  = 200;         //Scroll padding in pixels at current zoom
