click = false;
lastPositionX = -1;
lastPositionY = -1;
lastUpdateCount = 0;
lastAddedItem = null;
selectedColor = "#FF0000";
var createItem = function(x,y,stop){
  item = {
      time: new Date().getTime(),
      positionX: x,
      positionY: y,
      stop: stop,
      color:selectedColor
  }

  return item;
}

var animate = function(){
  canvas = document.getElementById("canvas-interactive");
  if (canvas != null){
    var drawPointsArray = DrawPoints.find().fetch();
    drawPointsArray = _.sortBy(drawPointsArray, function(o) { return o.time; })

    //Only redraw if there is a change in items
    if (lastUpdateCount != drawPointsArray.length)
    {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 800, 800);
      ctx.fillStyle = "#FF0000"
      ctx.lineWidth = 3;
      ctx.beginPath();
      lastUpdateCount = drawPointsArray.length
      for (i = 0; i < drawPointsArray.length; i++) {
        x =  drawPointsArray[i].positionX
        y =  drawPointsArray[i].positionY

        if(lastPositionX != -1 && lastPositionY != -1){
          if(drawPointsArray[i - 1] != null && drawPointsArray[i - 1].stop){
            ctx.moveTo(x,y);
          }
          else{
            ctx.lineTo(x,y);
          }
        }

        lastPositionX = x
        lastPositionY = y
      }
      ctx.stroke();
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
      if(lastAddedItem == null || lastAddedItem.positionX - event.offsetX > distance || lastAddedItem.positionX - event.offsetX < -distance || lastAddedItem.positionY - event.offsetY > distance || lastAddedItem.positionY - event.offsetY < -distance  ){
        lastAddedItem = createItem(event.offsetX,event.offsetY,false);
        DrawPoints.insert(lastAddedItem);
      }
    }
  },
  "mousedown #canvas-interactive": function (event, template) {
    click = true;
  },
  "mouseup #canvas-interactive": function (event, template) {
    click = false;
    lastAddedItem = createItem(event.offsetX,event.offsetY,true);
    DrawPoints.insert(lastAddedItem);
  },
  "mouseleave #canvas-interactive": function (event, template) {
    click = false;
    lastAddedItem = createItem(event.offsetX,event.offsetY,true);
    DrawPoints.insert(lastAddedItem);
  }
});

Template.canvas.helpers({
  itemCount: function () {
    return DrawPoints.find().fetch().length;
  }
});
