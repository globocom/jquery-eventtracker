;(function($, window, document, undefined) {

  var pluginName = 'eventTracker';

  function Plugin(element, params) {
    this.element = element;
  }

  $.fn[pluginName] = function(params) {
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Plugin(this, params));
      }
    });
  }
})(jQuery, window, document);