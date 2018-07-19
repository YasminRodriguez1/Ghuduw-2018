var bg; 
var current_lang;

//update background image

function updateImage(background_image){
    if (background_image == undefined){
      var bgArray = ['1.webp','2.webp','3.webp', '4.webp', '5.webp'];
      var path = 'images/';
      background_image = path+bgArray[Math.floor(Math.random() * bgArray.length)];
    }

    var bg_image;
      bg_image = "url('"+background_image+"')";
      if (background_image.startsWith("linear"))
        bg_image = background_image.substring(background_image.indexOf("url(") );
    
 

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



$(".newtab-btn").click(function(event) {
  window.open("newtab.html");
});



function load(){


  updateInspiration();
}



window.addEventListener('load', load);


//load newtab
function load(){

  bg = chrome.extension.getBackgroundPage(); 

  setDate();
  updateInspiration();
  localizePage();

}


window.addEventListener('load', load);

