$(function(){
  
  var graph = new NodeGraph();
  
  // consider moving to NodeGraph
  $("#canvas").mouseup(function(e){
     if (openWin.css("display") == "none"){
       var children = $(e.target).children();
       if (children.length > 0){
         var type = children[0].tagName;
         if (type == "desc" || type == "SPAN"){
           graph.addNodeAtMouse();
         }
       }
     }
  });
  
  // ui code
  var openWin = $("#openWin");
  openWin.hide();
  
  var openWin2 = $("#openWin2");
  openWin2.hide();
  
  var openWin3 = $("#openWin3");
  openWin3.hide();
 
  $(".btn").mouseenter(function(){
    $(this).animate({"backgroundColor" : "white"}, 200);
  }).mouseleave(function(){
    $(this).animate({"backgroundColor" : "#efefef"});
  });
  
    $("#inheritance").click(function(){
  	//graph.type="inheritance";
  	graph.changeType("inheritance");
  	//alert("changed to:"+graph.type);
  });
  $("#composition").click(function(){
  	//graph.type="composition";
  	graph.changeType("composition");
  	//alert("changed to:"+graph.type);
  });
  
  
  $("#clear").click(function(){
    graph.clearAll();
  });
  $("#help").click(function(){
    window.open("http://www.zreference.com/znode", "_blank");
  });
  
  $("#save").click(saveFile);
  
  function saveFile(){
    var name = filename.val();
    if (name == "" || name == nameMessage){
      alert("Please Name Your File");
      filename[0].focus();
      return;
    }
    $.post("json/save.php", {data:graph.toJSON(), name:name}, function(data){
      alert("Your file was saved.");
    });
  }
  
  
  
  $("#canvas").mousedown(function(){
    openWin.fadeOut();
	openWin2.fadeOut();
	openWin3.fadeOut();
  });
  
  $("#open").click(function(){
    var fileList =  $("#files");
    fileList.html("<div>loading...<\/div>");
    openWin.show('drop');
    fileList.load("json/files.php?"+Math.random()*1000000);
  });
  
  var nameMessage = "Enter your file name";
  var filename = $("#filename").val(nameMessage);

  filename.focus(function(){
    if ($(this).val() == nameMessage){
      $(this).val("");
    }
  }).blur(function(){
    if ($(this).val() == ""){
      $(this).val(nameMessage);
    }
  });
  
  $("#nameForm").submit(function(e){
    e.preventDefault();
    saveFile();
  });
   var nameTwo;
  function openWindow2(nameTwo){
    var fileList =  $("#files2");
    fileList.html("<div>loading...<\/div>");
	openWin2.show('drop');
    //fileList.load("json/files.php?"+Math.random()*1000000);
	fileList.load("json/files2.php?dir="+nameTwo);
  }

  function openWindow3(name, nameTwo){
    var fileList =  $("#files3");
    fileList.html("<div>loading...<\/div>");
	openWin3.show('drop');
    //fileList.load("json/files.php?"+Math.random()*1000000);
	fileList.load("json/files3.php?dir="+nameTwo + "/" + name);
  }
   
  $(".file").live('click', function() {
	nameTwo = $(this).text();
	openWindow2(nameTwo);
    $.getJSON("files/" + nameTwo + ".json", {n:Math.random()}, function(data){
	   graph.fromJSON(data);
       filename.val(nameTwo);
    });
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  $(".file2").live('click', function() {
    var name = $(this).text();
	openWindow3(name,nameTwo);
    $.getJSON("files/" + name + ".json", {n:Math.random()}, function(data){
	   graph.fromJSON(data);
       filename.val(name);
    });
  }).live('mouseover', function(){
    $(this).css({"background-color": "#ededed"});
  }).live("mouseout", function(){
    $(this).css({"background-color": "white"});
  });
  
  
});