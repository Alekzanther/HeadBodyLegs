click = false;
lastx = -1;
lasty = -1;
lastUpdateCount = 0;
lastAddedItem = null;
selectedColor = "#0000FF";
currentPictureName = "";
currentLineThickness = 3;
var createItem = function(x,y,stop){
  item = {
      time: new Date().getTime(),
      x: x,
      y: y,
      stop: stop,
      color:selectedColor,
      thickness:currentLineThickness
  }

  return item;
}

var addPoint = function(lastAddedItem){
  currentPicure = Pictures.findOne({name: currentPictureName});
  if(currentPicure == null){
    console.log("new picure");
    Pictures.insert({name: currentPictureName, points: Array(), part: "head"})
    currentPicure = Pictures.findOne({name: currentPictureName});
  }
  Pictures.update({_id: currentPicure._id },{$push: {points:lastAddedItem}});
}

var animate = function(){
  canvas = document.getElementById("canvas-interactive");

  if (canvas != null){

    pic = Pictures.findOne({name: currentPictureName});
    if(pic != null)
    {
      var points = pic.points;
      points = _.sortBy(points, function(o) { return o.time; });

      //Only redraw if there is a change in items
      if (lastUpdateCount != points.length)
      {
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 800, 800);
        ctx.lineWidth = 3;
        ctx.beginPath();
        lastColor = ""
        lastThickness = "3"
        lastUpdateCount = points.length
        for (i = 0; i < points.length; i++) {
          point = points[i];
          x =  point.x;
          y =  point.y;
          color = point.color;
          thickness = point.thickness;
          if(lastColor != color || lastThickness != thickness){
            ctx.stroke();
            ctx.lineWidth = thickness;
            console.log("change color or thickness");
            ctx.strokeStyle = color;
            ctx.beginPath();
            lastColor = color;
            lastThickness = thickness;
          }
          lastPoint = points[i - 1];
          if(lastx != -1 && lasty != -1){
            if(lastPoint != null && lastPoint.stop){
              ctx.moveTo(x,y);
            }
            else{
              ctx.lineTo(x,y);
            }
          }

          lastx = x;
          lasty = y;
        }
        ctx.stroke();
      }
    }
    else{
      //Don't do this every time
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 800, 800);
    }
  }
	setTimeout(animate, 10);
}
animate();

Template.canvas.events({
  "mousemove #canvas-interactive": function (event, template) {
    if(click)
    {
      distance = 5;
      if(lastAddedItem == null || lastAddedItem.x - event.offsetX > distance || lastAddedItem.x - event.offsetX < -distance || lastAddedItem.y - event.offsetY > distance || lastAddedItem.y - event.offsetY < -distance  ){
        lastAddedItem = createItem(event.offsetX,event.offsetY,false);
        addPoint(lastAddedItem);
      }
    }
  },
  "mousedown #canvas-interactive": function (event, template) {
    click = true;
  },
  "mouseup #canvas-interactive": function (event, template) {
    click = false;
    lastAddedItem = createItem(event.offsetX,event.offsetY,true);
    addPoint(lastAddedItem);
  },
  "mouseleave #canvas-interactive": function (event, template) {
    click = false;
    lastAddedItem = createItem(event.offsetX,event.offsetY,true);
    addPoint(lastAddedItem);
  },
  "keyup #picName": function(event,template){
    currentPictureName = event.currentTarget.value;
  },
  "keyup #color": function(event,template){
    selectedColor = event.currentTarget.value;
  },
  "keyup #thickness": function(event,template){
    currentLineThickness = event.currentTarget.value;
  }
});

Template.canvas.helpers({
  pictures: function () {
    //fix subscription to change when currentPicureName changes
    return Pictures.find({name: currentPictureName});;
  }
});
