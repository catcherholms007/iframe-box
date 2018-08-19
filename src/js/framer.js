/**
 * IFrame-box - Lightbox2 for iframes
 */

(function() {
  // Use local alias
  var $ = jQuery;

  var FramerOptions = (function() {
    function FramerOptions() {
      this.fadeDuration                = 500;
      this.fitImagesInViewport         = true;
      this.resizeDuration              = 700;
      this.positionFromTop             = 50;
      this.showImageNumberLabel        = true;
      this.alwaysShowNavOnTouchDevices = false;
      this.wrapAround                  = false;
    }
    
    // Change to localize to non-english language
    FramerOptions.prototype.afrumLabel = function(curImageNum, afrumSize) {
      return "Image " + curImageNum + " of " + afrumSize;
    };

    return FramerOptions;
  })();


  var Framer = (function() {
    function Framer(options) {
      this.options           = options;
      this.afrum             = [];
      this.currentImageIndex = void 0;
      this.init();
    }

    Framer.prototype.init = function() {
      this.enable();
      this.build();
    };

    // Loop through anchors and areamaps looking for either data-framer attributes or rel attributes
    // that contain 'framer'. When these are clicked, start framer.
    Framer.prototype.enable = function() {
      var self = this;
      $('body').on('click', 'a[rel^=framer], area[rel^=framer], a[data-framer], area[data-framer]', function(event) {
        self.start($(event.currentTarget));
        return false;
      });
    };

    // Build html for the framer and the overlay.
    // Attach event handlers to the new DOM elements. click click click
    Framer.prototype.build = function() {
      var self = this;
      $("<div id='framerOverlay' class='framerOverlay'></div><div id='framer' class='framer'><div class='fr-outerContainer'><div class='fr-container'><iframe class='fr-image' src='' ></iframe><div class='fr-loader'><a class='fr-cancel'></a></div></div><a class='fr-prev' href='' ></a><a class='fr-next' href='' ></a></div><div class='fr-dataContainer'><div class='fr-data'><div class='fr-details'><span class='fr-caption'></span><span class='fr-number'></span></div><div class='fr-closeContainer'><a class='fr-close'></a></div></div></div></div>").appendTo($('body'));
      
      // Cache jQuery objects
      this.$framer       = $('#framer');
      this.$overlay        = $('#framerOverlay');
      this.$outerContainer = this.$framer.find('.fr-outerContainer');
      this.$container      = this.$framer.find('.fr-container');

      // Store css values for future lookup
      this.containerTopPadding = parseInt(this.$container.css('padding-top'), 10);
      this.containerRightPadding = parseInt(this.$container.css('padding-right'), 10);
      this.containerBottomPadding = parseInt(this.$container.css('padding-bottom'), 10);
      this.containerLeftPadding = parseInt(this.$container.css('padding-left'), 10);
      
      // Attach event handlers to the newly minted DOM elements
      this.$overlay.hide().on('click', function() {
        self.end();
        return false;
      });

      this.$framer.hide().on('click', function(event) {
        if ($(event.target).attr('id') === 'framer') {
          self.end();
        }
        return false;
      });

      this.$outerContainer.on('click', function(event) {
        if ($(event.target).attr('id') === 'framer') {
          self.end();
        }
        return false;
      });

      this.$framer.find('.fr-prev').on('click', function() {
        if (self.currentImageIndex === 0) {
          self.changeImage(self.afrum.length - 1);
        } else {
          self.changeImage(self.currentImageIndex - 1);
        }
        return false;
      });

      this.$framer.find('.fr-next').on('click', function() {
        if (self.currentImageIndex === self.afrum.length - 1) {
          self.changeImage(0);
        } else {
          self.changeImage(self.currentImageIndex + 1);
        }
        return false;
      });

      this.$framer.find('.fr-loader, .fr-close').on('click', function() {
        self.end();
        return false;
      });
    };

    // Show overlay and framer. If the image is part of a set, add siblings to afrum array.
    Framer.prototype.start = function($link) {
      var self    = this;
      var $window = $(window);

      $window.on('resize', $.proxy(this.sizeOverlay, this));

      $('select, object, embed').css({
        visibility: "hidden"
      });

      this.sizeOverlay();

      this.afrum = [];
      var imageNumber = 0;

      function addToAfrum($link) {
        self.afrum.push({
          link: $link.attr('href'),
          title: $link.attr('data-title') || $link.attr('title')
        });
      }

      // Support both data-framer attribute and rel attribute implementations
      var dataFramerValue = $link.attr('data-framer');
      var $links;

      if (dataFramerValue) {
        $links = $($link.prop("tagName") + '[data-framer="' + dataFramerValue + '"]');
        for (var i = 0; i < $links.length; i = ++i) {
          addToAfrum($($links[i]));
          if ($links[i] === $link[0]) {
            imageNumber = i;
          }
        }
      } else {
        if ($link.attr('rel') === 'framer') {
          // If image is not part of a set
          addToAfrum($link);
        } else {
          // If image is part of a set
          $links = $($link.prop("tagName") + '[rel="' + $link.attr('rel') + '"]');
          for (var j = 0; j < $links.length; j = ++j) {
            addToAfrum($($links[j]));
            if ($links[j] === $link[0]) {
              imageNumber = j;
            }
          }
        }
      }
      
      // Position Framer
      var top  = $window.scrollTop() + this.options.positionFromTop;
      var left = $window.scrollLeft();
      this.$framer.css({
        top: top + 'px',
        left: left + 'px'
      }).fadeIn(this.options.fadeDuration);

      this.changeImage(imageNumber);
    };

    // Hide most UI elements in preparation for the animated resizing of the framer.
    Framer.prototype.changeImage = function(imageNumber) {
      var self = this;

      this.disableKeyboardNav();
      var $image = this.$framer.find('.fr-image');

      this.$overlay.fadeIn(this.options.fadeDuration);

      $('.fr-loader').fadeIn('slow');
      this.$framer.find('.fr-image, .fr-prev, .fr-next, .fr-dataContainer, .fr-numbers, .fr-caption').hide();
      this.$outerContainer.addClass('animating');
	  $image.css({
		width: $(window).width()*0.7-self.containerRightPadding*2,
		height:$(window).height()*0.7-self.containerBottomPadding*2,
	  });
	  $image.attr('width',$(window).width()*0.7);
      $image.attr('height',$(window).height()*0.7);
      $image.attr('src',this.afrum[imageNumber].link);
	  this.$container.attr('height',$(window).height()*0.7);
	  this.$container.attr('width',$(window).width()*0.7);
	  self.sizeContainer($image.attr('width'), $image.attr('height'));
	  this.$container.attr('height',$(window).height());
      // When image to show is preloaded, we send the width and height to sizeContainer()
      /*var preloader = new Image();
      preloader.onload = function() {
        var $preloader, imageHeight, imageWidth, maxImageHeight, maxImageWidth, windowHeight, windowWidth;
        //$image.attr('src', self.afrum[imageNumber].link);

        $preloader = $(preloader);
		maxImageWidth  = windowWidth - self.containerLeftPadding - self.containerRightPadding - 20;
        maxImageHeight = windowHeight - self.containerTopPadding - self.containerBottomPadding - 120;
        $image.attr('width',maxImageWidth);
        $image.attr('height',maxImageHeight);
        
        if (self.options.fitImagesInViewport) {
          // Fit image inside the viewport.
          // Take into account the border around the image and an additional 10px gutter on each side.

          windowWidth    = $(window).width();
          windowHeight   = $(window).height();
          maxImageWidth  = windowWidth - self.containerLeftPadding - self.containerRightPadding - 20;
          maxImageHeight = windowHeight - self.containerTopPadding - self.containerBottomPadding - 120;

          // Is there a fitting issue?
          if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
            if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
              imageWidth  = maxImageWidth;
              imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
              $image.attr('width',imageWidth);
              $image.attr('height',imageHeight);
            } else {
              imageHeight = maxImageHeight;
              imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
              $image.attr('width',imageWidth);
              $image.attr('height',imageHeight);
            }
          }
        }
        //self.sizeContainer($image.attr('width'), $image.attr('height'));
      };*/

      //preloader.src          = this.afrum[imageNumber].link;
      this.currentImageIndex = imageNumber;
    };

    // Stretch overlay to fit the viewport
    Framer.prototype.sizeOverlay = function() {
      this.$overlay
        .width($(window).width())
        .height($(document).height());
    };

    // Animate the size of the framer to fit the image we are showing
    Framer.prototype.sizeContainer = function(imageWidth, imageHeight) {
      var self = this;
      
      var oldWidth  = this.$outerContainer.outerWidth();
      var oldHeight = this.$outerContainer.outerHeight();
      var newWidth  = imageWidth + this.containerLeftPadding + this.containerRightPadding;
      var newHeight = imageHeight + this.containerTopPadding + this.containerBottomPadding;
      
      function postResize() {
        self.$framer.find('.fr-dataContainer').width(newWidth);
        self.$framer.find('.fr-prevLink').height(newHeight);
        self.$framer.find('.fr-nextLink').height(newHeight);
        self.showImage();
      }

      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        this.$outerContainer.animate({
          width: newWidth,
          height: newHeight
        }, this.options.resizeDuration, 'swing', function() {
          postResize();
        });
      } else {
        postResize();
      }
    };

    // Display the image and it's details and begin preload neighboring images.
    Framer.prototype.showImage = function() {
      this.$framer.find('.fr-loader').hide();
      this.$framer.find('.fr-image').fadeIn('slow');
    
      this.updateNav();
      this.updateDetails();
      this.preloadNeighboringImages();
      this.enableKeyboardNav();
    };

    // Display previous and next navigation if appropriate.
    Framer.prototype.updateNav = function() {
      // Check to see if the browser supports touch events. If so, we take the conservative approach
      // and assume that mouse hover events are not supported and always show prev/next navigation
      // arrows in image sets.
      var alwaysShowNav = false;
      try {
        document.createEvent("TouchEvent");
        alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices)? true: false;
      } catch (e) {}

      //this.$framer.find('.fr-nav').show();

      if (this.afrum.length > 1) {
        if (this.options.wrapAround) {
          if (alwaysShowNav) {
            this.$framer.find('.fr-prev, .fr-next').css('opacity', '1');
          }
          this.$framer.find('.fr-prev, .fr-next').show();
        } else {
          if (this.currentImageIndex > 0) {
            this.$framer.find('.fr-prev').show();
            if (alwaysShowNav) {
              this.$framer.find('.fr-prev').css('opacity', '1');
            }
          }
          if (this.currentImageIndex < this.afrum.length - 1) {
            this.$framer.find('.fr-next').show();
            if (alwaysShowNav) {
              this.$framer.find('.fr-next').css('opacity', '1');
            }
          }
        }
      }
    };

    // Display caption, image number, and closing button.
    Framer.prototype.updateDetails = function() {
      var self = this;

      // Enable anchor clicks in the injected caption html.
      // Thanks Nate Wright for the fix. @https://github.com/NateWr
      if (typeof this.afrum[this.currentImageIndex].title !== 'undefined' && this.afrum[this.currentImageIndex].title !== "") {
        this.$framer.find('.fr-caption')
          .html(this.afrum[this.currentImageIndex].title)
          .fadeIn('fast')
          .find('a').on('click', function(event){
            location.href = $(this).attr('href');
          });
      }
    
      if (this.afrum.length > 1 && this.options.showImageNumberLabel) {
        this.$framer.find('.fr-number').text(this.options.afrumLabel(this.currentImageIndex + 1, this.afrum.length)).fadeIn('fast');
      } else {
        this.$framer.find('.fr-number').hide();
      }
    
      this.$outerContainer.removeClass('animating');
    
      this.$framer.find('.fr-dataContainer').fadeIn(this.options.resizeDuration, function() {
        return self.sizeOverlay();
      });
    };

    // Preload previous and next images in set.
    Framer.prototype.preloadNeighboringImages = function() {
      if (this.afrum.length > this.currentImageIndex + 1) {
        var preloadNext = new Image();
        preloadNext.src = this.afrum[this.currentImageIndex + 1].link;
      }
      if (this.currentImageIndex > 0) {
        var preloadPrev = new Image();
        preloadPrev.src = this.afrum[this.currentImageIndex - 1].link;
      }
    };

    Framer.prototype.enableKeyboardNav = function() {
      $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
    };

    Framer.prototype.disableKeyboardNav = function() {
      $(document).off('.keyboard');
    };

    Framer.prototype.keyboardAction = function(event) {
      var KEYCODE_ESC        = 27;
      var KEYCODE_LEFTARROW  = 37;
      var KEYCODE_RIGHTARROW = 39;

      var keycode = event.keyCode;
      var key     = String.fromCharCode(keycode).toLowerCase();
      if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
        this.end();
      } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
        if (this.currentImageIndex !== 0) {
          this.changeImage(this.currentImageIndex - 1);
        } else if (this.options.wrapAround && this.afrum.length > 1) {
          this.changeImage(this.afrum.length - 1);
        }
      } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
        if (this.currentImageIndex !== this.afrum.length - 1) {
          this.changeImage(this.currentImageIndex + 1);
        } else if (this.options.wrapAround && this.afrum.length > 1) {
          this.changeImage(0);
        }
      }
    };

    // Closing time. :-(
    Framer.prototype.end = function() {
      this.disableKeyboardNav();
      $(window).off("resize", this.sizeOverlay);
      this.$framer.fadeOut(this.options.fadeDuration);
      this.$overlay.fadeOut(this.options.fadeDuration);
      $('select, object, embed').css({
        visibility: "visible"
      });
    };

    return Framer;

  })();

  $(function() {
    var options  = new FramerOptions();
    var framer = new Framer(options);
  });

}).call(this);
