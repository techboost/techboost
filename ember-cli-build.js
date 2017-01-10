/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import("bower_components/gsap/src/uncompressed/TweenMax.js");
  app.import("bower_components/gsap/src/uncompressed/TweenLite.js");
  app.import("bower_components/gsap/src/uncompressed/TimelineMax.js");
  app.import("bower_components/gsap/src/uncompressed/TimelineLite.js");
  app.import("bower_components/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js");
  app.import("bower_components/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js");
  app.import("bower_components/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js");
  app.import("bower_components/imgLiquid/js/imgLiquid.js");
  app.import("bower_components/slick-carousel/slick/slick.min.js");

  app.import("bower_components/slick-carousel/slick/slick-theme.css");
  app.import("bower_components/slick-carousel/slick/slick.css");
  return app.toTree();
};
