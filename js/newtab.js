var bg; 
var current_lang;

function countdown_to_ramadan(){
    var endDate = "May  5, 2019 00:00:00";
	$('.countdown.simple').countdown({ date: endDate });
	$('.countdown.styled').countdown({
	  date: endDate,

	  render: function(data) {
	     $(this.el).html("<div>"+ 
                      this.leadingZeros(data.sec, 2).toIndiaDigits() + 
                      " <span>"+bg.data_controller.translate("second")+"</span> </div><div>" + 
                      this.leadingZeros(data.min, 2).toIndiaDigits() + 
                      " <span>"+bg.data_controller.translate("minute")+"</span></div><div>"  + 
                      this.leadingZeros(data.hours, 2).toIndiaDigits() + 
                      " <span>"+bg.data_controller.translate("hour")+"</span></div><div>"  +
                      this.leadingZeros(data.days, 2).toIndiaDigits() + 
                      " <span>"+bg.data_controller.translate("day")+"</span></div>");
	  }
	});
	$('.countdown.callback').countdown({
	  date: +(new Date) + 10000,
	  render: function(data) {
		$(this.el).text(this.leadingZeros(data.sec, 2) + " sec");
	  },
	  onEnd: function() {
		$(this.el).addClass('ended');
	  }
	}).on("click", function() {
	  $(this).removeClass('ended').data('countdown').update(+(new Date) + 10000).start();
	});
}

//update background image

function updateImage(background_image){
    if (background_image == undefined){
      var bgArray = ['1.webp','2.webp','3.webp', '4.webp', '5.webp'];
      var path = 'images/';
      background_image = path+bgArray[Math.floor(Math.random() * bgArray.length)];
    }

    var bg_image;

    if (typeof popup_method !== 'undefined' && popup_method) {
      bg_image = "url('"+background_image+"')";
      if (background_image.startsWith("linear"))
        bg_image = background_image.substring(background_image.indexOf("url(") );
    }
    else if (background_image.startsWith("linear"))
      bg_image = background_image;
    else
      bg_image = "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('" + background_image + "')";
    
 

    $('<img/>').load(background_image, function(res, status, xhr) {
        if(status == "error"){
             updateImage();

        }
        else{
             $(this).remove(); 
            $('html').css('background-image', bg_image);
            $('.background-img-div').css('background-image', bg_image);    }
    });
}

//update inspiration
function updateInspiration() {

    images_reload = bg.data_controller.get_images();
    preloadImages(images_reload);


    recommendUrls = bg.data_controller.get_random_data("recommend_urls");
    quote = bg.data_controller.get_random_data("quotes");

    if (quote.source != "")
      $('.quote').html(quote.text + "<br/> ~ " + quote.source);
    else
       $('.quote').html(quote.text);

    $("#ghuduw_recommendation_url").attr("href", recommendUrls.link);
    
    $(".watch-btn").prop('title', $(".watch-btn").prop('title') + ": "+ recommendUrls.title);

    background_result = bg.data_controller.get_random_data("backgrounds").url;
    updateImage(background_result);

}


//background image/video mode
//chrome://flags/#autoplay-policy
function set_bg_mode(){
   mode = bg.data_controller.get_background_mode();
  if (mode == "video"){
    update_background_video();
  }
  else{
    hide_background_video();
  }

}
function video_background_run(){
   mode = bg.data_controller.set_background_mode();
  if (mode == "video"){
    update_background_video();
  }
  else{
    hide_background_video();
  }
}
function update_background_video(){
  var vid = bg.data_controller.get_random_data("backgrounds_video").url;
  $('#bgVideoPlayer iframe').attr('src', "https://youtube.com/embed/" + vid + "?html5=1&autoplay=1&vmode=transparent&controls=0&showinfo=0&autohide=1&iv_load_policy=3&vq=HD1080");
  $('#bgVideoPlayer').show();
  $('.bgmode-btn').html('<span class="fas fa-file-image"></span>');
  $('.bgmode-btn').prop('title',bg.data_controller.languages[bg.data_controller.get_lang()].img_bg);

}


