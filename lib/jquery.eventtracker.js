;(function($, window, document, undefined) {

  var pluginName = 'eventTracker';

  function Plugin(element, params) {
    this.element = $(element);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var self = this;

      localforage.removeItem(pluginName);

      this.element.click(function() {
        localforage.setItem(pluginName, self.getDataEvents(this), function(err, value) {
          console.log(value);
        });
      });
    },

    getDataEvents: function(element) {
      var data = $(element).data();
      var keys = Object.keys(data);

      var events = keys.filter(function(key) {
        return !!key.match(/^trackEvent/);
      });

      return events.map(function(event) {
        var elements = event.split(/[aA]ction/);
        var eventCategory = elements[0];
        var eventAction = elements[1];

        return {
          category: eventCategory.replace(/^trackEvent/, ''),
          action: eventAction
        }
      });
    }
  }

  $.fn[pluginName] = function(params) {
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Plugin(this, params));
      }
    });
  }
})(jQuery, window, document);