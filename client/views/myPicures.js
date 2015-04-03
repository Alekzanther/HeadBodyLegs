var drawPicture = function(elementId, pic){
  canvas = document.getElementById(elementId);
  if (canvas != null){
    if(pic != null)
    {
      var points = pic.points;
      points = _.sortBy(points, function(o) { return o.time; });

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
}

Template.myPictures.events({
  "click #generate": function (event, template) {
    pictures = Pictures.find({userId: Meteor.userId()}).fetch();
    for(a = 0; a < pictures.length; a++){
      pic = pictures[a];
      drawPicture(pic._id, pic);
    }
  },
  "click .editPicture": function(event, template){
    pic = Pictures.findOne({_id : event.currentTarget.id});
    document.location.href = "draw/" + pic._id;
  }
});


Template.myPictures.helpers({
  pictures: function () {
    return Pictures.find({userId: Meteor.userId()});
  }
});