function hide_background_video(){
  $('#bgVideoPlayer iframe').attr('src', "");
  $('#bgVideoPlayer').hide();
  $('.bgmode-btn').html('<span class="fas fa-file-video"></span>');
  $('.bgmode-btn').prop('title',bg.data_controller.languages[bg.data_controller.get_lang()].video_bg);



}


//taskinator rightside menu toggle

var menuRight = document.getElementById( 'cbp-spmenu-s2' ),
    showRightPush = document.getElementById( 'tasks-btn' );
    body = document.body;



showRightPushAutomatic = function() {
  that = document.getElementById( 'tasks-btn' );
  classie.toggle( that, 'active' );
  classie.toggle( body, 'cbp-spmenu-push-toleft' );
  classie.toggle( menuRight, 'cbp-spmenu-open' );
};

showRightPush.onclick = function() {

      bg.storage_set("taskinator_btn", !bg.storage_get("taskinator_btn"));
      that = this;
        // Permissions must be requested from inside a user gesture, like a button's
        // click handler.
      classie.toggle( that, 'active' );
      classie.toggle( body, 'cbp-spmenu-push-toleft' );
      classie.toggle( menuRight, 'cbp-spmenu-open' );
      
};

//Expanding Buttons
postWebsitesButtonClick = $(function (){
    var buttonWrapper = $("#recommended-icons-exp"),
        button = $("#recommended-icons-exp > button"),
        icons = $("#recommended-icons-exp > .icon-wrapper"),
        close = $(".close-recommended-websites-icons");
    
    function init(){
        button.on("click", toggle);
        close.on("click", closeIcons);
    }
    
    function toggle(e){
        if (buttonWrapper.hasClass("active")){
            closeIcons();
        } else{
            openIcons();
        }
        e.preventDefault();
    }
    
    function openIcons(){

        buttonWrapper.addClass("active");

        buttonWrapper.addClass("dropdown-mode");

        button.addClass("hidden");

        buttonWrapper.animate({width: "180"}, 500);

        icons.animate({left: "0"}, 500);

    }
    
    function closeIcons(){
        buttonWrapper.removeClass("active");
                buttonWrapper.removeClass("dropdown-mode");

      button.removeClass("hidden");
        icons.animate({left: "-286"}, 0);
        buttonWrapper.animate({width: "49"}, 0);
    }
    
    init();
});


postShareButtonClick = $(function (){
    var buttonWrapper = $("#social_icons_exp"),
        button = $("#social_icons_exp > button"),
        icons = $("#social_icons_exp > .icon-wrapper"),
        close = $(".close-social-icons");
    
    function init(){
        button.on("click", toggle);
        close.on("click", closeIcons);
    }
    
    function toggle(e){
        if (buttonWrapper.hasClass("active")){
            closeIcons();
        } else{
            openIcons();
        }
        e.preventDefault();
    }
    
    function openIcons(){

        buttonWrapper.addClass("active");

        buttonWrapper.addClass("dropdown-mode");

        button.addClass("hidden");

        buttonWrapper.animate({width: "288"}, 500);

        icons.animate({left: "0"}, 500);

    }
    
    function closeIcons(){
        buttonWrapper.removeClass("active");
                buttonWrapper.removeClass("dropdown-mode");

      button.removeClass("hidden");
        icons.animate({left: "-286"}, 0);
        buttonWrapper.animate({width: "49"}, 0);
    }
    
    init();
});
//on Language change.
function set_env(start=false){
    if(typeof bg == "undefined" || bg == null || bg.taskinator == null || bg.data_controller == null || typeof bg.data_controller == "undefined"  ){
            location.reload();

    }
	  current_lang = current_lang || bg.data_controller.get_lang();

    if(start==false){
      location.reload();
    }

	  //$(".radio-playlist ul li")[0].click();
	  if(start == false){
	    bg.data_controller.setup_data();
	  }
    bg = chrome.extension.getBackgroundPage(); 
    empty_radio();
    begin_radio();
    setDate();
    $('select option[value="'+bg.data_controller.get_lang()+'"]').attr("selected",true);
    localizePage();
    updateInspiration();



}


