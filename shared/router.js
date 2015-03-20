Router.route('/', function () {
  this.render('canvas');
});

Router.route('/draw', function () {
  this.render('canvas');
});

Router.route('/draw/:_id', function () {
  var item = Pictures.findOne({_id: this.params._id});
  this.render('canvas', {data: {testPic : item}});
});

Router.route('/montage', function () {
  this.render('montage');
});

Router.route('/mypictures', function () {
  this.render('myPictures');
});
