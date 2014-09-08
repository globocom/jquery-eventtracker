;(function($, window, document, undefined) {

  var pluginName = 'eventTracker',
  defaultSettings = {};

  function Plugin(element, params) {
    this.element = element;

    this.options = $.extend({}, defaultSettings, params);
  }

  $.fn[pluginName] = function(params) {
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Plugin(this, params));
      }
    });
  }
})(jQuery, window, document);