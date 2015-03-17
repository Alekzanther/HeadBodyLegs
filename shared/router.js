Router.route('/', function () {
  this.render('canvas');
});

Router.route('/draw', function () {
  this.render('canvas');
});

Router.route('/montage', function () {
  this.render('montage');
});
