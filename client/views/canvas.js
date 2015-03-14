click = false;
lastPositionX = -1;
lastPositionY = -1;
lastUpdateCount = 0;
lastAddedItem = null;
selectedColor = "#FF0000";
currentPictureName = "";
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
      var PicturesArray = pic.points
      PicturesArray = _.sortBy(PicturesArray, function(o) { return o.time; })

      //Only redraw if there is a change in items
      if (lastUpdateCount != PicturesArray.length)
      {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 800, 800);
        ctx.fillStyle = "#FF0000"
        ctx.lineWidth = 3;
        ctx.beginPath();
        lastUpdateCount = PicturesArray.length
        for (i = 0; i < PicturesArray.length; i++) {
          x =  PicturesArray[i].positionX
          y =  PicturesArray[i].positionY

          if(lastPositionX != -1 && lastPositionY != -1){
            if(PicturesArray[i - 1] != null && PicturesArray[i - 1].stop){
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
    else{
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
      if(lastAddedItem == null || lastAddedItem.positionX - event.offsetX > distance || lastAddedItem.positionX - event.offsetX < -distance || lastAddedItem.positionY - event.offsetY > distance || lastAddedItem.positionY - event.offsetY < -distance  ){
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
  }
});

Template.canvas.helpers({
  pictures: function () {
    return Pictures.find({name: currentPictureName});
  }
});
