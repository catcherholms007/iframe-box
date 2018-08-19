# iframe-box
Lightbox2 for iframes

##Usage
Include the CSS at the top of your page in your ```<head>``` tag:

```<link href="path/to/framer.css" rel="stylesheet">```

Include the Javascript at the bottom of your page before the closing ```</body>``` tag:

```<script src="path/to/framer.js"></script>```

Make sure jQuery, which is required by Lightbox, is also loaded.

If you already use jQuery on your page, make sure it is loaded before framer.js. jQuery 1.7 or greater is required.

Confirm that the four iframes loaded by framer.css are in the correct location.

##Initialize with HTML
Single iframes. Add a data-framer attribute to any iframe link to enable IFrame-box. For the value of the attribute, use a unique name for each iframe. For example:

```<a href="https://www.youtube.com/embed/-qnyd7Ht9uc" data-framer="image-1" data-title="My caption">Zedd & Elley Duhé - Happy Now (Lyrics)</a>```

Optional:
- Add a data-title attribute if you want to show a caption.
- Add a data-alt attribute if you want to set the alt attribute of the linked iframe.

Iframe sets. If you have a group of related iframes that you would like to combine into a set, use the same data-framer attribute value for all of the iframes. For example:

```
<a href="https://www.youtube.com/embed/-qnyd7Ht9uc" data-framer="roadtrip">Zedd & Elley Duhé - Happy Now (Lyrics)</a>
<a href="https://www.youtube.com/embed/kiBF0KtqHLk" data-framer="roadtrip">KAZKA — ПЛАКАЛА [OFFICIAL AUDIO]</a>
```

###Options
If you want to change any of the default options, call the option method.
```
<script>
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true
    })
</script>
```

|Option|Default|Description|
|------|------|----------------|
|alwaysShowNavOnTouchDevices|false|If true, the left and right navigation arrows which appear on mouse hover when viewing iframe sets will always be visible on devices which support touch.|
|albumLabel|"Image %1 of %2"|The text displayed below the caption when viewing an iframe set. The default text shows the current iframe number and the total number of iframe in the set.|
|disableScrolling|false|If true, prevent the page from scrolling while IFrame-box is open. This works by settings overflow hidden on the body.|
|fadeDuration|600|The time it takes for the IFrame-box container and overlay to fade in and out, in milliseconds.|
|fitImagesInViewport|true|If true, resize iframes that would extend outside of the viewport so they fit neatly inside of it. This saves the user from having to scroll to see the entire iframe.|
|imageFadeDuration|600|The time it takes for the iframe to fade in once loaded, in milliseconds.|
|maxWidth| |If set, the iframe width will be limited to this number, in pixels. Aspect ratio will not be maintained.|
|maxHeight| |If set, the iframe height will be limited to this number, in pixels. Aspect ratio will not be maintained.|
|positionFromTop|50|The distance from top of viewport that the IFrame-box container will appear, in pixels.|
|resizeDuration|700|The time it takes for the IFrame-box container to animate its width and height when transition between different size iframes, in milliseconds.|
|showImageNumberLabel|true|If false, the text indicating the current iframe number and the total number of iframse in set (Ex. "iframe 2 of 4") will be hidden.|
|wrapAround|false|If true, when a user reaches the last iframe in a set, the right navigation arrow will appear and they will be to continue moving forward which will take them back to the first iframe in the set.|

##Browser support
Lightbox2 has been tested successfully in the following browsers:
- Internet Explorer. If you want to support IE 6, 7, and 8, use your own copy of jQuery v1.x with framer.js.
- Chrome
- Safari
- Firefox
- iOS Safari
- iOS Chrome
- Android Browser
- Android Chrome