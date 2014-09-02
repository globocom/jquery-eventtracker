[![Build Status](https://travis-ci.org/globocom/jquery-eventtracker.svg)](https://travis-ci.org/globocom/jquery-eventtracker)

# jQuery Eventtracker

`jquery.eventtracker` is a jQuery plugin wrapper for Google Analytics custom event tracker

## Browser Compatibility

* IE 7+
* Firefox 3.6+
* Chrome 4+
* Safari 5+
* Opera 10.10+

## Dependencies

* [jQuery](http://jquery.com) 1.7.2
* [Underscore.js](http://underscorejs.org/) 1.4.2

## In a nutshell

This is a simple example of how to use the plugin

````javascript
$.fn.trackEvents.notifyAnalytics({
   category: "some category",
   action: "action name",
   content: "the value"
});
````

## HTML-based declarative tracking

There's an easier way to track simple kinds of events (i.e. links):

HTML:

````html
<a href="/to/url" class="tracking" data-event-category-action-click="content">Link</a>
````

Javascript:

````javascript
$(".tracking").trackEvents({
  delay: 250
});
````

Doing this, to add tracking to a new link is just a matter of adding a class `tracking` to
that link and configuring the event data by appending the attribute
`data-event-[category]-action-[action]="content"` to it.

### Plugin options

* **delay(250)**: The delay time to notify analytics
* **category**: The category of custom event
* **action**: The action of event
* **content**: The content to shown in analytics event tracker page analysis

## Authors

* [Daniel Martins](https://github.com/danielfm)
* [Túlio Ornelas](https://github.com/tulios)
* [Emerson Macedo](https://github.com/emerleite)
* [Alexandre Magno](https://github.com/alexanmtz)

## License

Copyright (c) 2012 Globo.com - Webmedia. See [COPYING](https://github.com/globocom/jquery-eventtracker/blob/master/COPYING) for more details.
