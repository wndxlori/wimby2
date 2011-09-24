// This is a manager that splits each layer up into 'levels' that show different amounts
// or types of details. Levels are shown and hidden as you zoom in and out.

//Methods that must be provided by sub-classes
//  constructor
//  createItem(level, json) -> object
//  loadQueryParameters
//  getItemBounds
//  highlight
//  unhighlight
//optional:
//  init

var WebMapLayer = function () {
    this.enabled_ = false;
    this.initialized_ = false;
    this.selected_id = null;
    this.levels = [];
};

WebMapLayer.prototype.init = function() {
    var that = this;

    google.maps.event.addListener(WebMap.map, 'idle', function() {
        that.update();
    });

    //handle initial load
    if (WebMap.map.getBounds()) {
        that.update();
    } else {
        google.maps.event.addListenerOnce(WebMap.map, 'bounds_changed', function() {
            that.update();
        });
    }

    this.initialized_ = true;
};

WebMapLayer.prototype.selectedItem = function () {
    return this.mapItem(this.selected_id);
};

WebMapLayer.prototype.findItem = function(id) {
    if (!id) return undefined;

    for (var i in this.levels) {
        var l = this.levels[i];
        var item = l.items[id];
        if (item)
            return item;
    }

    return undefined;
};

WebMapLayer.prototype.mapItem = function (map_item_id) {
    if (!map_item_id)
        return undefined;
    var l = this.getCurrentLevel();
    if (!l)
        return undefined;
    return l.items[map_item_id];
};

WebMapLayer.prototype.mapItems = function () {
    return this.getCurrentLevel().items;
};

WebMapLayer.prototype.enabled = function(enable) {
    if ( this.enabled_ == enable ) return;
    this.enabled_= enable;

    if (! enable) {
        this.hideLevels();
    } else if (!this.initialized_) {
        this.init();
    } else {
        this.update();
    }
};

WebMapLayer.prototype.update = function() {
    if (!this.enabled_) return;

    var level = this.getCurrentLevel();

    if (level) {
        level.update();
    } else {
        this.hideLevels();
    }
};

WebMapLayer.prototype.reset = function() {
    for (var i in this.levels)
        this.levels[i].reset();
};

WebMapLayer.prototype.loadQueryParams = function(level) {
    return { };
};

WebMapLayer.prototype.clickEventParams = function(item) {
    return {id:item.id};
};

//return object from json
WebMapLayer.prototype.createItem = function(level, data) {
    alert("You should have implemented createItem in your web map layer!");
};

//If the item is on the client this is used to get the bounds. it should return the same results as 'web_map/zoom_to'
//return one of:
//   a boundary: {n: , s:, e:, w: }
//   a center: {lat:, lng: }  -- will use section as zoom
//   a center and zoom : {lat:, lng:, zoom: } -- zoom can be a number or unit name ('section')
WebMapLayer.prototype.getItemBounds = function(item) {
    alert("You should have implemented getItemBounds in your web map layer!");
};

WebMapLayer.prototype.clickEvent = function(item) {
    this.handleClickEvent(item, item.id);
};

WebMapLayer.prototype.handleClickEvent = function(item, id) {
    WebMap.loadDetails(this.detail_url, this.clickEventParams(item) );
}

WebMapLayer.prototype.setFocusedItem = function(id) {
    this.unhighlightAll();
    this.selected_id = id;
    this.highlightSelected();
}

WebMapLayer.prototype.focusSelected = function() {
    if (!this.selected_id)
        return;

    var sel = this.findItem(this.selected_id);
    if ( sel ) {
        // if we have the item loaded then just use it's bounds
        this.completeFocusSelected( this.getItemBounds(sel) );
    } else {
        // If selected quickpick item is not on the map, zoom to it's location
        this.focusSelectedFromServer( );
    }
};

WebMapLayer.prototype.afterItemsAdded = function() {
  this.highlightSelected();
};

WebMapLayer.prototype.getLevel = function(zoom) {
    for (var i in this.levels) {
        var l = this.levels[i];
        if (zoom >= l.zoom)
            return l;
    }
    return undefined;
};

WebMapLayer.prototype.getCurrentLevel = function() {
    return this.getLevel(WebMap.map.getZoom());
};

WebMapLayer.prototype.highlight = function(item) {
    alert("You should have implemented highlight in your web map layer!");
};

WebMapLayer.prototype.unhighlight = function(item) {
    alert("You should have implemented unhighlight in your web map layer!");
};

WebMapLayer.prototype.highlightSelected = function() {
    if (!this.selected_id)
        return;

    for (var l in this.levels) {
        var i = this.levels[l].items[this.selected_id];
        if (i)
            this.highlight(i);
    }
};

WebMapLayer.prototype.  unhighlightAll = function() {
    if (!this.selected_id)
        return;

    for (var l in this.levels) {
        var i = this.levels[l].items[this.selected_id];
        if (i)
            this.unhighlight(i);
    }

    this.selected_id = null;
};

//redraw is required when there is no idle event associated to trigger the redraw
WebMapLayer.prototype.showLevel = function(level) {
    for (var i in this.levels) {
        var l = this.levels[i];
        if (l==level)
            l.show();
        else
            l.hide();
    }
};

WebMapLayer.prototype.hideLevels = function() {
    this.showLevel(undefined);
};

WebMapLayer.prototype.indexOfLevel = function(level) {
    for (var i in this.levels) {
        if (this.levels[i]==level)
            return i;
    }
    return undefined;
};

WebMapLayer.prototype.lastZoom = function(level) {
    var i =this.indexOfLevel(level);
    if (!i) return 0;
    if (i==0) return 99;
    return this.levels[i-1].zoom-1;
};

WebMapLayer.prototype.zoomQueryParams = function() {
    return { id:this.selected_id };
};

WebMapLayer.prototype.focusSelectedFromServer = function(sel) {
    var layer = this;
    $.ajax({
      dataType: 'json',
      url: 'web_map/zoom_to',
      data: layer.zoomQueryParams(),
      error: function() {
          WebMap.setCurrent('Selected item is not visible.');
          alert('This item has no visible representation on the map.')
      },
      success: function(results) {
          layer.completeFocusSelected(results);
      }
    });
};

WebMapLayer.prototype.completeFocusSelected = function(bounds) {
    if (!bounds) {
        WebMap.setCurrent("Clicked item is not mapped");

    } else if (bounds.n) {
        var llb = new google.maps.LatLngBounds();
        llb.extend(new google.maps.LatLng(bounds.s, bounds.w));
        llb.extend(new google.maps.LatLng(bounds.n, bounds.e));
        var z = WebMap.map.getZoom();
        WebMap.map.fitBounds(llb);
        this.highlightSelected();

    } else if (bounds.lat) {
        var center = new google.maps.LatLng(bounds.lat, bounds.lng);
        var zoom = bounds.zoom || 'section';
        if ( (typeof zoom)=='string')
            zoom = WebMapHelper.zoomForUnit(zoom);
        zoom = Math.max(zoom, WebMap.map.getZoom());
        WebMap.map.setOptions( { center:center, zoom:zoom } );
        this.highlightSelected();

    } else {
        WebMap.setCurrent("Clicked item is not mapped");
    }
};
