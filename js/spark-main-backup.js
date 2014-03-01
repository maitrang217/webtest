// Spark Main javascript file
// Release: 13 (Spark 3.0 – April 2013)

(function ($) {

var menuOpenEvent;
var responsiveNavEnabled;
var isMobile;

	$(document).ready(function() {


		menuOpenEvent = (sparkOptions.nestedMenu == "click-to-open" || isMobile) ? 'mousedown' : 'mouseenter'; // Open submenu by mouseover or click?
		responsiveNavEnabled = (sparkOptions.mobileMenu == "select") ? true : false; // Use a <select> dropdown as the menu for mobile users?

		// Responsive Navigation (<select> dropdown for small-screen users)
		if (responsiveNavEnabled) {
			$('nav.menu').sparkMobileMenu(); // Offers an alternative navigation for small screen users.
		}

		// Dropdown sub-menus
		$('nav > ul > li.spark-has-submenu').sparkSubmenus({'openEvent':menuOpenEvent});

		/* External links (just add the "targetblank" class to any link you want) */
		$('a.targetblank').click(function(event) {
			event.preventDefault();
			event.stopPropagation();
			window.open(this.href, '_blank');
		});

		//Add class active to Menu
		$('nav a').click(function(){
			$('nav a.active').removeClass('active');
			$(this).addClass('active');
		});

		
		$("#foo4").after('<ul id="fooX" />').next().html($("#foo4").html());
		$("#foo4 li:odd").remove();
		$("#fooX li:even").remove();


		//	Responsive layout, resizing the items
		$('#foo4').carouFredSel({
			responsive: true,
			synchronise : "#fooX",
			scroll: 2,
			prev: '#prev3',
			next: '#next3',
			width: '100%',
			items: {
				width: 400,
				visible: {
					min: 2,
					max: 6
				}
			}
		});
		$('#fooX').carouFredSel({
			responsive: true,
			auto: false,
			items: {
				width: 400,
				visible: {
					min: 2,
					max: 6
				}
			}
		});

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

	  //.....................................................
	  //Full Calendar
	  	var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		
		$('#calendar').fullCalendar({
			editable: true,
			events: [
				{
					title: 'All Day Event',
					start: new Date(y, m, 1)
				},
				{
					title: 'Long Event',
					start: new Date(y, m, d-5)
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: new Date(y, m, d-3, 16, 0),
					allDay: false
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: new Date(y, m, d+4, 16, 0),
					allDay: false
				},
				{
					title: 'Meeting',
					start: new Date(y, m, d, 10, 30),
					allDay: false
				},
				{
					title: 'Lunch',
					start: new Date(y, m, d, 12, 0),
					end: new Date(y, m, d, 14, 0),
					allDay: false
				},
				{
					title: 'Birthday Party',
					start: new Date(y, m, d+1, 19, 0),
					end: new Date(y, m, d+1, 22, 30),
					allDay: false
				},
				{
					title: 'Click for Google',
					start: new Date(y, m, 28),
					end: new Date(y, m, 29),
					url: 'http://google.com/'
				}
			]
		});

	}); // <-- document ready

	


})(jQuery);
