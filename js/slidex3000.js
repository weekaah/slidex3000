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
    // slider core elements
    this.display = document.querySelector(selector);
    this.slider;

    // slider navigation
    this.nav;
    this.back;
    this.fore;
    this.navButtons = [];

    this.initialize();
  };

  Slider.prototype = {
    initialize: function() {
      build.call(this);
      buildNav.call(this);
    }
  }

  function build() {
    // build container
    this.slider = document.createElement('div');
    this.slider.classList.add('slidex3000__container');

    // insert it before the actual carousel element
    this.display.parentNode.insertBefore(this.slider, this.display);

    // move the slider into the contaner
    this.slider.appendChild(this.display);
    this.display.classList.add('slidex3000__slider');
  }

  function buildNav() {
    // build nav container
    this.nav = document.createElement('div');
    this.nav.classList.add('slidex3000__nav');

    // build back and forward buttons
    this.back = document.createElement('button');
    this.back.classList.add('slidex3000__back');
    this.nav.appendChild(this.back);
    this.navButtons.push(this.back);

    this.fore = document.createElement('button');
    this.fore.classList.add('slidex3000__fore');
    this.nav.appendChild(this.fore);
    this.navButtons.push(this.fore);

    // insert nav into dom
    this.slider.appendChild(this.nav);
  }

  window.slidex3000 = function(selector, settings) {
    return new Slider(selector, settings);
  };

}));