/* btn click event handlers */


$(".change-lang-btn").click(function(event) {
	if (current_lang == "ar")
		current_lang = "en"
	else
		current_lang = "ar"

	set_env();

});


$(".watch-btn").click(function(event) { 
	  event.stopPropagation();
    window.open($('#ghuduw_recommendation_url').attr('href'));
});

$(".bgmode-btn").click(function() {

  video_background_run();

});




$(".reset_date").click(function(event) {
    bg.data_controller.reset_hijri_adj();
    setDate();
});


$(".qtyplus").click(function(event) {  
   	bg.data_controller.inc_hijri_adj();
    setDate();
});

$(".qtyminus").click(function(event) {  
	bg.data_controller.dec_hijri_adj();
    setDate();
});

$('.repeat-btn').click(function(event) {
  	updateInspiration();
});

$('select').on('change', function() {
      bg.data_controller.set_lang(this.value);
      location.reload();
})



$(".facebook-share").click(function(event) {
  var url = "http://www.facebook.com/sharer.php?u=https://goo.gl/ilYKaY";
  window.open(url);
});



$(".twitter-share").click(function(event) {
  quote= $('#quote').text();
  var url = "https://twitter.com/share?url=https://goo.gl/ilYKaY&amp;text= " + quote + " &amp;hashtags=غُدُوّ ";
  window.open(url);
});


$(".linkedin-share").click(function(event) {
  var url = "http://www.linkedin.com/shareArticle?mini=true&amp;url=https://goo.gl/ilYKaY";
  window.open(url);
});


$(".googleplus-share").click(function(event) {
  var url = "https://plus.google.com/share?url=https://goo.gl/ilYKaY";
  window.open(url);
});


$(".quran-btn").click(function(event) {
  var url = "https://quran.com/";
  window.open(url);
});



$(".tafsir-btn").click(function(event) {
  var url = "http://library.islamweb.net/newlibrary/bookslist.php?subject=%CA%DD%D3%ED%D1%20%C7%E1%DE%D1%C2%E4";
  window.open(url);
});

$(".hadith-btn").click(function(event) {
  var url = "https://dorar.net/hadith/search?q=%D8%AD%D8%AF%D9%8A%D8%AB&st=a&xclude=";
  window.open(url);
});


$(".chromewebstore-url").click(function(event) {
  var url = "https://chrome.google.com/webstore/detail/%D8%BA%D9%8F%D8%AF%D9%8F%D9%88%D9%91/aeajnoplcpamgigegldkgiffjbfablna";
  window.open(url);
});

$(".flags_button").click(function(event) {
  open_new_tab("chrome://flags/#autoplay-policy");
});

//preload images
//preloadImages(["url1.jpg", "url2.jpg", "url3.jpg"], true);
function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

/* download ghuduw's image of the day */
function save_image(){

  var element = $("html")[0]; // global variable
  var getCanvas; // global variable

  $(".download-ghuduw-photo").on('click', function () {
    $(".hidden-element").show();
    $('#cbp-spmenu-s2').hide();
    $('#nav-menu').hide();
    $('.footer').hide();
    $(".month-progress").hide();


    html2canvas(element, {
      useCORS: true
    }).then(function (canvas) {

      $('#cbp-spmenu-s2').show();
      $('#nav-menu').show();
      $('.footer').show();
      $(".month-progress").show();
      $(".hidden-element").hide();


      var imgageData = canvas.toDataURL("image/png");

      // Now browser starts downloading it instead of just showing it
      var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
      ($("#ghuduw-download-btn").attr("download", "Ghuduw.png").attr("href", newData))[0].click();;

    })
    .catch(function (err) { console.log(err); });
  })
      
}




//load newtab
function load(){

	bg = chrome.extension.getBackgroundPage(); 

	set_env(true);
  set_bg_mode();
	setDate();
	countdown_to_ramadan();
	save_image();


	if (bg.storage_get("taskinator_btn") == true){
	    showRightPushAutomatic();
	} 

}


window.addEventListener('load', load);

