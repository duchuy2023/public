
$(function() {		   
	// main menu toggler
	$('.nav .container').prepend('<div class="menu-icon"><a class="navbar-brand" href="#"><img src="https://cdn.jsdelivr.net/gh/duchuy2023/public@main/logom.png" alt="Hoang Dien Logo" height="40"></a><span>Menu</span></div>');
	$('.menu-icon').click(function(){						
		$('ul.dropdown').slideToggle(600);
		$(this).toggleClass("active");	
	});	
	// sub menu accordion-like toggler 
	var $menuToggler = $('.sub > a');
	$menuToggler.click(function(e) {
		e.preventDefault();
		var $this = $(this);
		$this.toggleClass('current').next('ul').toggleClass('current');
	});	
	
});


