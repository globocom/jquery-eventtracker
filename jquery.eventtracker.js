/*!
 * EventTracker - is a jQuery plugin wrapper for Google Analytics custom event tracker
 * https://github.com/globocom/jquery-eventtracker
 * version: 0.2.0
 */

(function($){

  $.fn.trackEvents = function(params) {
    var tracker = $.fn.trackEvents;

    $.fn.trackEvents.params = $.extend({
      delay: 250,
      cssClassForDefaultEvent: "defaultEnable"
    }, params);

    params = $.fn.trackEvents.params;

    if (!window._gaq) {
      $.fn.trackEvents.disabled = true;
      return;
    }

    return this.each (function() {
      var element = $(this);

      var options = tracker.popDataOptions(element);
      var events = tracker.getDataEvents(element);

      _.each(events, function(event) {
        if (element.get(0).tagName == "A") {
          element.click(tracker.link.generateStrategy(element, event, options));

        } else if (element.get(0).tagName == "FORM") {
          element.submit(tracker.form.generateStrategy(element, event, options));
        }
      });
    });
  }

  // Form Strategy

  $.fn.trackEvents.form = {};

  $.fn.trackEvents.form.generateStrategy = function(element, event, options) {
    return $.fn.trackEvents.generateStrategy({
      element: element,
      event: event,
      options: options,
      action: "submit",
      callback: function() { $.fn.trackEvents.form.callback(element); }
    });
  }

  $.fn.trackEvents.form.callback = function(element) {
    $.fn.trackEvents.callback(element, "submit", $.fn.trackEvents.form);
  }

  // Link Strategy

  $.fn.trackEvents.link = {};

  $.fn.trackEvents.link.generateStrategy = function(element, event, options) {
    return $.fn.trackEvents.generateStrategy({
      element: element,
      event: event,
      options: options,
      action: "click",
      callback: function() { $.fn.trackEvents.link.callback(element); }
    });
  }

  $.fn.trackEvents.link.callback = function(element) {
    $.fn.trackEvents.callback(element, "click", $.fn.trackEvents.link);
  }

  $.fn.trackEvents.link.defaultAction = function() {
    if ($.fn.trackEvents.hasDefaultEvent($(this))) {
      var href = $(this).attr("href");
      $.fn.trackEvents.locationHref(href);
    }
  }

  $.fn.trackEvents.link.defaultAction.action = "defaultAction";

  $.fn.trackEvents.link.hasDefaultAction = function(element) {
    return $.fn.trackEvents.hasDefaultAction(element, "click");
  }

  // Common code
  $.fn.trackEvents.generateStrategy = function(opts) {
    var tracker = $.fn.trackEvents;
    var params = tracker.params;

    var strategy = function(e) {
      var event = opts.event;

      var eventAttr = $.fn.trackEvents.keyToTagAttr(opts.event.key);
      event.content = $(this).attr(eventAttr);

      tracker.notifyAnalytics(event);

      if (!opts.options.javaScriptOnly) {
        e.preventDefault();
        e.stopImmediatePropagation();

        opts.element.addClass(params.cssClassForDefaultEvent);
        opts.element.off(opts.action, strategy);

        setTimeout(opts.callback, params.delay);
      }
    }

    return strategy;
  }

  $.fn.trackEvents.callback = function(element, action, namespace) {
    var tracker = $.fn.trackEvents;

    if (namespace.defaultAction && !namespace.hasDefaultAction(element)) {
      element[action](namespace.defaultAction);
    }

    element.trigger(action);
  }

  $.fn.trackEvents.hasDefaultAction = function(element, action) {
    var events = element.data("events");
    if (events) {
      return _.any(events[action], function(obj) {
        return obj.handler.action == "defaultAction";
      });
    }
    return false;
  }

  $.fn.trackEvents.locationHref = function(href) {
    document.location.href = href;
  }

  $.fn.trackEvents.hasDefaultEvent = function(element) {
    var params = $.fn.trackEvents.params;
    return element.hasClass(params.cssClassForDefaultEvent);
  }

  $.fn.trackEvents.notifyAnalytics = function(event) {
    var category = event.category.toString();
    var action = event.action.toString();
    var content = (event.content === undefined) ? "" : event.content.toString();

    if (window._gaq) {
      window._gaq.push(['_trackEvent', category, action, content]);
    }
  }

  $.fn.trackEvents.getDataEvents = function(element) {
    var data = element.data();
    var tracker = $.fn.trackEvents;
    var events = _.filter(_.keys(data), function(key) { return !!key.match(/^event/); });

    return _.map(events, function(eventName) {
      var elements = eventName.split(/[aA]ction/);
      var category = tracker.whitespace(elements[0].replace(/^event/, ''));
      var action = tracker.whitespace(elements[1]);
      return {
        key: eventName,
        category: category,
        action: action,
        content: data[eventName]
      };
    });
  }

  $.fn.trackEvents.popDataOptions = function(element) {
    var data = element.data();

    var tracker = $.fn.trackEvents;
    var optionNames = {javaScriptOnly: "eventJavascriptOnly"};

    return _.tap({}, function(obj) {
      _.each(_.keys(optionNames), function(optName) {
        var optAttr = optionNames[optName];
        var optValue = data[optAttr];

        obj[optName] = optValue ? optValue : null;

        element.removeData(optAttr);
      });
    });
  };

  $.fn.trackEvents.whitespace = function(string) {
    return string.replace(/([A-Z])/g, " $1").replace(/^\s+/, '').replace(/\s+$/, '');
  },

  $.fn.trackEvents.keyToTagAttr = function(string) {
    return "data-" + string.replace(/([A-Z])/g, "-$1").toLowerCase();
  }

})(jQuery);
