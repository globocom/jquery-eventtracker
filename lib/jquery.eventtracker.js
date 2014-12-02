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
        });
      });
    },

    getDataEvents: function(target) {
      var elementData = $(target).data();
      var events = [];

      for(key in elementData) {
        if(key.match(/trackEvent/)) {
          var event = key.split("trackEvent")[1];
          var eventInfo = event.split(/[aA]ction/);

          events.push({category: eventInfo[0], action: eventInfo[1]});
        }
      };

      return events;
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