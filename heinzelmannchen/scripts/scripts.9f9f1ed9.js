"use strict";angular.module("heinzelmannchen",["ngAnimate","ngCookies","ngResource","ngRoute","ngTouch","ngMaterial"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/graph",{templateUrl:"views/heinz.html",controller:"HeinzCtrl",reloadOnSearch:!1}).when("/token",{template:"<p>Accepting Token</p>",controller:"TokenReceiverCtrl"}).otherwise({redirectTo:"/"})}]).config(["$mdThemingProvider",function(a){var b=a.extendPalette("indigo",{500:"00254A"}),c=a.extendPalette("amber",{500:"FCB43B"});a.definePalette("cotivityBlue",b),a.definePalette("cotivityYellow",c),a.theme("default").primaryPalette("cotivityBlue").accentPalette("cotivityYellow")}]),angular.module("heinzelmannchen").controller("TokenReceiverCtrl",["$location","$routeParams",function(a,b){if(b.access_token){var c=b.access_token;localStorage.heinzAuth=c,a.search("access_token",null),a.search("scope",null),a.search("state",null),a.search("token_type",null),a.path("/graph")}}]),angular.module("heinzelmannchen").controller("HeinzCtrl",["$routeParams","$location","RepoData","HighlightData","$scope","$mdSidenav","defaultHighlightColor","defaultHighlightShape",function(a,b,c,d,e,f,g,h){function i(b,c,d){a[b]?"string"==typeof a[b]?c(a[b]):"[object Array]"===Object.prototype.toString.call(a[b])?_.each(a[b],function(a){c(a)}):alert("Your query paramerter contained unexpected data in param "+b+"."):d&&d()}i("repo",function(a){c.addRepoString(a)},function(){c.addRepoString("cotiviti/heinzelmannchen")}),i("hl",function(a){var b=a.split("$");d.silentAdd({id:Math.random(),searchKey:b[0],color:b.length>1?b[1]:g,shape:b.length>2?b[2]:h})}),e.toggleSideNav=function(){f("right").toggle()}}]),angular.module("heinzelmannchen").controller("LoginCtrl",["$scope","$location","GithubApi",function(a,b,c){a.authorize=c.redirectToAuth,localStorage.heinzAuth&&b.path("/graph")}]),angular.module("heinzelmannchen").service("GithubApi",["$http","IssueData","$window","authProxyUrl","$location",function(a,b,c,d,e){function f(){return localStorage.heinzAuth}function g(){var a=c.location.hash,b=a.indexOf("?"),e=b>0?a.substr(b):"";c.location.href=d+e}function h(){var a=f();a||g()}function i(a,b,c){var d=c?"&page="+c:"";return"https://api.github.com/repos/"+a+"/"+b+"/issues?per_page=50"+d}function j(c,d,e){h();var k=i(c,d,e);console.debug("loading: "+k),a.get(k,{headers:{Authorization:"token "+f()}}).then(function(a){b.add(a.data);var f=a.headers("link");f&&f.indexOf('rel="next"')>0&&j(c,d,(e||1)+1)},function(a){401===a.status?g():console.error(data)})}function k(){return h(),a.get("https://api.github.com/user",{headers:{Authorization:"token "+f()}})}return{loadIssues:j,user:k,redirectToAuth:g}}]),angular.module("heinzelmannchen").constant("graphConfig",{color:d3.scale.category20(),zoom:d3.behavior.zoom()}).constant("authProxyUrl","https://heinzelmannchen.herokuapp.com/get_code").constant("defaultHighlightColor","#64dd17").constant("defaultHighlightShape","c"),angular.module("heinzelmannchen").service("IssueData",["$rootScope",function(a){function b(){a.$broadcast("updateGraph")}function c(){return g}function d(a){for(var c=0;c<a.length;c++)g.push(a[c]);b()}function e(){g=[],b()}function f(a){g=_.reject(g,function(b){return b.url.indexOf(a.org+"/"+a.name)>=0}),b()}var g=[];return{add:d,clear:e,get:c,removeIssuesForRepo:f}}]),angular.module("heinzelmannchen").directive("dependencyGraph",["$rootScope","IssueData","IssueSyntax","graphConfig","HighlightData",function(a,b,c,d,e){return{template:"",restrict:"A",replace:!0,link:function(f,g,h){function i(a){function b(b){return _.map(_.values(a[b]),function(a){return a.type=b,a})}function e(){var a=d3.event.translate,b=d3.event.scale;s.attr("transform","translate("+a+") scale("+b+")")}function f(){d3.event.sourceEvent.stopPropagation()}var g=document.getElementById("view-wrapper").clientWidth,h=document.getElementById("view-wrapper").clientHeight-document.getElementById("tool-bar").clientHeight,i=d3.layout.force().charge(-300).linkDistance(80).size([g,h]),j=i.drag().origin(function(a){return a}).on("dragstart",f);d3.select("#dependency-graph").select("svg").remove();var k=d3.select("#dependency-graph").append("svg").attr("width",g).attr("height",h).call(d.zoom.on("zoom",e)).on("dblclick.zoom",null),l=b("users"),m=b("issues"),n=b("milestones"),o=_.union(l,m,n),p=[];_.each(a.milestoneDependencies,function(b){p.push({source:a.milestones[b.milestone],target:a.issues[b.issue]})}),_.each(a.userDependencies,function(b){p.push({source:a.issues[b.issue],target:a.users[b.user]})}),_.each(a.indicationDependencies,function(b){p.push({source:a.issues[b.source],target:a.issues[b.target]})});var q={nodes:o,links:p},r=k.append("svg:defs");r.selectAll(".avatar").data(l).enter().append("pattern").attr("id",function(a){return"avatar_"+a.id}).attr("width","20").attr("height","20").attr("x",0).attr("y",0).attr("viewbox","0 0 20 20").append("svg:image").attr("xlink:href",function(a){return a.avatar_url}).attr("width",40).attr("height",40).attr("x",0).attr("y",0).attr("class","avatar"),k.append("svg:defs").selectAll("marker").data([["endBig",45],["endDefault",28]]).enter().append("svg:marker").attr("id",function(a){return a[0]}).attr("viewBox","0 -5 10 10").attr("refX",function(a){return a[1]}).attr("refY",0).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5");var s=k.append("g").attr("id","graph-container");i.nodes(q.nodes).links(q.links).start();var t=s.selectAll(".link").data(q.links).enter().append("line").attr("class","link").attr("marker-end",function(a){return"users"===a.target.type?"url(#endBig)":"url(#endDefault)"}).style("stroke-width",function(a){return Math.sqrt(a.value)}),u=s.selectAll(".node").data(q.nodes).enter().append("circle").attr("class",function(a){var b="node";return b+=" "+a.type}).classed("recently-modified",function(a){if(a.created_at){var b=new Date(a.updated_at);if((new Date).getTime()-b.getTime()<864e5)return!0}return!1}).attr("r",function(a){return"users"===a.type?20:10}).attr("number",function(a){return a.number}).attr("type",function(a){return a.type}).attr("labels",function(a){return c.labelsString(a)}).style("fill",function(a){return"users"===a.type?"url(#avatar_"+a.id+")":void 0}).on("click",function(a,b){!d3.event.defaultPrevented&&a.html_url&&window.open(a.html_url,"_blank").focus()}).call(j);u.append("title").text(function(a){return"users"===a.type?a.login:"issues"===a.type?c.parseIssueUrl(a.html_url).repo+"#"+a.number+" - "+a.title:"milestones"===a.type?"M - "+a.title:"issues"===a.type?a.title:void 0}),i.on("tick",function(){t.attr("x1",function(a){return a.source.x}).attr("y1",function(a){return a.source.y}).attr("x2",function(a){return a.target.x}).attr("y2",function(a){return a.target.y}),u.attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y})})}a.$on("updateGraph",function(){var a=c.processIssues(b.get());i(a),e.reapplyHighlights()})}}}]),angular.module("heinzelmannchen").service("IssueSyntax",function(){function a(a){var b={},c=[],e=[],f=[],g=[];return _.each(a,function(h){h.milestone&&(b[h.milestone.id]||(b[h.milestone.id]=h.milestone),e.push({milestone:h.milestone.id,issue:h.id})),h.assignee&&(c[h.assignee.id]||(c[h.assignee.id]=h.assignee),f.push({user:h.assignee.id,issue:h.id}));var i=d(h).map(function(b){return _.find(a,function(a){return a.html_url==b})||b});_.each(i,function(a){a.id?g.push({source:h.id,target:a.id}):console.warn("Referenced issue "+a+" was not found as referenced in "+h.html_url)})}),{issues:_.indexBy(a,"id"),users:c,milestones:b,milestoneDependencies:e,userDependencies:f,indicationDependencies:g}}function b(a,b,c){for(var d,e=/\* \[ \] (\#|https:\/\/github\.com\/(.*)\/(.*)\/issues\/)(\d+).*/g,f=[];d=e.exec(a);){var g=d[4],h=d[2]||b,i=d[3]||c;f.push("https://github.com/"+h+"/"+i+"/issues/"+g)}return f}function c(a){var b=/https:\/\/github\.com\/(.*)\/(.*)\/(issues|pull)\/\d+.*/g,c=b.exec(a),d="???",e="???";if(c)var d=c[1],e=c[2];return{org:d,repo:e}}function d(a){if(!a.body)return[];var d=c(a.html_url),e=d.org,f=d.repo,g=a.body.indexOf("# Dependencies");if(0>g)return[];var h=a.body.substring(g);return b(h,e,f)}function e(a){return"issues"===a.type&&a.labels&&a.labels.length>0?_.pluck(a.labels,"name").join(";"):void 0}return{processIssues:a,parseIssueUrl:c,labelsString:e}}),angular.module("heinzelmannchen").directive("issueHighlight",["GraphApi","$mdToast","HighlightData","defaultHighlightColor","defaultHighlightShape",function(a,b,c,d,e){return{templateUrl:"views/issuehighlight.html",restrict:"E",link:function(a,f,g){function h(a){b.show(b.simple().textContent(a).position("top right").hideDelay(2e3))}a.highlightModel={terms:c.get()},a.searchByTerm=function(){var b={id:Math.random(),searchKey:a.highlightModel.search,color:d,shape:e},f=c.add(b);f.ok?(a.highlightModel.terms=c.get(),a.highlightModel.search=""):h(f.error)},a.removeTermAtIndex=function(b){a.highlightModel.terms.splice(b,1),c.reapplyHighlights()},a.updateHighlight=function(){c.reapplyHighlights()},a.shapeIcon=function(a){var b={c:"circle",o:"outline",h:"hidden"};return b[a]},a.toggleShape=function(b){var d=["c","o","h"],e=a.highlightModel.terms[b],f=(d.indexOf(e.shape)+1)%d.length;e.shape=d[f],c.reapplyHighlights()}}}}]),angular.module("heinzelmannchen").directive("onEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.onEnter)}),b.preventDefault())})}}),angular.module("heinzelmannchen").directive("resizeWatcher",["$rootScope","$window",function(a,b){return{restrict:"A",link:function(c,d,e){var f=b.innerWidth,g=b.innerHeight;angular.element(b).bind("resize",function(){(f!==b.innerWidth||g!==b.innerHeight)&&a.$broadcast("updateGraph"),f=b.innerWidth,g=b.innerHeight})}}}]),angular.module("heinzelmannchen").directive("userinfo",["GithubApi","$location",function(a,b){return{template:'<div class="user-info" layout="column" layout-align="center center"><div><img class="md-whiteframe-3dp" ng-src="{{user.avatar_url}}"/></div><div><h4>{{user.name || user.login}}</h4></div><div id="logout" ng-click="logout()">logout</div></div>',restrict:"E",link:function(c,d,e){c.userModel={},a.user().then(function(a){c.user=a.data}),c.logout=function(){localStorage.removeItem("heinzAuth"),b.url("/")}}}}]),angular.module("heinzelmannchen").service("RepoData",["$rootScope","GithubApi","$location","IssueData",function(a,b,c,d){function e(){var a=_.map(f(),function(a){return a.org+"/"+a.name});c.search("repo",a)}function f(){return k}function g(a){b.loadIssues(a.org,a.name),k.push(a),e()}function h(a){var b=a.replace(/ /g,"").split("/");if(2===b.length){var c={org:b[0],name:b[1]};g(c)}else alert('Please provide the repo information in the form of "org/repo".'),console.error("invalid repo string: "+a)}function i(){k=[],d.clear(),e()}function j(a){k=_.reject(k,function(b){return b.name===a.name&&b.org===a.org}),d.removeIssuesForRepo(a),e()}var k=[];return{add:g,addRepoString:h,clear:i,get:f,remove:j}}]),angular.module("heinzelmannchen").directive("repoList",["RepoData","$rootScope",function(a,b){return{templateUrl:"views/repolist.html",restrict:"E",link:function(b,c,d){b.repoModel={repos:a.get()},b.addRepo=function(c){a.addRepoString(c),b.repoModel.search=""},b.resetRepos=function(){a.clear(),b.repoModel.repos=a.get()},b.removeRepoAtIndex=function(c){var d=b.repoModel.repos[c];a.remove(d),b.repoModel.repos=a.get()}}}}]),angular.module("heinzelmannchen").service("GraphApi",function(){function a(){d3.selectAll("circle.searched").style("fill",null).style("stroke",null).style("stroke-width",null),d3.selectAll("circle").classed("pulse",!1).classed("searched",!1)}function b(a){var b=a.searchKey,g=[];return c(b)?g=e(a):d(b)&&(g=f(b.substr(b.indexOf(":")+1))),g.length>0&&g[0].length>0?(g.classed("searched",!0),"o"==a.shape?(g.style("stroke",a.color),g.style("stroke-width","4px")):"c"==a.shape&&g.style("fill",a.color),!0):(console.debug("No node found for search: "+b),!1)}function c(a){return Math.round(a)===parseInt(a,10)}function d(a){return 0===a.indexOf("label:")}function e(a){return d3.selectAll('circle.issues[number="'+a.searchKey+'"]')}function f(a){return d3.selectAll("circle.issues").filter(function(b){return _.some(b.labels,function(b){return b.name.toLowerCase()==a.toLowerCase()})})}function g(){d3.selectAll("circle.pulse").classed("pulse",!1)}return{clearAllHighlights:a,highlightTermMatch:b,clearAllPulse:g}}),angular.module("heinzelmannchen").service("HighlightData",["$rootScope","GraphApi","$location",function(a,b,c){function d(){c.search("hl",_.map(j,function(a){var b=a.searchKey;return b+=a.color?"$"+a.color:"",b+=a.shape?"$"+a.shape:""}))}function e(){return j}function f(a){j.push(a)}function g(a){if(b.clearAllPulse(),_.contains(j,a))return{error:"Issue already highlighted."};var c=b.highlightTermMatch(a);return c?(j.push(a),d(),{ok:!0}):{error:"No match found."}}function h(){j=[],b.clearAllHighlights()}function i(){d(),b.clearAllHighlights(),_.each(j,function(a){b.highlightTermMatch(a)})}var j=[];return{add:g,silentAdd:f,clear:h,reapplyHighlights:i,get:e}}]),angular.module("heinzelmannchen").directive("colorPicker",function(){return{templateUrl:"views/colorpicker.html",restrict:"E",scope:{color:"=",onColorChange:"="}}}),angular.module("heinzelmannchen").run(["$templateCache",function(a){a.put("views/colorpicker.html",'<div style="display: block; width: 24px; height: 24px; overflow: hidden"> <md-icon class="color-toggle" aria-label="color pick" md-svg-icon="images/icons/colors.svg" ng-style="{\'fill\': color}"></md-icon> <input type="color" ng-model="color" style="opacity: 0; filter:alpha(opacity: 0);  position: relative; top: -24px; left: -24px" ng-change="onColorChange()"> </div>'),a.put("views/heinz.html",'<md-toolbar class="md-whiteframe-3dp" id="tool-bar"> <div class="md-toolbar-tools"> <h2> <span>Project Heinzelmannchen</span> </h2> <span flex></span> <md-button class="md-icon-button" aria-label="Settings" hide-gt-md ng-click="toggleSideNav()"> <md-icon md-svg-icon="images/icons/settings.svg"></md-icon> </md-button> </div> </md-toolbar> <section id="issue-visualization" layout="row" flex resize-watcher> <md-content flex> <div id="dependency-graph" dependency-graph></div> </md-content> <md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="right" md-is-locked-open="$mdMedia(\'gt-md\')" layout="column"> <md-content flex layout="column"> <div class="side-nav-container" flex> <repo-list></repo-list> <issue-highlight></issue-highlight> <!-- <div>\n          <h3>Filter</h3>\n          <p>coming soon..</p>\n        </div> --> </div> <userinfo></userinfo> </md-content> </md-sidenav> </section>'),a.put("views/issuehighlight.html",'<div> <h3>Highlight</h3> <input ng-model="highlightModel.search" placeholder="e.g. Issue Number" on-enter="searchByTerm()"> <md-list ng-if="highlightModel.terms.length > 0"> <md-list-item ng-repeat="term in highlightModel.terms" layout="row"> <p flex>{{term.searchKey}}</p> <color-picker color="term.color" on-color-change="updateHighlight($index)"></color-picker> <md-icon class="remove-repo" ng-click="toggleShape($index)" aria-label="shape change" md-svg-icon="{{\'images/icons/\' + shapeIcon(term.shape) + \'.svg\'}}" style="color: black"></md-icon> <md-icon class="remove-repo" ng-click="removeTermAtIndex($index)" aria-label="remove highlight" md-svg-icon="images/icons/delete.svg" style="color: black"></md-icon> </md-list-item> </md-list> </div>'),a.put("views/login.html",'<div flex id="layout-wrapper" layout="column" layout-align="center center"> <md-whiteframe class="md-whiteframe-2dp" layout-padding> <md-content> <h2>Project Heinzelmannchen</h2> <p>Project Heinzelmannchen is a new approach for managing risk in complex research and development activities by displaying the individual taks and their interdependencies in graph structure.</p> <p> Login with your GitHub credentials and try it yourself. </p> <a><md-button class="md-primary md-raised" ng-click="authorize()">Authorize on GitHub</md-button></a> </md-content> </md-whiteframe> </div>'),a.put("views/repolist.html",'<div> <h3>Repos</h3> <md-content> <input ng-model="repoModel.search" placeholder="org/repo" on-enter="addRepo(repoModel.search)"> <md-list> <md-list-item ng-repeat="repo in repoModel.repos" layout="row"> <!-- <md-checkbox ng-model="message.selected"></md-checkbox> --> <p>{{repo.org}} / {{repo.name}}</p> <md-icon class="md-secondary remove-repo" ng-click="removeRepoAtIndex($index)" aria-label="remove repo" md-svg-icon="images/icons/delete.svg" style="color: black"></md-icon> </md-list-item> </md-list> </md-content> </div>')}]);