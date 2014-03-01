
// Spark Mobile Menu (jQuery Plugin)
// Release: 1 (Feb. 2013)

// This plugin generates an alternative <select> menu for small screen users

(function($){

	var methods = {
		init: function() {

			// Create the <select>
			$("<select class='mobiles-only menu' />").appendTo("nav.menu");
			$('nav.menu > ul.nav').addClass('hide-for-mobiles'); // We've got the <select> for mobiles, let's hide the <ul>

			// Create default option "Menu"
			$("<option />", {
			 "selected": "selected",
			 "value"   : "",
			 "text"    : "Menu"
			}).appendTo("nav.menu select.menu");

			// Populate dropdown with menu items
			$("nav.menu > ul > li").each(function() {
				methods._populate.call($(this), '')
			});

			$("nav.menu select.menu").change(function() {
				window.location = $(this).find("option:selected").val();
			});
		},
		
		// Helper method that populates the <select> (used for mobile navigation) with all nested menu items
		_populate: function(level) {

			var menuItem = this;
			var menuLink 	= menuItem.find('> a'),
				hasChildren = menuItem.find("> ul"),
				children    = menuItem.find("> ul > li"),
				nesting = (level) ? ' '+level : '',
				menuHref = menuLink.attr("href");
		//		nesting		= (level && level !== ' ') ? level+' ' : '',
		//		nextLevel 	= (level) ? level+' -' : ' ';	

			$("<option />", {
			   "value"    : menuHref,
			   "text"     : nesting + menuLink.clone().children().remove().end().text(), // This complexity is to remove "child text" such as subtitles
			   "selected" : (menuHref == window.location.href || menuHref == window.location.hash) ? "selected" : ""
			}).appendTo("nav.menu select.menu");

			if (hasChildren.length) {
				children.each(function() {
					methods._populate.call($(this), level+'- ');
				});
			}
		}
	};

	$.fn.sparkMobileMenu = function(method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on sparkMobileMenu');
		}
		
	};
})(jQuery);

