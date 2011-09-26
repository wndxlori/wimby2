//Levels managed by WebMapLayer
//Each level handles a range of zoom levels

//API:
//  init()
//  load()
//  addToMap
//  hide()
//  show()
//  reset()
//  afterManualMove() [optional]

var WebMapLevel = function(layer, zoom) {
  this.layer = layer;
  this.zoom  = zoom;
  this.items = {};
};

WebMapLevel.prototype.reset = function() {
    this.items = {};
    this.hide();
};

WebMapLevel.prototype.update = function() {
    this.layer.showLevel(this);

    if (!this.initialized_) {
        this.initialized_ = true;
        this.maxZoom = this.layer.lastZoom(this);
        this.init();
        return;
    }

    this.load();
}

WebMapLevel.prototype.createItem = function(data) {
  return this.layer.createItem(this, data);
}

WebMapLevel.prototype.createItems = function(data) {
    var itemsArray = [];
    var itemsHash = this.items;

    var level = this;
    $.each(data, function(index, data) {
        var id = data.i;
        if (!id) {
            var item = level.createItem(data);
            itemsArray.push(item);
        } else if (itemsHash[id]==undefined) {
            var item = level.createItem(data);
            itemsHash[id] = item;
            itemsArray.push(item);
        }
    } );

    return itemsArray;
}

WebMapLevel.prototype.addList = function(data) {
    if ( (!data) || (data.length==0) )
        return;

    var itemsArray = this.createItems(data);

    if (itemsArray && itemsArray.length>0) {
        this.addToMap(itemsArray);
        this.layer.afterItemsAdded();
    }

    $('#number_of_markers').text(data.length);
};

WebMapLevel.prototype.addToMap= function(array) {
    alert('Must override WebMapLevel.addToMap');
}

WebMapLevel.prototype.show = function() {
    alert('Must override WebMapLevel.show');
}

WebMapLevel.prototype.hide = function() {
    alert('Must override WebMapLevel.hide');
}

////////////////////////////////////////////////////////
//Note: Use this if nothing should appear for this level

var WebMapNullLevel = function(layer, zoom) {
    this.constructor.apply(this, arguments);
}
WebMapNullLevel.prototype = new WebMapLevel();

WebMapNullLevel.prototype.init = function() {
}

WebMapNullLevel.prototype.load = function() {
}

WebMapNullLevel.prototype.addToMap = function(items) {
}

WebMapNullLevel.prototype.show = function() {
}

WebMapNullLevel.prototype.hide = function() {
}

////////////////////////////////////////////////////////
//Note: This currently loads the whole map

var WebMapSimpleLevel = function(layer, zoom, smallCells, params) {
    this.constructor.apply(this, arguments);
    this.visible_ = false;
    this.smallCells = smallCells;
    this.params = params || {};
}
WebMapSimpleLevel.prototype = new WebMapLevel();

WebMapSimpleLevel.prototype.init = function() {
    if (!this.loader)
        this.loader = new WebMapCellLoader(this.zoom, this.maxZoom, this.smallCells, true, null);

   this.load();
}

WebMapSimpleLevel.prototype.load = function() {
    var level = this;
    this.loader.loadCells( WebMap.map.getZoom(),
                           WebMap.map.getBounds(),
                           level.layer.data_url,
                           $.extend(level.params, level.layer.loadQueryParams(level)),
                           function(data) {
                                level.addList(data);
                           }
                         );
}

WebMapSimpleLevel.prototype.addToMap = function(items) {
    if (this.visible_)
       this.setMap_(WebMap.map);
}

WebMapSimpleLevel.prototype.reset = function() {
    this.setMap_(null);
    if (this.loader)
        this.loader.reset();

    WebMapLevel.prototype.reset.call(this);
}

WebMapSimpleLevel.prototype.setMap_ = function(map) {
    this.visible_ = (map != null);

    $.each(this.items, function(i, item) {

      if ($.isArray(item)){
         $.each(item, function(i, subi) { subi.setMap(map); } );
      } else {
         item.setMap(map);
      }

    } );
}

WebMapSimpleLevel.prototype.show = function() {
   if (!this.visible_)
       this.setMap_(WebMap.map);
}

WebMapSimpleLevel.prototype.hide = function() {
   if (this.visible_)
      this.setMap_(null);
}

//////////////////////////////////////////////////////////////////////////

var WebMapMarkerLevel = function(layer, zoom, clustered) {
    this.constructor.apply(this, arguments);
    this.clustered = clustered;
}
WebMapMarkerLevel.prototype = new WebMapLevel();

WebMapMarkerLevel.prototype.init = function() {

    if (!this.loader)
        this.loader = new WebMapCellLoader(this.zoom, this.maxZoom, false, true, null);

    var level = this;
    if (level.clustered) {
        console.log('using clusterer');
        //Use a clusterer manager
        level.manager = new MarkerClusterer(WebMap.map, null, {averageCenter:true, styles:level.layer.cluster_styles } );
        level.load();

    } else {
        console.log('using manager');
        //Use the marker manager for most zoomed in level
        level.manager = new MarkerManager(WebMap.map);
        google.maps.event.addListenerOnce(level.manager, 'loaded', function(){
           level.load();
        });
    }
}

WebMapMarkerLevel.prototype.load = function() {
    var level = this;
    this.loader.loadCells( WebMap.map.getZoom(),
                           WebMap.map.getBounds(),
                           level.layer.data_url,
                           level.layer.loadQueryParams(level),
                           function(data) {
                                level.addList(data);
                           }
                         );
}

WebMapMarkerLevel.prototype.addToMap = function(items) {
    this.manager.addMarkers(items, this.zoom);
    this.manager.refresh();
}

WebMapMarkerLevel.prototype.reset = function() {
    WebMapLevel.prototype.reset.call(this);

    if (this.manager)
      this.manager.clearMarkers();
    if (this.loader)
      this.loader.reset();
}

WebMapMarkerLevel.prototype.show = function() {
   if ( (this.manager) && (!this.manager.visible()) )
       this.manager.show();
}

WebMapMarkerLevel.prototype.hide = function() {
    if ( (this.manager) && (this.manager.visible()) )
       this.manager.hide();
}
