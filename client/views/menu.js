Template.menu.rendered = function () {
  $('.button-collapse').sideNav({
        menuWidth: 240, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
      }
  );
};

//Template.menu.events({
//  "click": function (event, template) {
//    $(".button-collapse").sideNav("hide");
//  }
//});
