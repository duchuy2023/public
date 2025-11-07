$(function(){		   	
	$('ul.dropdown li').hover(function(){			
		$(this).addClass("hover");
		$('ul:first',this).css('display', 'block');
	}, function(){
		$(this).removeClass("hover");
		$('ul:first',this).css('display', 'none');
	});	
});
