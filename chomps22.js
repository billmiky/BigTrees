/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var info = {};

var stuff = {};

(function($){
    
    info.Tree = Backbone.Model.extend({
    });
    
    info.Trees = Backbone.Collection.extend({
        model: info.Tree,
        url: "bigtreesall.json",
        /*
        comparator: function(tree){
            var date = new Date(tree.get('date'));
            return date.getTime();
        }
        */
    });
    
    info.TreeListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'trees-list',
        attributes: {"data-role": 'listview',
        			"data-filter": 'true'},
        
        initialize: function() {
            this.collection.bind('add', this.render, this);
            this.template = _.template($('#tree-list-item-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                trees = this.collection,
                template = this.template,
                listView = $(this.el);
                
            $(this.el).empty();
            trees.each(function(tree){
                var renderedItem = template(tree.toJSON()),
                    $renderedItem = $(renderedItem);  //convert the html into an jQuery object
                    $renderedItem.jqmData('treeId', tree.get('id'));  //set the data on it for use in the click event
                $renderedItem.bind('click', function(){
                    //set the tree id on the page element for use in the details pagebeforeshow event
                    $('#tree-details').jqmData('treeId', $(this).jqmData('treeId'));  //'this' represents the element being clicked
                });
                listView.append($renderedItem);
            });
            container.html($(this.el));
            container.trigger('create');
            return this;
        }
    });
    
    info.TreeDetailsView = Backbone.View.extend({
        //since this template will render inside a div, we don't need to specify a tagname
        initialize: function() {
            this.template = _.template($('#tree-details-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                tree = this.model,
                renderedContent = this.template(this.model.toJSON());
                
            container.html(renderedContent);
            container.trigger('create');
            return this;
        }
    });
    
    info.initData = function(){
        info.trees = new info.Trees();
        info.trees.fetch({async: false});  // use async false to have the app wait for data before rendering the list
    };
    
    
    stuff.Forest = Backbone.Model.extend({
    });
    
    stuff.Forests = Backbone.Collection.extend({
        model: stuff.Forest,
        url: "oldgrowth.json",
        /*
        comparator: function(forest){
            var date = new Date(forest.get('date'));
            return date.getTime();
        }
        */
    });
    
    stuff.ForestListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'forests-list',
        attributes: {"data-role": 'listview',
        			"data-filter": 'true'},
        
        initialize: function() {
            this.collection.bind('add', this.render, this);
            this.template = _.template($('#forest-list-item-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                forests = this.collection,
                template = this.template,
                listView = $(this.el);
                
            $(this.el).empty();
            forests.each(function(forest){
                var renderedItem = template(forest.toJSON()),
                    $renderedItem = $(renderedItem);  //convert the html into an jQuery object
                    $renderedItem.jqmData('forestId', forest.get('id'));  //set the data on it for use in the click event
                $renderedItem.bind('click', function(){
                    //set the forest id on the page element for use in the details pagebeforeshow event
                    $('#forest-details').jqmData('forestId', $(this).jqmData('forestId'));  //'this' represents the element being clicked
                });
                listView.append($renderedItem);
            });
            container.html($(this.el));
            container.trigger('create');
            return this;
        }
    });
    
    stuff.ForestDetailsView = Backbone.View.extend({
        //since this template will render inside a div, we don't need to specify a tagname
        initialize: function() {
            this.template = _.template($('#forest-details-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                forest = this.model,
                renderedContent = this.template(this.model.toJSON());
                
            container.html(renderedContent);
            container.trigger('create');
            return this;
        }
    });
    
    stuff.initData = function(){
        stuff.forests = new stuff.Forests();
        stuff.forests.fetch({async: false});  // use async false to have the app wait for data before rendering the list
    };

    
    
}(jQuery));

$('#trees').live('pageinit', function(event){
    var treesListContainer = $('#trees').find(":jqmData(role='content')"),
        treesListView;
    info.initData();
    treesListView = new info.TreeListView({collection: info.trees, viewContainer: treesListContainer});
     $.mobile.showPageLoadingMsg();
    treesListView.render();
});


$('#tree-details').live('pagebeforeshow', function(){
    console.log('treeId: ' + $('#tree-details').jqmData('treeId'));
    var treesDetailsContainer = $('#tree-details').find(":jqmData(role='content')"),
        treeDetailsView,
        treeId = $('#tree-details').jqmData('treeId'),
        treeModel = info.trees.get(treeId);
    
    treeDetailsView = new info.TreeDetailsView({model: treeModel, viewContainer: treesDetailsContainer});
    treeDetailsView.render();
});


$('#forests').live('pageinit', function(event){
    var forestsListContainer = $('#forests').find(":jqmData(role='content')"),
        forestsListView;
    stuff.initData();
    forestsListView = new stuff.ForestListView({collection: stuff.forests, viewContainer: forestsListContainer});
    forestsListView.render();
});


$('#forest-details').live('pagebeforeshow', function(){
    console.log('forestId: ' + $('#forest-details').jqmData('forestId'));
    var forestsDetailsContainer = $('#forest-details').find(":jqmData(role='content')"),
        forestDetailsView,
        forestId = $('#forest-details').jqmData('forestId'),
        forestModel = stuff.forests.get(forestId);
    
    forestDetailsView = new stuff.ForestDetailsView({model: forestModel, viewContainer: forestsDetailsContainer});
    forestDetailsView.render();
});

/*
$('#map_page').live("pageinit", function() {
          //     $('#map_canvas').gmap({ 'mapTypeId': 'SATELLITE' });
                         $('#map_canvas').gmap('refresh');
        });
        */
        
        $('#map_page').live("pagecreate", function() {
        //      $('#map_canvas').gmap({ 'mapTypeId': 'SATELLITE' });
        //         $('#map_canvas').gmap('loadKML', 'bigtrees2', 'http://greenskydesigns.com/bigtrees/bigtrees2.kml', null);
        
                 $('#map_canvas').gmap({ 'center': '39.828175, -98.5795', 'zoom': 3, zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.TOP_RIGHT
    }, mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: false }).bind('init', function() {	
	$('#map_canvas').gmap('loadFusion', { 'query': { 'from': 2837415 } } );
	
	$('#map_canvas').gmap('refresh');
});
        
        
        });
        
 /*
  $('#treeMap').live("pageinit", function() {
          //     $('#map_canvas').gmap({ 'mapTypeId': 'SATELLITE' });
                         $('#treeMap_canvas').gmap('refresh');
        });
        
        */
        $('#treeMap').live("pagecreate", function() {
        //      $('#map_canvas').gmap({ 'mapTypeId': 'SATELLITE' });
        //         $('#map_canvas').gmap('loadKML', 'bigtrees2', 'http://greenskydesigns.com/bigtrees/bigtrees2.kml', null);
          
                $('#treeMap_canvas').gmap({ 'center': '39.828175, -98.5795', 'zoom': 3 }).bind('init', function() {	
	$('#treeMap_canvas').gmap('loadFusion', { 'query': { 'from': 2836771 } } );
	$('#treeMap_canvas').gmap('refresh');
});
        
        });
        
       /* 
 $('#forestMap').live("pageinit", function() {
          //     $('#map_canvas').gmap({ 'mapTypeId': 'SATELLITE' });
                        $('#forestMap_canvas').gmap('refresh');
        });
        
        */
        $('#forestMap').live("pagecreate", function() {
        //      $('#map_canvas').gmap({ 'mapTypeId': 'SATELLITE' });
        //         $('#map_canvas').gmap('loadKML', 'bigtrees2', 'http://greenskydesigns.com/bigtrees/bigtrees2.kml', null);
        $('#forestMap_canvas').gmap({ 'center': '39.828175, -98.5795', 'zoom': 3 }).bind('init', function() {	
	$('#forestMap_canvas').gmap('loadFusion', { 'query': { 'from': 2857510 } } );
	$('#forestMap_canvas').gmap('refresh');
});
        
        });

 
  
 
function ReloadPage() { 
   location.reload();
};