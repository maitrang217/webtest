
// Spark Submenus (jQuery Plugin)
// Release: 1 (Feb. 2013)

(function($){

	var methods = {
		init: function(user_options) {
		
			var options = $.extend({
				'openEvent': 'mouseenter',
				'nested': true
			}, user_options);
			
//			var menuItems = $('nav > ul > li.spark-has-submenu');
			var menuItems = this;
			
			if (options.nested) {
//				$('nav ul.sub-menu li.spark-has-submenu').sparkSubmenusNested({'openEvent':menuOpenEvent});
				menuItems.find('> ul li.spark-has-submenu').sparkSubmenusNested({'openEvent':options.openEvent}); // Second-level (and more) nested submenus
			}
			
			window.navLinks_hasSubmenu = menuItems.find('> a[href^="#"]');
			
			if (options.openEvent == 'mouseenter') { // Mouse hover to open (the simplest scenario)
				menuItems.on({
					mouseenter: function() {
						methods.open.call($(this));
					},
					mouseleave: function() {
						methods.close.call($(this));
					}
				});
				
			} else { // Click to open
			
				// Conflict: Disable the smooth scroll for items with submenu (only if the menu is displayed)
				//if (!$.sparkHelpers.isMobileView() || !window.responsiveNavEnabled) {
					//window.navLinks_hasSubmenu.unbind('mousedown', window.navLinks_handler);
				//}

				// The click logic (mousedown is used instead of click to speed up reactivness)
				menuItems.mousedown(function(event){
					if (event.which == 2 || event.which == 3) {
						return; // We don't want to catch right (3) and middle (2) clics
					}
					if ($(this).hasClass('submenu-open')) { // Menu already open, let's close it
						methods.closeAll.call();
					} else {
						methods.closeAll.call(); // Close other eventually opened menus
						methods.open.call($(this));
					}
					
				}).click(function(event){
					// Prevent parent links to go through (when opening a submenu we don't want the opening link to actually go through)
					event.preventDefault();
					
				}).find('> ul').children().on('click mousedown', function(event){
					// [mousedown] This prevents the menu to be closed when clicking on it
					// [click] This allows the links to be clicked (because it won't reach the parent which has a preventDefault)
					event.stopPropagation();
				});
			}			
		},
		
		open: function() {
		
			menuItem = this;
			menuItem.addClass('submenu-open');  // Keep it highlighted while the dropdown menu is open
			
			menuLink = menuItem.find('> a');
			subMenu = menuItem.find('> ul.sub-menu');

			// Positioning vars
			menuPosition = menuLink.position(); // Menu position is intented to be the same as the opener's position
			menuOffset = menuLink.offset();

			// Off view?
			rightSpace = 10; // 10px on the right of the menu to avoid it to be sticked to the right of the window
			menuEndPosition = menuOffset.left + subMenu.width() + rightSpace; // This is the position of the right side of the submenu
			offView = menuEndPosition > $(window).width();

			// Adjust position of the submenu
			positionLeft = (offView) ? '-'+(menuEndPosition-$(window).width())+'px' : menuPosition.left+'px'; // Open the submenu on the left if there isn't enough space on the right

			subMenu.stop().css({'display':'block', 'left':positionLeft}).animate({
				opacity: 1,
				'margin-top': '0px'
				}, { duration: 200, easing: "linear" });
				
			// Listen all clics on the page
			$('html').bind('click', methods.close_handler);
		},
		
		close: function() {

			menuItem = this;
			menuItem.removeClass('submenu-open');
			menuItem.find('> ul.sub-menu').stop().animate({
				opacity: 0,
				'margin-top': '-10px'
			}, 100, "linear", function(){
				$(this).css('display', 'none');
			});
			
			// Stop listening all clicks on the page
			$('html').unbind('click', methods.close_handler);
		},
		
		closeAll: function() {
			$('.submenu-open').each(function(){
				methods.close.call($(this));
			});
		},
		
		// Click Handler (active only when a submenu is open).
		close_handler: function(event) {
			if (!$(event.target).is('nav li.submenu-open *, nav li.submenu-open')) {
				methods.closeAll.call();
			}
		}
		
	};

	$.fn.sparkSubmenus = function(method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on sparkSubmenus');
		}
		
	};
})(jQuery);


// Spark Submenus (Nested)

(function($){

	var methods = {
		init: function(user_options) {
		
			var options = $.extend({
				'openEvent' : 'mouseenter'
			}, user_options);

			menuItems = this;
//			menuItems = $('nav ul.sub-menu li.spark-has-submenu'); // All sub-submenu (within the drop-down menu)
			
			if (options.openEvent == 'mouseenter') { // Mouse hover to open (the simplest scenario)
				menuItems.on({
					mouseenter: function() {
						methods.open.call($(this));
					},
					mouseleave: function() {
						methods.close.call($(this));
					}
				});

			} else { // Click to open
			
				menuItems.mousedown(function(event){
					if (event.which == 2 || event.which == 3) {
						return; // We don't want to catch right (3) and middle (2) clics
					}
					
					if ($(this).hasClass('submenu-open')) {
						methods.close.call($(this));
					} else {
						methods.open.call($(this));
					}
					
					event.stopPropagation();
					
				}).click(function(event){
					// When a link is opening a submenu, disable its href ...
					event.preventDefault();
				
				}).find('> ul').children().on('click mousedown', function(event){
					// [click] ... but allow all other links from nested submenu
					// [mousedown] Stop menu closing when clicking on a link within it
					event.stopPropagation();
				});	
			}
		},
		
		open: function() {
		
			menuItem = this;
			menuItem.addClass('submenu-open'); // Keep it highlighted while the sub-submenu is open
					
			menuPosition = menuItem.position();
			menuOffset = menuItem.offset();
			menuWidth = menuItem.width();
			var offView = menuOffset.left + (menuWidth*2) > $(window).width();

			positionTop = menuPosition.top + 6; // ##HTBR
			positionLeft = (offView) ? (menuPosition.left - (menuWidth*2))+'px' : menuPosition.left+'px'; // Open the submenu on the left if it's going to trigger scroll
			marginLeftBefore = (offView) ? (menuWidth+10)+'px' : (menuWidth-10)+'px'; // If it opens on the left, lets invers the opening effect.
			
			menuItem.find('> ul.sub-menu').stop().css({'display':'block', 'margin-left':marginLeftBefore, 'top':positionTop, 'left':positionLeft}).animate({
				opacity: 1,
				'margin-left': menuWidth+'px'
				}, { duration: 100, easing: "linear" });
		},
		
		close: function() {

			menuItem = this;
			menuItem.removeClass('submenu-open');

			menuItem.find('> ul.sub-menu').stop().animate({
				opacity: 0,
				'margin-left': marginLeftBefore
				}, 100, "linear", function(){
					$(this).css('display', 'none');
				});
		}
	};

	$.fn.sparkSubmenusNested = function(method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on sparkSubmenusNested');
		}
		
	};
})(jQuery);

