<<<<<<< HEAD

// Spark Helpers
// Release: 1 (April. 2013)

(function($){

	$.sparkHelpers = {
		// Helper func. that returns the correct devicePixelRatio (even for unsupported browsers).
		getDevicePixelRatio: function() {

			if(window.devicePixelRatio === undefined) {
				return 1; // No pixel ratio available. Assume 1:1.
			} else {
				return window.devicePixelRatio;
			}
		},
			
		isMobileView: function() {
			return ($(window).width() <= 767); // This is the same size as set in the CSS Media Queries for mobile screens
		},
		
		// Tells if the UA is a mobile platform
		isMobilePlatform: function() {
			// Disclaimer: because some mobile browsers wrongly report support for fixed positioning, UA sniffing is the only way.
			return navigator.userAgent.match(/mobile safari|android|iphone|ipad|ipod|windows phone|blackberry|playbook|hp-tablet/gi);
		},

		// Tells if the UA is a recent version of WebKit
		isModernWebkit: function() {
			var AppleWebKitVersion = parseFloat(navigator.userAgent.slice(navigator.userAgent.indexOf("AppleWebKit")+12)) || false;
			if (AppleWebKitVersion && AppleWebKitVersion >= 534.30) { // Recent version of webkit mobile
				return true;
			} else {
				return false;
			}
		}
	};

})(jQuery);





=======

// Spark Helpers
// Release: 1 (April. 2013)

(function($){

	$.sparkHelpers = {
		// Helper func. that returns the correct devicePixelRatio (even for unsupported browsers).
		getDevicePixelRatio: function() {

			if(window.devicePixelRatio === undefined) {
				return 1; // No pixel ratio available. Assume 1:1.
			} else {
				return window.devicePixelRatio;
			}
		},
			
		isMobileView: function() {
			return ($(window).width() <= 767); // This is the same size as set in the CSS Media Queries for mobile screens
		},
		
		// Tells if the UA is a mobile platform
		isMobilePlatform: function() {
			// Disclaimer: because some mobile browsers wrongly report support for fixed positioning, UA sniffing is the only way.
			return navigator.userAgent.match(/mobile safari|android|iphone|ipad|ipod|windows phone|blackberry|playbook|hp-tablet/gi);
		},

		// Tells if the UA is a recent version of WebKit
		isModernWebkit: function() {
			var AppleWebKitVersion = parseFloat(navigator.userAgent.slice(navigator.userAgent.indexOf("AppleWebKit")+12)) || false;
			if (AppleWebKitVersion && AppleWebKitVersion >= 534.30) { // Recent version of webkit mobile
				return true;
			} else {
				return false;
			}
		}
	};

})(jQuery);





>>>>>>> origin/master
