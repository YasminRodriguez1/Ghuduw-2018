class RadioPlayer {

    constructor(){
        var radio_current_channel = data_controller.get_radio_current_channel();
		this.audio = new Audio(PLAYLIST[radio_current_channel]["link"]);
    }

    set_radio(new_index){
		this.audio = new Audio(PLAYLIST[new_index]["link"]);
		data_controller.set_radio_current_channel(new_index);
	}


    switch_channel(channel_number){
		this.audio.pause();
		this.set_radio(channel_number);
	    this.audio.play();
	}


    start(){
    	this.audio.play();
	}


    stop(){
    	this.audio.pause();
	}


 	main_function(){
		if(this.audio.currentTime == 0){
			this.audio.load();
			this.paused=true;
		}

		if (this.audio.paused || this.paused == "true"){
			this.start();
		}else{
			this.stop();
		}
	}

};