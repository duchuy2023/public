/* ====== AUDIO PLAYER ====== */
var mainAudio = new Audio();
(function ($) {
  $.fn.audioPlayer = function (options) {
    const settings = $.extend(
      {
        baseUrlMedia: null,   // đổi tên ở đây
        keyAttr: "key",
        pauseClass: "pause",
        list: null
      },
      options
    );

    // Fallback nếu không truyền từ ngoài
    const defaultBaseUrlMedia = "https://cdn.jsdelivr.net/gh/hoangdienkr";
    settings.baseUrlMedia = settings.baseUrlMedia || defaultBaseUrlMedia;

    const $btns = this;
    let currentKey = null;
    const mainAudio = new Audio();

    $btns.off("click").on("click", function () {
      const $btn = $(this);
      const key = $btn.attr(settings.keyAttr);
      if (!key) return;

      // Đường dẫn audio
      const src = settings.list
        ? `${settings.baseUrlMedia}/${settings.list}/${key}`
        : `${settings.baseUrlMedia}/${key}`;

      if (currentKey === key && !mainAudio.paused) {
        mainAudio.pause();
        $btn.removeClass(settings.pauseClass);
      } else {
        mainAudio.src = src;
        mainAudio.play();
        currentKey = key;
        $btns.removeClass(settings.pauseClass);
        $btn.addClass(settings.pauseClass);
      }
    });

    mainAudio.addEventListener("ended", () => {
      $btns.removeClass(settings.pauseClass);
      currentKey = null;
    });

    return this;
  };
})(jQuery);
/* ======END AUDIO PLAYER ====== */
/* ======MENU ====== */
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

/* ======END MENU ====== */
/* ======TODAY ====== */
$(document).ready(function(){


 function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  const today = new Date();
  const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

  const thu = weekdays[today.getDay()];
  const day = pad(today.getDate());
  const month = pad(today.getMonth() + 1);
  const year = today.getFullYear();

  document.getElementById("today").innerText = `${thu}, ngày ${day}/${month}/${year}`;

});	
/* ======END TODAY  ====== */
/* ======LOADING  ====== */
window.addEventListener("load", function(){
  setTimeout(function(){
    const p = document.getElementById("preloader");
    p.style.opacity = "0";
    setTimeout(() => p.style.display = "none", 400);
  }, 1000); 
});
/* ======END LOADING   ====== */

