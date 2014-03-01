
var responsiveNavEnabled;
var page,
	navLinks;
var menuOpenEvent;
var isMobile;

var getListCandidatesBySchool = function(uni){
	var unlistedArray = ["home", "features", "events", "themes", "contact"]

	if (jQuery.inArray(uni, unlistedArray) == -1 ) {
			$.getJSON("json/" + uni + ".json", function( data ) {
			console.log("Array length: ", data.length);
	  		var html_odd = '';
	  		var html_even = '';
	  		$('#foo4').empty();
	  		$('#fooX').empty();

	  		$.each(data, function(entryIndex, entry) {
	      		if( entryIndex % 2 == 0 ) {
	      			html_odd += '<li>';
	      			html_odd += '<img src="images/elections/' + entry.img + '" alt=""/><br>';
	      			html_odd += '<p><span class="name">' + entry.cname+'</span><br>' + entry.major + '</p>';
	      			html_odd += '</li>';
	      		}
	      		else {
	  				html_even += '<li>';
	      			html_even += '<img src="images/elections/' + entry.img + '" alt=""/><br>';
	      			html_even += '<p><span class="name">' + entry.cname + '</span><br>' + entry.major + '</p>';
	      			html_even += '</li>';
	      		}

	      		if((entryIndex == data.length-1) && (entryIndex % 2 == 0)){
	      			html_even += '<li>';
	      			html_even += '<img src="images/elections/blank_WEB.png" alt=""/><br>';
	      			html_even += '</li>';
	      		}
	  		});

	  		$('#foo4').html(html_odd);
	  		$('#fooX').html(html_even);

	  		if (data.length % 2 == 0){
	  			$.fn.carouFredSel.defaults.items.start = data.length;
	  		} else {
	  			$.fn.carouFredSel.defaults.items.start = data.length + 1;
	  		}

			$('#foo4').carouFredSel({
				responsive: true,
				synchronise : "#fooX",
				prev: '#prev3',
				next: '#next3',
				width: '100%',
				auto: {
					timeoutDuration: 8000
				},
				items: {
					width: 400,
					visible: 2
				}
			});
			$('#fooX').carouFredSel({
				responsive: true,
				auto: false,
				width: '100%',
				items: {
					width: 400,
					visible: 2
				}
			});

		}).error(function(jqXhr, textStatus, error) {
	    	alert("ERROR: " + textStatus + ", " + error);
	    });
	}
}

var startLoadingData = function(){
	var uni = window.location.hash.slice(1);
    console.log("hash from inital load: ", uni);
	getListCandidatesBySchool(uni);
	$('a.selected').removeClass('selected');
	$('a[href*="#' + uni +'"]').addClass("selected");
}

