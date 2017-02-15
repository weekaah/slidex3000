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
    this.items = [];

    // slider navigation
    this.nav;
    this.back;
    this.fore;
    this.navButtons = [];

    // slider tab navigation
    this.controls;
    this.dots = [];

    // helpers
    this.length = this.display.children.length;
    this.current = 1;
    this.isClicked;
    this.animation = '.5s 0s ease-in-out';

    // start up the slider
    this.initialize();
  };

  Slider.prototype = {
    initialize: function() {
      buildCore.call(this);
      buildNav.call(this);
      buildDots.call(this);
      cloneItems.call(this);
      buildItems.call(this);
      initialiteEvents.call(this);
    }
  }

  // dom buildout
  // ----------------------------------
  function buildCore() {
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

  function buildDots() {
    var self = this;

    this.controls = document.createElement('div');
    this.controls.classList.add('slidex3000__controls');

    for (var i = 0; i < this.length; i++) {

      var li = document.createElement('li'),
          dot = document.createElement('button');

      li.classList.add('slidex3000__control');
      dot.classList.add('slidex3000__dot');

      li.appendChild(dot);
      self.controls.appendChild(li);

      this.dots.push(dot);
    }

    // indicate active item by styling the dot
    this.dots[this.current - 1].classList.add('slidex3000__dot--active');

    this.slider.appendChild(this.controls);
  }

  function buildItems() {
    var items = this.display.querySelectorAll('li');

    for (var i = 0; i < items.length; i++) {
      this.items.push(items[i]);

      items[i].classList.add('slidex3000__item');
    }
  }

  function cloneItems() {
    var items = this.display.children;
    // clone 1st item: copy and insert it after the last item
    items[this.length - 1].insertAdjacentHTML('afterend', items[0].outerHTML);

    // clone last item: copy and insert it before the 1st item
    items[0].insertAdjacentHTML('beforebegin', items[this.length - 1].outerHTML);
  }

  // functionality
  // ----------------------------------
  function scroll(delta, walk) {
    this.current += delta;
    this.display.style.left = (-100 * this.current) + '%';
    this.display.style.transition = 'left' + this.animation;
  }

  function resetScroll(cycle) {
    if (cycle) {
      if (this.current > this.length) {
        this.display.style.left = '-100%';
        this.current = 1;
      } else if (this.current === 0) {
        this.display.style.left = (-100 * this.length) + '%';
        this.current = this.length;
      }
    }
  }

  function updateActiveDot(i) {
    this.dots.forEach(function(item, index, array){
      if (array.indexOf(item) === i) {
        item.classList.add('slidex3000__dot--active');
      } else {
        item.classList.remove('slidex3000__dot--active');
      }
    });
  }

  function jumpTo(walk) {
    console.log(walk);
    this.current = walk;
    this.display.style.left = (-100 * walk) + '%';
    this.display.style.transition = 'left ' + this.animation;
  }

  // helpers
  // ----------------------------------
  function isTouchDevice () {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) ? true : false;
  }

  function dropPixels(value) {
    var oldArr = value.split(''),
        newArr;

    oldArr.splice(-2, 2);

    newArr = oldArr.join('');

    return parseInt(newArr);
  }

  // event handling
  // ----------------------------------
  function initialiteEvents() {
    var self = this,
        isDown = false, // register when mouse is down
        startX, // get mouseX position on mouse down to start with
        scrollLeft, // get container scrollLeft on mouse down to start with
        walk,
        pointerDown = (isTouchDevice() ? 'touchstart' : 'mousedown'),
        pointerUp = (isTouchDevice() ? 'touchend' : 'mouseup'),
        pointerMove = (isTouchDevice() ? 'touchmove' : 'mousemove');

    // handle slider browsing
    this.navButtons.forEach(function(button) {
      button.addEventListener(pointerDown, function() {
        // prevent from running if previous event is not finished
        if (self.isClicked) return;

        // check what button was clicked and accordigli browse back or forward
        if (this.getAttribute('class') === 'slidex3000__back') {
          self.isClicked = true;
          scroll.call(self, -1);
        } else if (this.getAttribute('class') === 'slidex3000__fore') {
          self.isClicked = true;
          scroll.call(self, 1);
        }
      });
    });

    // slider jumping
    this.dots.forEach(function(dot, index) {
      dot.addEventListener(pointerDown, function() {
        jumpTo.call(self, (index + 1));
        updateActiveDot.call(self, index);
      });
    });

    // running afer the event is finished
    this.display.addEventListener('transitionend', function() {
      var cycle = (self.current === 0 || self.current > self.length);

      // enable looping by checking if item is last or first
      resetScroll.call(self, cycle);

      // update active item indicator
      updateActiveDot.call(self, self.current - 1);

      this.style.transition = 'none';
      self.isClicked = false;
    });

    // dragging
    // register that the pointer is down
    this.slider.addEventListener(pointerDown, function(e) {
      e.preventDefault();
      isDown = true;
      startX = (isTouchDevice() ? e.changedTouches[0].pageX : e.pageX);
      scrollLeft = dropPixels(window.getComputedStyle(self.display).left);
    });

    // register that the pointer is up from slider
    this.slider.addEventListener(pointerUp, function(e) {
      isDown = false;
    });

    // register that the pointer is up from slide
    this.items.forEach(function(item, index) {
      item.addEventListener(pointerUp, function(e) {
        // prevent from running if previous event is not finished
        if (self.isClicked) return;

        // position the slide
        self.isClicked = true;
        if (walk < 0) {
          console.log('1: ' + (index + 1));
          jumpTo.call(self, (index + 1));
        } else {
          console.log('2: ' + (index - 1));
          jumpTo.call(self, (index - 1));
        }
      });

      isDown = false;
    });

    // actual slider walking on pointer move
    this.display.addEventListener(pointerMove, function(e) {
      e.preventDefault();
      if (!isDown) return;
      walk = (isTouchDevice() ? e.changedTouches[0].pageX : e.pageX) - startX;
      self.display.style.left = scrollLeft + walk + 'px';
    });

  }

  // plugin export
  // ----------------------------------
  window.slidex3000 = function(selector, settings) {
    return new Slider(selector, settings);
  };

}));
