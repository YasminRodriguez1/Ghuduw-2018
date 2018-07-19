var bg;


$('select').on('change', function() {
      bg.data_controller.set_lang(this.value);
      location.reload();
})

function welcome_page(){

  bg = chrome.extension.getBackgroundPage(); 

  $('select option[value="'+bg.data_controller.get_lang()+'"]').attr("selected",true);

  var slideContainer = $('.slide-container');
  
  slideContainer.slick({autoplay: false, dots: true, arrows: false,
  speed: 500,
  fade: true,
  cssEase: 'linear'});
  
  $('.clash-card__image img').hide();
  $('.slick-active').find('.clash-card img').fadeIn(200);
  
  // On before slide change
  slideContainer.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    $('.slick-active').find('.clash-card img').fadeOut(1000);
  });
  
  // On after slide change
  slideContainer.on('afterChange', function(event, slick, currentSlide) {
    $('.slick-active').find('.clash-card img').fadeIn(200);
  });
  
  localizePage(false);
}


$(".start_button").click(function(event) {
  open_new_tab("newtab.html");
});

$(".flags_button").click(function(event) {
  open_new_tab("chrome://flags/#autoplay-policy");
});


window.addEventListener('load', welcome_page);
