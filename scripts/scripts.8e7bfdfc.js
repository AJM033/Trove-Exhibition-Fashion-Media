"use strict";var app=angular.module("trovelistsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","picardy.fontawesome","truncate","infinite-scroll","masonry"]);app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"mc"}).when("/reload/",{templateUrl:"views/main.html",controller:"ReloadCtrl",controllerAs:"rc"}).when("/topics/",{templateUrl:"views/lists.html",controller:"ListsCtrl",controllerAs:"lsc"}).when("/topics/:order",{templateUrl:"views/list.html",controller:"ListCtrl",controllerAs:"lc"}).when("/resources/",{templateUrl:"views/items.html",controller:"ItemsCtrl",controllerAs:"isc"}).when("/resources/:order",{templateUrl:"views/item.html",controller:"ItemCtrl",controllerAs:"ic"}).otherwise({redirectTo:"/"})}]),app.controller("BaseCtrl",["$scope","$document","$location",function(a,b,c){b.scrollTop(0),"undefined"==typeof a.exhibition&&(a.listHide=!0,a.sort="order",a.isActive=function(a){var b=a===c.path();return b},a.view="list",a.exhibition=angular.element("#exhibition-name").html(),a.tagline=angular.element("#exhibition-tagline").html(),a.description=angular.element("#exhibition-description").html(),a.credit=angular.element("#exhibition-credit").html(),a.listLinks=angular.element(".list-link"),a.config=window.config)}]),app.controller("ReloadCtrl",["$rootScope","$location",function(a,b){a.failed=!1,b.url("/")}]),app.factory("ListsDataFactory",["$rootScope","$document","$http",function(a,b,c){var d={};window.config.https===!1?a.APIUrl="http://api.trove.nla.gov.au":a.APIUrl="https://trove-proxy.herokuapp.com/api";var e=function(a,b,c){var d=c.length+1;return angular.forEach(a,function(a){var e={};e.order=d,e.list=b,e.rank=.5-Math.random(),angular.forEach(a,function(a,b){if("article"===b){e.type="newspaper",e.id=a.id,e.title=a.heading,e.newspaper=a.title.value,e.date=a.date;try{e.year=parseInt(e.date.toString().match(/^([12]{1}\d{3})[\-\.\w\s]*/)[1],10)}catch(c){e.year=0}e.page=a.page,e.url=a.troveUrl}else if("work"===b){e.type="work",e.title=a.title,e.id=a.id,e.format=a.type,e.url=a.troveUrl,e.date=a.issued,"undefined"!=typeof a.contributor&&(e.contributor=a.contributor);try{e.year=parseInt(e.date.toString().match(/^([12]{1}\d{3})[\-\.\w\s]*/)[1],10)}catch(c){e.year=0}e.holdings=a.holdingsCount,angular.forEach(a.identifier,function(a){"thumbnail"===a.linktype?e.thumbnail=a.value:"fulltext"===a.linktype&&(e.fulltext=a.value,"undefined"!=typeof a.linktext&&(e.linktext=a.linktext))})}else"externalWebsite"===b?(e.type="website",e.title=a.title,angular.isArray(a.identifier)?e.url=a.identifier[0].value:e.url=a.identifier.value):"note"===b?e.note=a:"people"===b&&(e.type="people")}),"people"!==e.type&&(c.push(e),d++)}),c},f=function(a,b){var c={};return c.order=b,c.id=a.id,c.title=a.title,c.numberOfItems=a.listItemCount,c.description=a.description,"undefined"!=typeof a.identifier&&(a.identifier.value.match(/^http/)?c.thumbnail=a.identifier.value:c.thumbnail="http://trove.nla.gov.au"+a.identifier.value),[c,a.listItem]};return d.getPromises=function(){console.log("Getting...");var b=angular.element(".list-link"),d=[];return angular.forEach(b,function(b){var e=angular.element(b).attr("href").match(/id=(\d+)/)[1],f=c.jsonp(a.APIUrl+"/list/"+e+"?encoding=json&reclevel=full&include=listItems&key="+window.troveAPIKey+"&callback=JSON_CALLBACK",{cache:!0});d.push(f)}),d},d.loadResources=function(b){var c=1,d=[],g=[];angular.forEach(b,function(a){var b=f(a.data.list[0],c);d=e(b[1],c,d),g.push(b[0]),c++}),a.items=d,a.lists=g},d}]),app.filter("findById",function(){return function(a,b){for(var c=0;c<a.length;c++)if(+a[c].order===+b)return a[c]}}),app.filter("itemsInList",function(){return function(a,b){for(var c=[],d=0;d<a.length;d++)+a[d].list===+b&&c.push(a[d]);return c}}),app.filter("itemsWithThumbnails",function(){return function(a){for(var b=[],c=0;c<a.length;c++)"undefined"!=typeof a[c].thumbnail&&b.push(a[c]);return b}}),app.filter("randomItems",["$filter",function(a){return function(b,c){var d=[],e=a("itemsWithThumbnails")(b);if(e.length>c)for(var f=0;10>f;f++){var g=Math.floor(Math.random()*e.length);d.push(e.splice(g,1))}else d=e;return d}}]),app.filter("dateFormat",["$filter",function(a){return function(b){var c="";if("undefined"!=typeof b){var d=b.split("-");c=1===d.length?b:2===d.length?a("date")(b+"-01","MMMM yyyy"):a("date")(b,"d MMMM yyyy")}return c}}]),angular.module("trovelistsApp").controller("MainCtrl",["$scope","$rootScope","$routeParams","$document","$filter","$http","$q","ListsDataFactory",function(a,b,c,d,e,f,g,h){if(d.scrollTop(0),"undefined"==typeof b.items&&b.failed!==!0){var i=1,j=function(){var a=h.getPromises();g.all(a).then(function(a){h.loadResources(a)},function(){1>i?(i++,j()):b.failed=!0})};j()}}]),angular.module("trovelistsApp").controller("ListsCtrl",["$scope","$rootScope","$routeParams","$document","$filter","$http","$q","$location","ListsDataFactory",function(a,b,c,d,e,f,g,h,i){if(d.scrollTop(0),"undefined"==typeof b.items&&b.failed!==!0){var j=1,k=function(){var a=i.getPromises();g.all(a).then(function(a){i.loadResources(a)},function(){1>j?(j++,k()):b.failed=!0})};k()}else b.failed===!0&&h.url("/")}]),angular.module("trovelistsApp").controller("ListCtrl",["$scope","$rootScope","$routeParams","$document","$filter","$http","$q","$location","ListsDataFactory",function(a,b,c,d,e,f,g,h,i){d.scrollTop(0),a.nextList=function(){var a=parseInt(c.order,10);a<b.lists.length&&h.path("topics/"+(a+1))},a.previousList=function(){var a=parseInt(c.order,10);1!==a&&h.url("topics/"+(a-1))};var j=function(){var d=e("findById")(b.lists,c.order);a.list=d};if("undefined"==typeof b.items&&b.failed!==!0){var k=1,l=function(){var a=i.getPromises();g.all(a).then(function(a){i.loadResources(a),j()},function(){1>k?(k++,l()):b.failed=!0})};l()}else b.failed===!0?h.url("/"):j()}]),angular.module("trovelistsApp").controller("ItemsCtrl",["$scope","$rootScope","$routeParams","$document","$filter","$http","$q","$location","ListsDataFactory",function(a,b,c,d,e,f,g,h,i){if(d.scrollTop(0),a.view="list",a.totalDisplayed=20,a.loadMore=function(){a.totalDisplayed<a.items.length&&(a.totalDisplayed+=20)},"undefined"==typeof b.items&&b.failed!==!0){var j=1,k=function(){var a=i.getPromises();g.all(a).then(function(a){i.loadResources(a)},function(){1>j?(j++,k()):b.failed=!0})};k()}else b.failed===!0&&h.url("/")}]),angular.module("trovelistsApp").controller("ItemCtrl",["$scope","$rootScope","$routeParams","$document","$filter","$http","$q","$location","ListsDataFactory",function(a,b,c,d,e,f,g,h,i){d.scrollTop(0),a.nextItem=function(){var a=parseInt(c.order,10);a<b.items.length&&h.path("resources/"+(a+1))},a.previousItem=function(){var a=parseInt(c.order,10);1!==a&&h.url("resources/"+(a-1))},a.showText=function(b){"snippet"===b?(a.displayText=e("words")(a.articleText,100),a.fullText=!1):(a.displayText=a.articleText,a.fullText=!0)};var j=function(){var d=e("findById")(b.items,c.order);a.item=d,"newspaper"===d.type?f.jsonp(b.APIUrl+"/newspaper/"+d.id+"?encoding=json&reclevel=full&include=articletext&key="+window.troveAPIKey+"&callback=JSON_CALLBACK",{cache:!0}).then(function(b){a.articleText=b.data.article.articleText,a.words=b.data.article.wordCount,a.showText("snippet")}):"work"===d.type&&1===d.holdings&&f.jsonp(b.APIUrl+"/work/"+d.id+"?encoding=json&reclevel=full&include=holdings&key="+window.troveAPIKey+"&callback=JSON_CALLBACK",{cache:!0}).then(function(c){var d;try{d=c.data.work.holding[0].nuc}catch(e){}"undefined"!=typeof d&&f.jsonp(b.APIUrl+"/contributor/"+d+"?encoding=json&key="+window.troveAPIKey+"&callback=JSON_CALLBACK",{cache:!0}).then(function(b){a.repository=b.data.contributor.name.replace(/\.$/,"")})})};if("undefined"==typeof b.items&&b.failed!==!0){var k=1,l=function(){var a=i.getPromises();g.all(a).then(function(a){i.loadResources(a),j()},function(){1>k?(k++,l()):(b.failed=!0,h.url("/"))})};l()}else b.failed===!0?h.url("/"):j()}]),angular.module("trovelistsApp").run(["$templateCache",function(a){a.put("views/item.html",'<div class="loading text-muted" ng-hide="lists"><fa name="spinner" size="5" spin></fa><br>Loading resources&hellip;</div> <div class="row" ng-show="item" ng-swipe-left="nextItem()" ng-swipe-right="previousItem()"> <div class="col-md-4 col-md-push-8" ng-if="item.type != \'newspaper\'"> <a ng-if="item.fulltext" href="{{ item.fulltext }}" title="View digitised item"><img ng-if="item.type != \'newspaper\' && item.thumbnail" ng-src="{{ item.thumbnail }}" class="thumbnail center-cropped-large"></a> <img ng-if="item.type != \'newspaper\' && item.thumbnail && !item.fulltext" ng-src="{{ item.thumbnail }}" class="thumbnail center-cropped-large"> </div> <div class="col-md-8 col-md-pull-4" ng-if="item.type != \'newspaper\'"> <h3>{{ item.title }}</h3> <p class="lead">{{ item.format[0]}}<span ng-if="item.date">, {{ item.date }}</span></p> <dl> <dt ng-if="item.format.length > 1">Additional formats</dt> <dd ng-if="item.format.length > 1"> <ul> <li ng-repeat="format in item.format.slice(1)">{{ format }}</li> </ul> </dd> <dt ng-if="item.contributor">Contributors</dt> <dd ng-if="item.contributor"> <ul> <li ng-repeat="contributor in item.contributor">{{ contributor }}</li> </ul> </dd> </dl> <p>Part of <a href="#/topics/{{ lists[item.list - 1].order }}">{{ lists[item.list - 1].title }}</a></p> <p><a href="{{ item.url }}">More details at Trove <fa name="external-link"></fa></a></p> <p ng-if="item.linktext && item.fulltext && config.directLinks === true"><a href="{{ item.fulltext }}">{{ item.linktext }} <fa name="external-link"></fa></a></p> <p ng-if="!item.linktext && item.fulltext && config.directLinks === true"><a href="{{ item.fulltext }}">View digitised item <span ng-if="repository">at {{ repository }} </span><fa name="external-link"></fa></a></p> <nav> <ul class="pager"> <li class="previous" ng-class="{disabled: item.order === 1}"><a ng-href="{{(item.order === 1) ? \'\' : \'#/resources/\' + (item.order - 1)}}"><span aria-hidden="true">&larr;</span> Previous</a></li> <li ng-class="{disabled: item.order === items.length}"><a ng-href="{{(item.order === items.length) ? \'\' : \'#/resources/\' + (item.order + 1)}}">Next <span aria-hidden="true">&rarr;</span></a></li> </ul> </nav> </div> <div class="col-md-8" ng-if="item.type == \'newspaper\'"> <h3>{{ item.title }}</h3> <p class="lead">{{ item.date | dateFormat }}</p> <p><em>{{ item.newspaper }}</em>, page {{ item.page }}</p> <p class="well" ng-if="item.note" ng-bind-html="item.note"></p> <p>Part of <a href="#/topics/{{ lists[item.list - 1].order }}">{{ lists[item.list - 1].title }}</a></p> <p><a href="{{ item.url }}">View digitised article at Trove <fa name="external-link"></fa></a></p> <nav> <ul class="pager"> <li class="previous" ng-class="{disabled: item.order === 1}"><a ng-href="{{(item.order === 1) ? \'\' : \'#/resources/\' + (item.order - 1)}}"><span aria-hidden="true">&larr;</span> Previous</a></li> <li ng-class="{disabled: item.order === items.length}"><a ng-href="{{(item.order == items.length) ? \'\' : \'#/resources/\' + (item.order + 1)}}">Next <span aria-hidden="true">&rarr;</span></a></li> </ul> </nav> </div> <div class="col-md-4" ng-if="item.type == \'newspaper\'"> <div class="newspaper-text" ng-bind-html="displayText"></div> <p ng-show="!fullText"><a href="" ng-click="showText()">Show all {{ words }} words</a> </p><p ng-show="fullText"><a href="" ng-click="showText(\'snippet\')">Show first 100 words</a></p> </div> </div>'),a.put("views/items.html",'<h2>Resources</h2> <div class="loading text-muted" ng-hide="lists"><fa name="spinner" size="5" spin></fa><br>Loading resources&hellip;</div> <div ng-show="items"> <p ng-show="config.showGrid"> <button title="Show all items" ng-click="view = \'list\'; totalDisplayed = 20"><fa name="list"></fa></button> <button title="Show items with thumbnails" ng-click="view = \'grid\'; totalDisplayed = 50"><fa name="th"></fa></button> </p> <form class="form-inline items-filter" role="search"> <div ng-show="view == \'list\'" class="form-group"> <label>Order by:</label> <select class="form-control" ng-model="sort"> <option value="order">Topic</option> <option value="title">Title</option> <option value="year">Year</option> </select> </div> <div class="form-group"> <label>Filter by:</label> <div class="input-group"> <input ng-model="query" type="text" class="form-control" placeholder="query" ng-minlength="3"> <div class="input-group-addon"><fa name="search"></fa></div> </div> </div> </form> </div> <div infinite-scroll="loadMore()" infinite-scroll-distance="3"> <div ng-if="view == \'list\'" class="media item-listing" ng-repeat="item in items | filter:query | orderBy:sort | limitTo:totalDisplayed"> <div class="media-left"> <a ng-href="#/resources/{{ item.order }}"> <img ng-if="item.thumbnail" class="thumbnail media-object center-cropped" ng-src="{{ item.thumbnail }}" alt="Thumbnail for {{ item.title }}"> <div ng-if="!item.thumbnail && item.type == \'newspaper\'" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="newspaper-o" size="4"></fa></div> <div ng-if="!item.thumbnail && item.type == \'work\'" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="photo" size="4"></fa></div> <div ng-if="!item.thumbnail && item.type == \'website\'" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="globe" size="4"></fa></div> </a> </div> <div class="media-body"> <h4 class="media-heading">{{ item.title }}</h4> <p ng-if="item.type == \'newspaper\'">{{ item.date | dateFormat }}<br><em>{{ item.newspaper}}</em><br><a href="#/resources/{{ item.order }}">View details</a></p> <p ng-if="item.type == \'work\'">{{ item.format[0]}}<br>{{ item.date}}<br><a href="#/resources/{{ item.order }}">View details</a></p> <p ng-if="item.type == \'website\'"><a href="{{ item.url }}">View site <fa name="external-link"></fa></a></p> </div> </div> </div> <div infinite-scroll="loadMore()" infinite-scroll-distance="3"> <div ng-if="view == \'grid\'"> <ul class="wall" masonry="{ &quot;itemSelector&quot;: &quot;.wall-item&quot;, &quot;columnWidth&quot;: 110, &quot;gutter&quot;: 5}"> <li masonry-tile ng-repeat="item in items | itemsWithThumbnails | orderBy:\'rank\' | filter:query" class="wall-item"> <a ng-href="#/resources/{{ item.order }}" title="{{ item.title }}"> <img class="center-cropped-wall thumbnail" ng-src="{{ item.thumbnail }}" alt="Thumbnail for {{ item.title }}"> </a> </li> </ul> </div> </div>'),a.put("views/list.html",'<div class="loading text-muted" ng-hide="lists"><fa name="spinner" size="5" spin></fa><br>Loading resources&hellip;</div> <div ng-show="list" ng-swipe-left="nextList()" ng-swipe-right="previousList()"> <h2>{{ list.title }}</h2> <p ng-if="list.description" class="lead" ng-bind-html="list.description"></p> <p><a ng-href="http://trove.nla.gov.au/list?id={{ list.id }}">View list on Trove <fa name="external-link"></fa></a></p> <div class="media" ng-if="lists" ng-repeat="item in items | itemsInList:list.order"> <div class="media-left"> <a ng-href="#/resources/{{ item.order }}"> <img ng-if="item.thumbnail" class="thumbnail media-object center-cropped" ng-src="{{ item.thumbnail }}" alt="Thumbnail for {{ item.title }}"> <div ng-if="!item.thumbnail && item.type == \'newspaper\'" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="newspaper-o" size="4"></fa></div> <div ng-if="!item.thumbnail && item.type == \'work\'" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="photo" size="4"></fa></div> <div ng-if="!item.thumbnail && item.type == \'website\'" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="globe" size="4"></fa></div> </a> </div> <div class="media-body"> <h4 class="media-heading">{{ item.title }}</h4> <p ng-if="item.type == \'newspaper\'">{{ item.date | dateFormat }}<br><em>{{ item.newspaper}}</em><br><a href="#/resources/{{ item.order }}">View details</a></p> <p ng-if="item.type == \'work\'">{{ item.format[0] }}<br>{{ item.date}}<br><a href="#/resources/{{ item.order }}">View details</a></p> <p ng-if="item.type == \'website\'"><a href="{{ item.url }}">View site <fa name="external-link"></fa></a></p> </div> </div> <nav> <ul class="pager"> <li class="previous" ng-class="{disabled: list.order === 1}"><a ng-href="{{(list.order === 1) ? \'\' : \'#/topics/\' + (list.order - 1)}}"><span aria-hidden="true">&larr;</span> Previous</a></li> <li ng-class="{disabled: list.order === lists.length}"><a ng-href="{{(list.order === lists.length) ? \'\' : \'#/topics/\' + (list.order + 1)}}">Next <span aria-hidden="true">&rarr;</span></a></li> </ul> </nav> </div>'),a.put("views/lists.html",'<h3>Topics</h3> <div class="loading text-muted" ng-hide="lists"><fa name="spinner" size="5" spin></fa><br>Loading resources&hellip;</div> <div class="media" ng-repeat="(id, list) in lists"> <div class="media-left"> <a ng-href="#/topics/{{ list.order }}"> <img ng-if="list.thumbnail" class="thumbnail media-object center-cropped" ng-src="{{ list.thumbnail }}" alt="Thumbnail for {{ list.title }}"> <div ng-if="!list.thumbnail" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="list" size="4"></fa></div> </a> </div> <div class="media-body"> <h4 class="media-heading">{{ list.title }}</h4> <div ng-if="list.description" ng-bind-html="list.description | words:config.listSnippet"></div> <a ng-href="#/topics/{{ list.order }}">Browse {{ list.numberOfItems}} items</a> </div> </div>'),a.put("views/main.html",'<div class="row"> <div class="col-xs-12 title-block"> <h1 class="pagehead">{{ exhibition }}<small ng-if="tagline"> {{ tagline }}</small></h1> </div> </div> <div class="row"> <div class="col-xs-12"> <p class="lead" ng-if="description" ng-bind-html="description"></p> <div class="loading text-muted" ng-hide="lists.length > 0 || failed"><fa name="spinner" size="5" spin></fa><br>Loading resources&hellip;</div> </div> </div> <div class="row"> <div class="col-md-7" ng-if="lists"> <h3>Topics</h3> <div class="media" ng-repeat="(id, list) in lists"> <div class="media-left"> <a ng-href="#/topics/{{ list.order }}"> <img ng-if="list.thumbnail" class="thumbnail media-object center-cropped" ng-src="{{ list.thumbnail }}" alt="Thumbnail for {{ list.title }}"> <div ng-if="!list.thumbnail" class="thumbnail media-object center-cropped"><fa class="blank-icon" name="list" size="4"></fa></div> </a> </div> <div class="media-body"> <h4 class="media-heading">{{ list.title }}</h4> <div ng-if="list.description" ng-bind-html="list.description | words:config.listSnippet"></div> <a ng-href="#/topics/{{ list.order }}">Browse {{ list.numberOfItems}} items</a> </div> </div> </div> <div class="col-md-4 col-md-offset-1" ng-if="items"> <h3>Resources</h3> <div class="clearfix"> <a ng-href="#/resources/{{ item.order }}" class="pull-left" ng-repeat="item in items | itemsWithThumbnails | orderBy:\'rank\' | limitTo:12" title="{{ item.title }}"> <img class="thumbnail center-cropped" ng-src="{{ item.thumbnail }}" alt="Thumbnail for {{ item.title }}"> </a> </div> <p><a href="#/resources/">Browse all {{ items.length }} resources</a></p> </div> <div class="col-md-12" ng-show="failed"> <p>There was a problem loading this exhibition. You can still browse the content on Trove: <ul> <li ng-repeat="link in listLinks"><a href="{{ link.href }}">{{ link.text }} <fa name="external-link"></fa></a></li> </ul> </p><p>You can also try <a href="#/reload/">reloading</a> this exhibition.</p> </div> </div>')}]);