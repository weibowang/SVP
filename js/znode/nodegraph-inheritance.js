function NodeGraph(){
  var win = $(window);
  var canvas = $("#canvas");
  var overlay = $("#overlay");
  var currentNode;
  var currentConnection = {};
  var connections = {};
  var connectionId = 0;
  var newNode;
  var nodes = {};
  var nodeId = 0;
  var mouseX = 0, mouseY = 0;
  var loops = [];
  var pathEnd = {};
  var zindex = 1;
  var hitConnect;
  var key = {};
  var SHIFT = 16;
  var topHeight = $("#controls").height();
 
  var paper = new Raphael("canvas", "100", "100");

  var type="inheritance";//the type of the link,by default is inheritance.
  this.changeType=function changeType(linkType){
  	type=linkType;
  	console.log("linkType passed in: "+linkType+" "+"after change,type is :"+type);
  }

  function arrowRotate(pointX, pointY, centerX,centerY,angle){
			var degree = angle*Math.PI/180;
			var newX = Math.cos(degree) * (pointX-centerX) - Math.sin(degree) * (pointY-centerY);
			var newY = Math.sin(degree) * (pointX-centerX) + Math.cos(degree) * (pointY-centerY);
			return {x:(newX+centerX),y:(newY+centerY)};	
			}

  function arrow(x1, y1, x2, y2,linkType) {
					var angle = Math.atan2(x1-x2,y2-y1);
						angle = (angle / (2 * Math.PI)) * 360;
					//	
					if(linkType=="composition"){
						//alert("calculating composition path");      console.log("type in addlink"+type);
						var points = [{x:x2-20, y:y2},{x:(x2-10),y:(y2 -7)},{x:(x2-10),y:(y2 + 7)},{x:x2 ,y:y2}];
					}
					else if(linkType=="inheritance"){
						//alert("calculating inheritance path");      console.log("type in addlink"+type);
						var points = [{x:x2-20, y:y2},{x:(x2-20),y:(y2 -8)},{x:(x2-20),y:(y2 + 8)},{x:x2 ,y:y2}];

					}
					//var points = [{x:x2-20, y:y2},{x:(x2-20),y:(y2 - 8)},{x:(x2-20),y:(y2 + 8)},{x:x2 ,y:y2}];
					var newPoints = [];
					var center = {x:x2,y:y2};
					 //console.log("points:");
					 //console.log(points);
					for(var i=0;i<points.length;i++)
					 newPoints.push(arrowRotate(points[i].x,points[i].y,center.x,center.y,90+angle));
					 //console.log("newPoints:");
					 //console.log(newPoints);
					var arrowStr="M" + x1 + " " + y1 + " L" + newPoints[0].x + " " + newPoints[0].y+ " L" + newPoints[1].x + " " + newPoints[1].y+ " M" + newPoints[0].x + " " + newPoints[0].y+ " L" + newPoints[2].x + " " + newPoints[2].y+ " M" + newPoints[3].x + " " + newPoints[3].y + " L" + newPoints[1].x + " " + newPoints[1].y + " M" + newPoints[3].x + " " + newPoints[3].y + " L" + newPoints[2].x + " " + newPoints[2].y ;
					//var arrowPath = this.path(arrowStr);
				return arrowStr;
				};
  
  
  
 // alert(canvas.position().left);
//  alert(canvas.position().top);
  function resizePaper(){
    paper.setSize(win.width(), win.height() - topHeight);
  }
  win.resize(resizePaper);
  resizePaper();
  
  
  
  canvas.append("<ul id='menu'><li>Left<\/li><li>Right<\/li><li>Top<\/li><li>Bottom<\/li><\/ul>");
  var menu = $("#menu");
  menu.css({"position" : "absolute", "left" : 100, "top" : 0, "z-index" : 5000, "border" : "1px solid gray", "padding" : 0});
  menu.hide();
  
  canvas.append("<div id='hit' />");
  hitConnect = $("#hit");
  hitConnect.css({"position" : "absolute", "left" : 100, "top" : "-1000px", "z-index" : 4000, "border" : "solid", 
                  "width" : 10, "height": 10, "cursor":"pointer", "font-size": "1px"});
                  
  $("#menu li").hover(function(){
    $(this).css("background-color", "#cccccc");
  },
  function(){
    $(this).css("background-color", "white");
  }).click(function(){
    menu.hide();
    var dir = $(this).text();
    connectNode(dir);
  });
  
  function connectNode(dir){
    var node, x, y;
    dir = dir.toLowerCase();
    
    
    
      
    if (dir == "left"){
      x = pathEnd.x + 5;
      y = pathEnd.y + topHeight - currentNode.height() / 2;
      
    }else if (dir == "right"){
      x = pathEnd.x - currentNode.width() - 5;
      y = pathEnd.y + topHeight - currentNode.height() / 2;
    }else if (dir == "top"){
      x = pathEnd.x - currentNode.width() / 2;
      y = pathEnd.y + topHeight + 5;
    }else if (dir == "bottom"){
      x = pathEnd.x - currentNode.width() / 2;
      y = pathEnd.y + topHeight - 5 - currentNode.height();
    }
    
 
    node = new Node(x, y, currentNode.width(), currentNode.height());
    saveConnection(node, dir,type);
    currentNode = node;
  }
  
  function createConnection(a, conA, b, conB,connType){
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      link.parent = a[conA];
      a.addConnection(link);
      currentConnection = link;
      currentNode = a;
      saveConnection(b, conB,connType);
  }
  
  function saveConnection(node, dir,connType){
    if (!currentConnection) return;
    if (!currentConnection.parent) return;
    
    currentConnection.startNode = currentNode;
    currentConnection.endNode = node;
    currentConnection.startConnection = currentConnection.parent;
    currentConnection.endConnection = node[dir.toLowerCase()];
    //save the type of association;
    currentConnection.connType=connType;
    
    currentConnection.id = connectionId;
    connections[connectionId] = currentConnection;
    connectionId++;
    
    currentNode.updateConnections();
    node.addConnection(currentConnection);
    
    $(currentConnection.node).mouseenter(function(){
      this.raphael.attr("stroke","#FF0000");
    }).mouseleave(function(){
      this.raphael.attr("stroke","#000000");
    }).click(function(){
      if (confirm("Are you sure you want to delete this connection?")){
        this.raphael.remove();
        delete connections[this.raphael.id];
      }
    });
  }
  
  canvas.mousedown(function(e){
    if (menu.css("display") == "block"){
      if (e.target.tagName != "LI"){
        menu.hide();
        currentConnection.remove();
      }
    }
  });
  
  $(document).keydown(function(e){
    key[e.keyCode] = true;
  }).keyup(function(e){
    key[e.keyCode] = false;
  });
  
  $(document).mousemove(function(e){
  	console.log("topHeight:"+topHeight);
  	console.log("pageX"+e.pageX);
  	console.log("pageY"+e.pageY);

    mouseX = e.pageX;
    mouseY = e.pageY - topHeight;
   // mouseY = e.pageY;   
   
  }).mouseup(function(e){
    overlay.hide();
    var creatingNewNode = newNode;
    
   
	 hitConnect.css({"left":mouseX - 5, "top":mouseY + topHeight - 5});
    for (var i in nodes){
      if (nodes[i]){
        var n = nodes[i];
        if (n != currentNode){
          var nLoc = n.content.position();
          if (hitTest(toGlobal(nLoc, n.left), hitConnect)){
            saveConnection(n, "left",type);
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.top), hitConnect)){
            saveConnection(n, "top",type);
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.right), hitConnect)){
            saveConnection(n, "right",type);
            newNode = false;
            break;
          }else if (hitTest(toGlobal(nLoc, n.bottom), hitConnect)){
            saveConnection(n, "bottom",type);
            newNode = false;
            break;
          }
        }
      }
    }
    hitConnect.css("left", "-1000px");
    
    if (newNode){
      if (key[SHIFT]){
        menu.css({"left":mouseX - 10, "top":mouseY});
        menu.show();
      }else{
        var dir;
        var currDir = currentConnection.parent.attr("class");
        if (currDir == "left"){
          dir = "right";
        }else if (currDir == "right"){
          dir = "left";
        }else if (currDir == "top"){
          dir = "bottom";
        }else if (currDir == "bottom"){
          dir = "top";
        }
        
        if (pathEnd.x == undefined || pathEnd.y == undefined){
          currentConnection.remove();
        }else{
          connectNode(dir);
        }
      }
    }
    newNode = false;
    
    for (var i in loops){
      clearInterval(loops[i]);
    }
    try{
      if (loops.length > 0) document.selection.empty();
    }catch(e){}
    loops = [];
    
    if (creatingNewNode) currentNode.txt[0].focus();
  });
  
  function toGlobal(np, c){
    var l = c.position();
    return {position : function(){ return {left: l.left + np.left, top : l.top + np.top}; },
            width : function(){ return c.width(); },
            height : function(){ return c.height(); }};
  }
  
  function showOverlay(){
    overlay.show();
    overlay.css({"width" : win.width(), "height" : win.height(),}); //, "opacity": 0.1});
  }
  
  function startDrag(element, bounds, dragCallback){
    showOverlay();
    var startX = mouseX - element.position().left;
    var startY = mouseY - element.position().top;
    if (!dragCallback) dragCallback = function(){};
      var id = setInterval(function(){
      var x = mouseX - startX;
      var y = mouseY - startY;
      if (bounds){
        if (x < bounds.left) x = bounds.left;
        if (x > bounds.right) x = bounds.right;
        if (y < bounds.top) y = bounds.top;
        if (y > bounds.bottom) y = bounds.bottom;
      }
      element.css("left", x).css("top",y);
      dragCallback();
    },topHeight);
    loops.push(id);
  }
  
  
  function Node(xp, yp, w, h, noDelete, forceId){
    
    if (forceId){
       nodeId = forceId;
    }
    this.id = nodeId;
    nodes[nodeId] = this;
    nodeId++;
    
    var curr = this;
    this.connections = {};
    var connectionIndex = 0;
    
    this.addConnection = function(c){
      curr.connections[connectionIndex++] = c;
      return c;
    }
    canvas.append("<div class='node'/>");
    var n = $(".node").last();     
	
	n.attr("id",nodeId);// bind the ID;
    
	n.css({"position" : "absolute",      
           "left" : xp, "top" : yp,
           "width" : w, "height" : h,   
           "border" : "1px solid gray",
           "background-color" : "white"});
    n.css("z-index", zindex++);
           
    this.content = n;
    
    this.width = function(){
      return n.width();
    }
    this.height = function(){
      return n.height();
    }
    this.x = function(){
      return n.position().left;
    }
    this.y = function(){
      return n.position().top;
    }
         
    var nodeWidth = n.width();
    var nodeHeight = n.height();
           
    n.append("<div class='bar'/>");
    var bar = $(".node .bar").last();
    bar.css({"height" : "10px", 
             "background-color" : "gray", 
             "padding" : "0", "margin": "0",
             "font-size" : "9px", "cursor" : "pointer"});
             
             
    if (!noDelete){
      n.append("<div class='ex'>X<\/div>");
      var ex = $(".node .ex").last();
      ex.css({"position":"absolute","padding-right" : 2, "padding-top" : 1, "padding-left" : 2,
              "color" : "white", "font-family" : "sans-serif",
              "top" : 0, "left": 0, "cursor": "pointer",
              "font-size" : "7px", "background-color" : "gray", "z-index" : 100});
      ex.hover(function(){
        ex.css("color","black");
      }, function(){
        ex.css("color","white");
      }).click(function(){
      
        if (confirm("Are you sure you want to delete this node?")){
          curr.remove();
        }
      });
    }
   
   //this is customed title textarea
	n.append("<textarea class='title' spellcheck='false' />");
    var title = $(".node .title").last();
    title.css("position","absolute");
    title.css({"width" : nodeWidth - 5,
		     "height" : 25,
             "resize" : "none", "overflow" : "hidden",
             "font-size" : "12px" , "font-family" : "sans-serif",
			 "text-align":"center","line-height":"85%",
             "border" : "none","z-index":4,});
          
    this.title = title; 
	

   
   
   
   
   
   
    n.append("<textarea class='txt' spellcheck='false' />");
    var txt = $(".node .txt").last();
    txt.css("position","absolute");
   
    txt.css({"width" : nodeWidth - 5,
             "height" : nodeHeight - bar.height() -20,
			 "left" : 0, "top" : 25,
			 "color": '#4045DB',
             "resize" : "none", "overflow" : "hidden",
             "font-size" : "12px" , "font-family" : "sans-serif",
			 "border-bottom" : "none",
			 "border-left" : "none",
			 "border-right" : "none",
             "border-top" : "1px solid gray",
			 "z-index":4});
          
    this.txt = txt;
	
	console.log("title", title.height);
	console.log("title", title);
	console.log("txt", txt);
    
	//---------------------------------------------------------------
	
    n.append("<textarea class='txt2' spellcheck='false' />");
    var txt2 = $(".node .txt2").last();
    txt2.css("position","absolute");
   
    txt2.css({"width" : nodeWidth - 5,
             "height" : nodeHeight - bar.height() - 50,
			 "left" : 0, "top" : 55,
			 
             "resize" : "none", "overflow" : "hidden",
             "font-size" : "12px" , "font-family" : "sans-serif",
			 "border-bottom" : "none",
			 "border-left" : "none",
			 "border-right" : "none",
             "border-top" : "1px solid gray",
			 "z-index":4});
          
    this.txt2 = txt2;
	
	console.log("title", title.height);
	console.log("title", title);
	console.log("txt", txt);
	//---------------------------------------------------------------
	
    n.append("<div class='resizer' />");
    var resizer = $(".node .resizer").last();
    
    resizer.css({"position" : "absolute" , "z-index" : 10,
                 "width" : "10px", "height" : "10px",
                 "left" : nodeWidth - 11, "top" : nodeHeight - 11,
                 "background-color" : "white", "font-size" : "1px",
                 "border" : "1px solid gray",
                 "cursor" : "pointer"});
    
	
    n.append("<div class='left'>");
    n.append("<div class='top'>");
    n.append("<div class='right'>");
    n.append("<div class='bottom'>");
    
    var left = $(".node .left").last();
    left.css("left","-11px");
    
    var top = $(".node .top").last();
    top.css("top","-11px");
    
    var right = $(".node .right").last();
    var bottom = $(".node .bottom").last();
    
    setupConnection(left);
    setupConnection(right);
    setupConnection(top);
    setupConnection(bottom);
    
    positionLeft();
    positionRight();
    positionTop();
    positionBottom();
    
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    
    function positionLeft(){
      left.css("top", n.height() / 2 - 5);
    }
    function positionRight(){
      right.css("left",n.width() + 1).css("top", n.height() / 2 - 5);
    }
    function positionTop(){
      top.css("left", n.width() / 2 - 5);
    }
    function positionBottom(){
      bottom.css("top",n.height() + 1).css("left", n.width() / 2 - 5);
    }
    
    function setupConnection(div){
      div.css({"position" : "absolute", "width" : "10px", "padding":0,
               "height" : "10px", "background-color" : "#aaaaaa",
               "font-size" : "1px", "cursor" : "pointer"});
    }
    
    this.connectionPos = function(conn){
      //alert("connectionPos");
      var loc = conn.position();
      var nLoc = n.position();
      var point = {};
      point.x = nLoc.left + loc.left + 5;
      //point.y = nLoc.top - topHeight + loc.top + 5;
      //point.y = nLoc.top+ loc.top + 5;
	  point.y = nLoc.top - topHeight + loc.top + 5;
      return point;
    }
    
    function updateConnections(){
       for (var i in curr.connections){
         var c = curr.connections[i];
         if (!c.removed){
           var nodeA = c.startNode.connectionPos(c.startConnection);
           var nodeB = c.endNode.connectionPos(c.endConnection);//alert("update connections");
           var updatePath=arrow(nodeA.x,nodeA.y,nodeB.x,nodeB.y,c.connType);
          	c.attr("path",updatePath);
            
         }
       }
    }
    this.updateConnections = updateConnections;
    
    
   function addLink(e){
   	  //alert("addLink");
      currentNode = curr;
      e.preventDefault();
      showOverlay();
      //alert("addlink showOverlay()");
      var link = paper.path("M 0 0 L 1 1");
      link.attr({"stroke-width":2});
      currentConnection = link;
      currentConnection.parent = $(this);
      
      curr.addConnection(link);
      var loc = $(this).position();
      var nLoc = n.position();
      var x = loc.left + nLoc.left + 5;
      //var y = loc.top + nLoc.top - topHeight + 5;
      var y = loc.top + nLoc.top - topHeight + 5;      
      newNode = true;
      console.log("type in addlink"+type);
      var id = setInterval(function(){
       //link.attr("path","M " + x + " " + y + " L " + mouseX + " " + mouseY);
        var updatePath=arrow(x,y,mouseX,mouseY,type);
        //console.log("updatePath:"+updatePath);
        link.attr("path",updatePath);
        pathEnd.x = mouseX;
        pathEnd.y = mouseY;
        //pathEnd.y = mouseY-topHeight;//set the pathEnd to the current mouse's position;
      }, 30);
      loops.push(id);
   }
   left.mousedown(addLink);
   right.mousedown(addLink);
   top.mousedown(addLink);
   bottom.mousedown(addLink);
   
   this.remove = function(){
     for (var i in curr.connections){
       var c = curr.connections[i];
       c.remove();
       delete connections[c.id];
       delete curr.connections[i];
     }
     n.remove();
     delete nodes[this.id];
   }
    
    resizer.mousedown(function(e){
      currentNode = curr;
      e.preventDefault();
      startDrag(resizer, {left : defaultWidth, top : defaultHeight, right : 500, bottom : 500},
      function(){
        var loc = resizer.position();
        var x = loc.left;
        var y = loc.top;

        n.css({"width" : x + resizer.width() + 1,
               "height" : y + resizer.height() + 1});
        
	    title.css({"width" : n.width() - 5, "height" : 60});//this title custom resizer function	
        txt.css({"width" : n.width() - 5, 
		"height" : n.height() - bar.height() - n.height()/2});//this line needs to be changed
       // sticker.css({'position':'relative', 'left':n.width()-10,});
	    txt2.css({"top": n.height()/2, "width" : n.width() - 5, 
		"height" : n.height() - bar.height() - n.height()/2});
        positionLeft();
        positionRight();
        positionTop();
        positionBottom();
        updateConnections();
      });
    });
	
	
	//----------------------------------------------------

	//----------------------------------------------------
    bar.mousedown(function(e){
      currentNode = curr;
      n.css("z-index", zindex++);
      e.preventDefault();
      startDrag(n, {left : 10, top: 40, right : win.width() - n.width() - 10, bottom : win.height() - n.height() - 10},
      updateConnections);
    });
    
    n.mouseenter(function(){
      n.css("z-index", zindex++);
    });
    
  }
  
  function hitTest(a, b){
  //	alert("hitTest");
    var aPos = a.position();
    var bPos = b.position();
    
    var aLeft = aPos.left;
    var aRight = aPos.left + a.width();
    var aTop = aPos.top;
    var aBottom = aPos.top + a.height();
    
    var bLeft = bPos.left;
    var bRight = bPos.left + b.width();
    var bTop = bPos.top;
    var bBottom = bPos.top + b.height();
    
    // http://tekpool.wordpress.com/2006/10/11/rectangle-intersection-determine-if-two-given-rectangles-intersect-each-other-or-not/
    return !( bLeft > aRight
      || bRight < aLeft
      || bTop > aBottom
      || bBottom < aTop
      );
  }
  
  
 function clear(){
    nodeId = 0;
    connectionsId = 0;
    for (var i in nodes){
      nodes[i].remove();
    }
  }
  
  this.clearAll = function(){
    clear();
    defaultNode();
    currentConnection = null;
    currenNode = null;
  }
  
  this.addNode = function(x, y, w, h, noDelete){
    return new Node(x, y, w, h, noDelete);
  }
  
  var defaultWidth = 107; //107 and 55 should be the better option compare to 100 and 50
  var defaultHeight = 100;
  
  this.addNodeAtMouse = function(){
  	//alert("addNodeAtMouse");
    //alert("Zevan");
    var w =  defaultWidth || currentNode.width();
    var h =  defaultHeight || currentNode.height () ;
    console.log("mouseX is "+mouseX+"  mouseY is "+mouseY+"  in addNodeAtMouse");
    var temp = new Node(mouseX, mouseY , w, h);
    currentNode = temp;
    currentConnection = null;
  }
  
  function defaultNode(){
    //alert("start drawing default node");
    var temp = new Node(win.width() / 2 - defaultWidth / 2, 
                        win.height() / 2 - defaultHeight / 2,
                        defaultWidth, defaultHeight, true);
    temp.title[0].focus();
    currentNode = temp;
  }
  defaultNode();

  this.fromJSON = function(data){
    clear();
    for (var i in data.nodes){
      var n = data.nodes[i];
      var ex = (i == "0") ? true : false;
      var temp = new Node(n.x, n.y, n.width, n.height, ex, n.id);
	  
	  var addreturn = n.title.replace(/\\n/g,'\n'); //customized to read title from JSON
      temp.title.val(addreturn);//customized to read title from JSON
	  
      var addreturns = n.txt.replace(/\\n/g,'\n');
      temp.txt.val(addreturns);
	  
	 var addreturns2 = n.txt2.replace(/\\n/g,'\n');
      temp.txt2.val(addreturns2);
    }
    for (i in data.connections){
      var c = data.connections[i];
      createConnection(nodes[c.nodeA], c.conA, nodes[c.nodeB], c.conB,c.connType);
    }
  }
  
  this.toJSON = function(){
    var json = '{"nodes" : [';
    for (var i in nodes){
      var n = nodes[i];
      json += '{"id" : ' + n.id + ', ';
      json += '"x" : ' + n.x() + ', ';
      json += '"y" : ' + n.y() + ', ';
      json += '"width" : ' + n.width() + ', ';
      json += '"height" : ' + n.height() + ', ';
	  json += '"title" : "' + n.title.val() + '", ';
	  json += '"txt2" : "' + addSlashes(n.txt2.val()) + '", ';
      json += '"txt" : "' + addSlashes(n.txt.val()) + '"},';
    }
    json = json.substr(0, json.length - 1);
    json += '], "connections" : [';
    
    var hasConnections = false;
    for (i in connections){
      var c = connections[i];
      if (!c.removed){
      json += '{"nodeA" : ' + c.startNode.id + ', ';
      json += '"nodeB" : ' + c.endNode.id + ', ';
      json += '"conA" : "' + c.startConnection.attr("class") + '", ';
      json += '"conB" : "' + c.endConnection.attr("class") + '",';
      json += '"connType" : "' + c.connType  + '"},';
      ;
      hasConnections = true;
      }
    }
    if (hasConnections){
      json = json.substr(0, json.length - 1);
    }
    json += ']}';
    return json;
  }
  
  function addSlashes(str) {
    str = str.replace(/\\/g,'\\\\');
    str = str.replace(/\'/g,'\\\'');
    str = str.replace(/\"/g,'\\"');
    str = str.replace(/\0/g,'\\0');
    str = str.replace(/\n/g,'\\\\n');
    return str;
  }
}