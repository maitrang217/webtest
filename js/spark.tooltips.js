
// Spark Tooltips (jQuery Plugin)
// Release: 1 (Feb. 2013)

(function($){

	var methods = {
		init: function(user_options) {
		
			var options = $.extend({
				'position' : 'top'
			}, user_options);

			return this.each(function() {

				// Get the tooltip text (from either "data-tooltip" or "title" attr)
				if ($(this).data('tooltip')) {
					var text = $(this).data('tooltip');
				} else if ($(this).attr('title')) {
					var text = $(this).attr('title');
					$(this).removeAttr('title'); // Remove title attribute to avoid browser's tooltip
				}

				var tooltipClass = (options.position == 'bottom') ? 'position-bottom' : 'position-top';
				var tooltip = $('<div class="spark-tooltip-box '+tooltipClass+'">'+text+'</div>');
				$(this).before(tooltip); // The reason why append() isn't used instead is because it's not possible to append to <img> :(
				
			}).on({
				mouseenter: function() {

					var tooltip = $(this).prev('.spark-tooltip-box');
					
					// Perfect positioning logic
					tooltip.stop().css({'display':'block', 'opacity':0}); // This is to let the browser determine the tooltip's dimension first.
					var position = $(this).position();
					var positionTop = (options.position == 'top') ? position.top - tooltip.outerHeight() : position.top + $(this).outerHeight(); // Place the tooltip above the parent
					var positionLeft = position.left + ($(this).outerWidth() - tooltip.outerWidth())/2; // Center the tooltip horizontaly
					var marginTop = (options.position == 'top') ? '-10px' : '10px';
					
					tooltip.stop().css({'left':positionLeft, 'top':positionTop}).animate({
						opacity: 1,
						'margin-top': marginTop
						}, { duration: 200, easing: "linear" });
				},
				mouseleave: function(event) {
					// Fix for IE and Opera because they don't support the great CSS "pointer-events" property!
					if(!$(event.relatedTarget).hasClass('spark-tooltip-box') || $(event.relatedTarget).parents('.spark-tooltip-box').length < 1) { // Prevent mouseleave when hovering over the tooltip itself
						methods.closeAll.call(this, options);
					}
					
				}
			});
			
			$('.spark-tooltip-box').on('mouseleave', function() {
				// Fix for IE and Opera because they don't support the great CSS "pointer-events" property!
				if(!$(event.relatedTarget).hasClass('spark-tooltip') || $(event.relatedTarget).parents('.spark-tooltip-box').length < 1) { // Prevent mouseleave when hovering back on the tooltip caller
					methods.closeAll.call(this, options);
				}
			});

		},
		
		closeAll: function(options) {
			$('.spark-tooltip-box').filter(':visible').stop().animate({
				opacity: 0,
				'margin-top': '0px'
				}, 100, "linear", function(){
					$(this).css('display', 'none'); // Display:none once transition to opacity:0 is complete.
				});
		}
	};

	$.fn.sparkTooltips = function(method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on sparkTooltips');
		}
		
	};
})(jQuery);