$(document).ready(function() {
	if (window.location.hash && window.location.hash != "#") {
        startLoadingData();
    }
    else {
    	getListCandidatesBySchool("aalto");
    	$('a[href*="#aalto"]').addClass("selected");
    }

	$(window).on('hashchange',function(){
		startLoadingData();
	})

    $('.university-container li a.yliopisto').click(function(e){
	    $('.university-container li a.yliopisto').removeClass('selected');
	    $(this).addClass('selected');
	    var uni = $(this).data('uni');

	    $("#listCandidates").attr('name', uni);

	    getListCandidatesBySchool(uni);
		//e.preventDefault();
	});


	$('html').removeClass('no-js'); // Remove this if using Modernizr

	var isAndroid = (/android/gi).test(navigator.appVersion),
		isIDevice = (/iphone|ipad|ipod/gi).test(navigator.appVersion),
		isPlaybook = (/playbook/gi).test(navigator.appVersion),
		isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);

	isMobile = (isAndroid || isIDevice || isPlaybook || isTouchPad);

	if (isMobile) {
		$("html").addClass("mobile");
		page = $('html,body');
	} else {
		page = $('#main');
	}

	navLinks = $('nav a[href^="#"]');

	checkNavIntegrity(); // This checks if there aren't any broken links in the menu (you can remove this line)

	// Change all articles ID to avoid interference with browser's own scrollTo#hash
	navLinks.each(function(){
		var target = $(this).attr('href').replace(/#/, '');
			$('#'+target).attr('id', target+'_modified'); // Change ID
	});


	scroll_handler();	// Set menu according to scroll position
	page.bind('scroll', scroll_handler);

	var hash_update_timer;

	// Top navigation links
	navLinks.mousedown(function() {
		// Change current active link
		$('nav a.active').removeClass('active');
		$(this).addClass('active');

		// Scroll the page!
		var target = $(this).attr('href'),
			targetPosition = page.scrollTop() + $(target+'_modified').position().top;
			targetPosition = (targetPosition == 0) ? targetPosition : targetPosition + 20; // Remove some padding

		clearTimeout(hash_update_timer); // Cancel any pending hash update

		page.unbind('scroll', scroll_handler); // Turn off scroll_handler
		page.stop().animate({scrollTop: targetPosition}, 500, function() {
			clearTimeout(hash_update_timer); // Cancel any previous hash update again
			if (window.location.hash !== target) { // Update #hash in URL only if the new differs from the current one
				hash_update_timer = setTimeout(function(){location.hash = target;}, 10);
			}
			page.bind('scroll', scroll_handler); // Turn scroll_handler back on when animate complete
		});
	}).click(function(){
		return false;
	});


	// Make the logo points to the homepage
	$('.logo a').mousedown(function() {
		$('nav a:first').trigger('mousedown');
	//	$('nav a[href=#contact]').trigger('mousedown'); // Use this instead if you want the logo to points somewhere else
	}).click(function(){
		return false;
	});

	//Show select menu for mobile view
	responsiveNavEnabled = (sparkOptions.mobileMenu == "select") ? true : false; // Use a <select> dropdown as the menu for mobile users?
	// Responsive Navigation (<select> dropdown for small-screen users)
	if (responsiveNavEnabled) {
		$('nav.menu').sparkMobileMenu(); // Offers an alternative navigation for small screen users.
	}


	// Dropdown sub-menus
	menuOpenEvent = (sparkOptions.nestedMenu == "click-to-open" || isMobile) ? 'mousedown' : 'mouseenter'; // Open submenu by mouseover or click?
	$('nav > ul > li.spark-has-submenu').sparkSubmenus({'openEvent':menuOpenEvent});

	// Internal links outside the <nav> which have the .animate class
	$('a.animate[href*=#]:not(nav a)').click(function(){
		var target = $(this).attr('href');
		if ($('nav a[href='+target+']').length > 0){ // Target is part of the main navigation? (for which we altered the IDs)
			$('nav a[href='+target+']').trigger('mousedown');
		} else { // Target is outside main navigation: just scroll to target, no history management (which is good if you just want to scroll back to top using "#")
			targetPosition = target != '#' ? $(target).offset().top + page.scrollTop() - page.position().top : 0;
			page.unbind('scroll', scroll_handler); // Turn off the scroll_handler
			page.stop().animate({scrollTop: targetPosition}, 500, function() {
				page.bind('scroll', scroll_handler); // Turn scroll_handler back on when animate complete
			});
		}
		return false;
	});


	/* External links (just add the "targetblank" class to any link you want) */
	$('a.targetblank').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		window.open(this.href, '_blank');
	});


	// Set menu and scroll position according to #hash in URL
	hash_handler();


	$("#foo4").after('<ul id="fooX" />').next().html($("#foo4").html());
		$("#foo4 li:odd").remove();
		$("#fooX li:even").remove();
		//...................................................
	  // When a dot is clicked
	  $('#foo1_pag a.number').click(function(){

	    $('#foo1_pag a.number').removeClass('selected');
	    $(this).addClass('selected');

	    var number = $(this).data('number');
	    var number_element = '.number_detail#' + number;
	    var htmlCode = $(number_element).html();

	    $('.detail_container').fadeOut(200, function(){
	      $('.detail_container').attr('id', number);
	      $('.detail_container .number_detail').html(htmlCode);
	      $('.detail_container').fadeIn(200);
	    });

	  });


		//Load page
		//Show blank page while loading
	    $(window).load(function() {
	        $(".loader").fadeOut("fast");
	    });



}); // <-- document ready


$(window).hashchange(function(){
	// Set menu and scroll position according to #hash in URL
	hash_handler();
})


/* Functions */
function checkNavIntegrity(){
	// Debug function that checks that all navigation links have appropriate <article> with corresponding ID.
	// You can remove this once you finihed working on the site.
	navLinks.each(function(){
		var linkHref = $(this).attr('href'),
			correspondingArticle = $(linkHref);

			if(correspondingArticle.length == 0) {
				var linkValue = $(this).html(),
					targetId = linkHref.replace(/#/, '');
				alert('Navigation Broken: The menu link "'+linkValue+'" points to a nonexistent ID "'+linkHref+'". \n'
					 +'To solve this, add the ID "'+targetId+'" to a tag, for example: <article id="'+targetId+'">');
			}
	});
}

function hash_handler() { // Set menu link and page position according to #hash value in URL
	var hash = window.location.hash;

	if(hash) {
		$('a[href='+hash+']').trigger('mousedown');
	} else {
		$('nav a.active').removeClass('active');
		$('nav a:first').addClass('active');

		page.unbind('scroll', scroll_handler); // Turn off scroll_handler
		page.stop().animate({scrollTop: 0}, 500, function() {
			page.bind('scroll', scroll_handler); // Turn scroll_handler back on when animate complete
		});
	}
}

function scroll_handler() { // Set menu link according to scroll position
	navLinks.each(function(){
		var target = $(this).attr('href'),
			pagePosition = page.scrollTop() + $(target+'_modified').position().top;

			if(page.scrollTop() > pagePosition - 320) {
				$('nav a.active').removeClass('active');
				$(this).addClass('active');
			}
			if($(this).is(':last-child') // Fix for last page on large displays and/or last page's height too small
			   && page.scrollTop() + page.height() > page[0].scrollHeight - 50) {
				$('nav a.active').removeClass('active');
				$(this).addClass('active');
			}
	});
}