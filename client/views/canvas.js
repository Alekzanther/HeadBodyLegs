click = false;
lastx = -1;
lasty = -1;
lastUpdateCount = 0;
lastAddedItem = null;
selectedColor = "#F00";
currentLineThickness = 1;
currentBodyPart = "head";
currentPictureId = null;

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

var createNewPicture = function(){

  picture = Pictures.insert({
    name: Session.get("currentPictureName"),
    points: Array(),
    part: currentBodyPart,
    userId: Meteor.userId()
  });
  currentPictureId = picture;
}

var updatePicture = function(){
  return;
  Pictures.update({_id: currentPictureId},{
    name: Session.get("currentPictureName"),
    part: currentBodyPart
  });
  console.log(currentPictureId);
  console.log(Session.get("currentPictureName"));
  console.log(currentBodyPart);
}

var addPoint = function(lastAddedItem){
  if(Meteor.userId() != null){
    currentPicure = Pictures.findOne({_id: currentPictureId});
    if(currentPicure == null){
      createNewPicture();
      currentPicure = Pictures.findOne({_id: currentPictureId});
    }
    Pictures.update({_id: currentPicure._id },{$push: {points:lastAddedItem}});
  }
}

var animate = function(){
  canvas = document.getElementById("canvas-interactive");

  if (canvas != null){

    pic = Pictures.findOne({_id: currentPictureId});
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

    if(currentBodyPart == "head"){
      ctx = canvas.getContext("2d");
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FF0000";
      ctx.beginPath();

      ctx.moveTo(canvas.width / 2 - 25, canvas.height - 10);
      ctx.lineTo(canvas.width / 2 - 25, canvas.height);
      ctx.moveTo(canvas.width / 2 + 25, canvas.height - 10);
      ctx.lineTo(canvas.width / 2 + 25, canvas.height);

      ctx.stroke();
    }
    else if(currentBodyPart == "body"){
      ctx = canvas.getContext("2d");
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FF0000";
      ctx.beginPath();

      ctx.moveTo(canvas.width / 2 - 25, 0 + 10);
      ctx.lineTo(canvas.width / 2 - 25, 0);
      ctx.moveTo(canvas.width / 2 + 25, 0 + 10);
      ctx.lineTo(canvas.width / 2 + 25, 0);

      ctx.moveTo(canvas.width / 2 - 80, canvas.height - 10);
      ctx.lineTo(canvas.width / 2 - 80, canvas.height);
      ctx.moveTo(canvas.width / 2 - 10, canvas.height - 10);
      ctx.lineTo(canvas.width / 2 - 10, canvas.height);

      ctx.moveTo(canvas.width / 2 + 80, canvas.height - 10);
      ctx.lineTo(canvas.width / 2 + 80, canvas.height);
      ctx.moveTo(canvas.width / 2 + 10, canvas.height - 10);
      ctx.lineTo(canvas.width / 2 + 10, canvas.height);

      ctx.stroke();
    }
    else if(currentBodyPart == "legs"){
      ctx = canvas.getContext("2d");
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FF0000";
      ctx.beginPath();

      ctx.moveTo(canvas.width / 2 - 80, 0 + 10);
      ctx.lineTo(canvas.width / 2 - 80, 0);
      ctx.moveTo(canvas.width / 2 - 10, 0 + 10);
      ctx.lineTo(canvas.width / 2 - 10, 0);

      ctx.moveTo(canvas.width / 2 + 80, 0 + 10);
      ctx.lineTo(canvas.width / 2 + 80, 0);
      ctx.moveTo(canvas.width / 2 + 10, 0 + 10);
      ctx.lineTo(canvas.width / 2 + 10, 0);

      ctx.stroke();
    }
  }
	setTimeout(animate, 10);
}
animate();

Template.canvas.rendered = function () {
  $('select').material_select();
};

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
    if(Meteor.userId() == null){
      alert("Log in to draw");
      console.log("log in to draw");
    }
  },
  "mouseup #canvas-interactive": function (event, template) {
    click = false;
    lastAddedItem = createItem(event.offsetX,event.offsetY,true);
    addPoint(lastAddedItem);
  },
  "mouseleave #canvas-interactive": function (event, template) {
    if(click){
      click = false;
      lastAddedItem = createItem(event.offsetX,event.offsetY,true);
      addPoint(lastAddedItem);
    }
  },
  "keyup #picName": function(event,template){
    Session.set("currentPictureName", event.currentTarget.value);
    updatePicture();
  },
  "taphold #canvas-interactive": function(event, template){
    alert("woo");
  },
  "change #color": function(event,template){
    selectedColor = event.currentTarget.value;
  },
  "change #thickness": function(event,template){
    currentLineThickness = event.currentTarget.value;
  },
  "change #bodyPart": function(event,template){
    currentBodyPart = event.currentTarget.value;
    updatePicture();
  },
  "click #newPicture": function(event,template){
    createNewPicture();
  }
});

Template.canvas.helpers({
  pictures: function () {
    return Pictures.find({_id: currentPictureId});;
  },
  picture: function(){
    if(this.testPic != null && currentPictureId == null){
      console.log("setting picture");
      Session.set("currentPictureName", this.testPic.name);
      currentPictureId = this.testPic._id;
      return this.testPic;
    }
  }
});
