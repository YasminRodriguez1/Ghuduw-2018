//  play/stop radio

var current_index;

$(".radio-btn").click(function(){
    bg.radioplayer.main_function();
});

//  fill Radio Settings UI with channels.
function fill_playlist(){
  var playlist = bg.data_controller.languages[bg.data_controller.get_lang()].radio_playlist;
	for(var index in playlist) {
		if (index != current_index)
		{   
			channel = '<li class="channel-li channel_'+index+'"><a class="channel-anchor" data-channel="'+index+'"><div class ="channel"><i class="fas fa-play"></i></div><div class="info"><h2 class="title">' +  playlist[index]["name"]  + '</h2></div></a></li>'
	  	$(".channels-ul").append(channel)

	  }
	}

  if(playlist[current_index])
    channel = '<li class="channel-li channel_'+current_index+'"><a class="channel-anchor" data-channel="'+current_index+'"><div class ="channel"><i class="fas fa-pause"></i></div><div class="info"><h2 class="title">' +  playlist[current_index]["name"]  + '</h2></div></a></li>'
    
  $(".channels-ul").prepend(channel)

}

//remove Radio settings UI channels list.
function empty_radio(){

    $(".channels-ul").empty();

}

function begin_radio(){
  
  current_index = bg.data_controller.get_radio_current_channel();
  fill_playlist();

  $(".channel-anchor").click(function(e) {
    var channel_index = $(this).data('channel');
    if (current_index != channel_index){
        bg.radioplayer.switch_channel(channel_index);
        $(this).children('div.channel').html('<i class="fas fa-pause"></i>')
        $(".channel_" + current_index + " a .channel").html('<i class="fas fa-play"></i>')
        current_index = channel_index;
    }
    else{
        bg.radioplayer.main_function();
    }
  });

}



$(".filter-input").keyup(function(event){

    var txt = ($('.filter-input').val()).toLowerCase();
    if (txt == ''){
      $('.channels-ul .channel-li').each(function(i){
        $(this).show();
     });

  }
  else
  {
    $('.channels-ul .channel-li').each(function(i){
      inputvalue = ($(this).children('.channel-anchor').children('.info').children('h2').html()).toLowerCase();

      if (inputvalue.indexOf(txt) < 0){
        $(this).hide();
      }
      else
      {
        $(this).show();
      }
    });
  }   

});