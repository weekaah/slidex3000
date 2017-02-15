(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Slider = factory();
  }
}(this, function() {

  var Slider = function(selector, settings) {
    this.display = document.querySelector(selector);
    this.slider;

    this.initialize();
  };

  Slider.prototype = {
    initialize: function() {
      build.call(this);
    }
  }

  function build() {

    // build container
    this.slider = document.createElement('div');
    this.slider.classList.add('slidex3000-container');

    // insert it before the actual carousel element
    this.display.parentNode.insertBefore(this.slider, this.display);

    // move the slider into the contaner
    this.slider.appendChild(this.display);
    this.display.classList.add('slidex3000-slider');

  }

  window.slidex3000 = function(selector, settings) {
    return new Slider(selector, settings);
  };

}));
