require(["jquery","underscorejs","d3js","app/search-widget","app/graph-config","app/github-api"],function(e,t,n,r,i,a){!function(){function t(){var e={};return location.search.substr(1).split("&").forEach(function(t){var n=t.split("=")[0],r=decodeURIComponent(t.split("=")[1]);n in e?e[n].push(r):e[n]=[r]}),e}function r(){var e=t();if("undefined"==typeof Storage)throw alert("Sorry, your broser does not support the required HTML5 features."),new Error("Unsupported broser!");if(e.access_token){var n=e.access_token[0];return p.authToken=n,localStorage.heinzAuth=n,!0}return localStorage.heinzAuth?(p.authToken=localStorage.heinzAuth,!0):!1}function s(){var e=t();e.repo?p.repos=_.map(e.repo,function(e){var t=e.split("/");return 2!==t.length&&alert("Please provide repo query parameters in the form of: ORG_NAME/REPO_NAME."),{org:t[0],name:t[1]}}):(alert("Please fill in all required parameters in the URL."),window.open("./?repo=cotiviti/heinzelmannchen&repo=cotiviti/cotiviti-parent","_self",!1))}function o(t){function r(e){return _.map(_.values(t[e]),function(t){return t.type=e,t})}function a(){var e=n.event.translate,t=n.event.scale;k.attr("transform","translate("+e+") scale("+t+")")}function s(){n.event.sourceEvent.stopPropagation()}var o=e(window).width(),u=e(window).height()-e(".nav-wrapper").height(),l=n.layout.force().charge(-300).linkDistance(80).size([o,u]),d=l.drag().origin(function(e){return e}).on("dragstart",s),p=n.select("div#dependency-graph").append("svg").attr("width",o).attr("height",u).call(i.zoom.on("zoom",a)).on("dblclick.zoom",null),f=r("users"),h=r("issues"),g=r("milestones"),m=_.union(f,h,g),v=[];_.each(t.milestoneDependencies,function(e){v.push({source:t.milestones[e.milestone],target:t.issues[e.issue]})}),_.each(t.userDependencies,function(e){v.push({source:t.issues[e.issue],target:t.users[e.user]})}),_.each(t.indicationDependencies,function(e){v.push({source:t.issues[e.source],target:t.issues[e.target]})});var y={nodes:m,links:v},w=p.append("svg:defs");w.selectAll(".avatar").data(f).enter().append("pattern").attr("id",function(e){return"avatar_"+e.id}).attr("width","20").attr("height","20").attr("x",0).attr("y",0).attr("viewbox","0 0 20 20").append("svg:image").attr("xlink:href",function(e){return e.avatar_url}).attr("width",40).attr("height",40).attr("x",0).attr("y",0).attr("class","avatar"),p.append("svg:defs").selectAll("marker").data([["endBig",45],["endDefault",28]]).enter().append("svg:marker").attr("id",function(e){return e[0]}).attr("viewBox","0 -5 10 10").attr("refX",function(e){return e[1]}).attr("refY",0).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5");var k=p.append("g").attr("id","graph-container");l.nodes(y.nodes).links(y.links).start();var b=k.selectAll(".link").data(y.links).enter().append("line").attr("class","link").attr("marker-end",function(e){return"users"===e.target.type?"url(#endBig)":"url(#endDefault)"}).style("stroke-width",function(e){return Math.sqrt(e.value)}),x=k.selectAll(".node").data(y.nodes).enter().append("circle").attr("class","node").classed("recently-modified",function(e){if(e.created_at){var t=new Date(e.updated_at);if((new Date).getTime()-t.getTime()<864e5)return!0}return!1}).attr("r",function(e){return"users"===e.type?20:10}).attr("number",function(e){return e.number}).attr("type",function(e){return e.type}).style("fill",function(e){if("users"===e.type)return"url(#avatar_"+e.id+")";if("issues"===e.type&&e.labels&&e.labels.length>0){var t=_.pluck(e.labels,"name");if(_.contains(t,"priority high"))return"#b71c1c";if(_.contains(t,"priority medium"))return"#f57c00";if(_.contains(t,"priority low"))return"#ffa726"}return i.color(e.type)}).on("click",function(e,t){!n.event.defaultPrevented&&e.html_url&&window.open(e.html_url,"_blank").focus()}).call(d);x.append("title").text(function(e){return"users"===e.type?e.login:"issues"===e.type?c(e.html_url).repo+"#"+e.number+" - "+e.title:"milestones"===e.type?"M - "+e.title:"issues"===e.type?e.title:void 0}),l.on("tick",function(){b.attr("x1",function(e){return e.source.x}).attr("y1",function(e){return e.source.y}).attr("x2",function(e){return e.target.x}).attr("y2",function(e){return e.target.y}),x.attr("cx",function(e){return e.x}).attr("cy",function(e){return e.y})})}function u(e,t,n){for(var r,i=/\* \[ \] (\#|https:\/\/github\.com\/(.*)\/(.*)\/issues\/)(\d+).*/g,a=[];r=i.exec(e);){var s=r[4],o=r[2]||t,u=r[3]||n;a.push("https://github.com/"+o+"/"+u+"/issues/"+s)}return a}function c(e){var t=/https:\/\/github\.com\/(.*)\/(.*)\/(issues|pull)\/\d+.*/g,n=t.exec(e),r="???",i="???";if(n)var r=n[1],i=n[2];return{org:r,repo:i}}function l(e){if(!e.body)return[];var t=c(e.html_url),n=t.org,r=t.repo,i=e.body.indexOf("# Dependencies");if(0>i)return[];var a=e.body.substring(i);return u(a,n,r)}function d(e){var t={},n=[],r=[],i=[],a=[];_.each(e,function(s){s.milestone&&(t[s.milestone.id]||(t[s.milestone.id]=s.milestone),r.push({milestone:s.milestone.id,issue:s.id})),s.assignee&&(n[s.assignee.id]||(n[s.assignee.id]=s.assignee),i.push({user:s.assignee.id,issue:s.id}));var o=l(s).map(function(t){return _.find(e,function(e){return e.html_url==t})||t});_.each(o,function(e){e.id?a.push({source:s.id,target:e.id}):console.warn("Referenced issue "+e+" was not found as referenced in "+s.html_url)})}),o({issues:_.indexBy(e,"id"),users:n,milestones:t,milestoneDependencies:r,userDependencies:i,indicationDependencies:a})}var p={};!function(){var e=r();s(),e?a.loadIssues(p,d):window.open("./login.html","_self",!1)}()}()});