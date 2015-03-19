var drawPicture = function(elementId,pic){
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

first = true

Template.montage.events({
  "mousemove .canvas": function (event, template) {
      first = false;
      head = _.sample(Pictures.find({part: "head"}).fetch());
      body = _.sample(Pictures.find({part: "body"}).fetch());
      legs = _.sample(Pictures.find({part: "legs"}).fetch());
      drawPicture("canvas-head", head);
      drawPicture("canvas-body", body);
      drawPicture("canvas-legs", legs);
      console.log("move");
  }
});
