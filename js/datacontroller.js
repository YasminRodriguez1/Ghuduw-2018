//Ghuduw's Data Controller for settings, quotes, bg, ..etc
class DataController {

    // gets data from API for the firt time.
    constructor(){
        if (storage_get("user_id") === undefined){
            storage_set("user_id", random_key());
        }
        this.update_data();
        this.languages = {};
        this.setup_language();
  
    }

    log_user(){
        var language = this.get_lang();
        var user_id = storage_get("user_id");
        var data = new FormData();
        data.append('lang', language);
        data.append('user_id', user_id);
        var url = API_DOMAIN + LOG_URL;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = function () {
        // do something to response
        };
        xhr.send(data);
    }

    // update data from API every UPDATE_FREQ days. 
    update_data(){

        var data_update_date = storage_get("data_update_date") || "undefined";

        if (data_update_date === "undefined" || DateDiff.inDays(data_update_date) > UPDATE_FREQ){
            this.setup_data(); 
        }     

    }

    //returns all data of the sent key.
    get_all(data_type){
        this.update_data();
        return storage_get(data_type) || {};
    }

    // setup Data from the API
    setup_data() {
      var quote ;
      var xhr = new XMLHttpRequest();
      var DATA_FOR_CACHING_BY_LANG = DATA_FOR_CACHING + LANG_PARAM + this.get_lang();
      // synchronization true, as not to show tab or pop up before changing the notification.
      xhr.open("GET", DATA_FOR_CACHING_BY_LANG, false);
      xhr.onreadystatechange=function() {
              // works after getting the feed
                if (xhr.readyState == 4 && this.status == 200) {
                    var res = JSON.parse(xhr.response);

                    var quotes = res["quotes"];
                    var quotes_counter = res["quotes_counter"];
                    storage_set("quotes", quotes);
                    storage_set("quotes_counter", quotes_counter);
                    storage_set("quotes_keys", Object.keys(quotes))

                    var backgrounds = res["backgrounds"];
                    var backgrounds_counter = res["backgrounds_counter"];
                    storage_set("backgrounds", backgrounds);
                    storage_set("backgrounds_counter", backgrounds_counter);
                    storage_set("backgrounds_keys", Object.keys(backgrounds))

                    var backgrounds_video = res["backgrounds_video"];
                    var backgrounds_video_counter = res["backgrounds_video_counter"];
                    storage_set("backgrounds_video", backgrounds_video);
                    storage_set("backgrounds_video_counter", backgrounds_video_counter);
                    storage_set("backgrounds_video_keys", Object.keys(backgrounds_video))


                    var recommend_urls = res["recommendUrls"];
                    var recommend_urls_counter = res["recommendUrls_counter"];
                    storage_set("recommend_urls", recommend_urls);
                    storage_set("recommend_urls_counter", recommend_urls_counter);
                    storage_set("recommend_urls_keys", Object.keys(recommend_urls));


                    var advices = res["advices"];
                    var advices_counter = res["advices_counter"];
                    storage_set("advices", advices);
                    storage_set("advices_counter", advices_counter);
                    storage_set("advices_keys", Object.keys(advices))


                    var background_array = res["background_array"];
                    storage_set("backgrounds_array", background_array);

                    storage_set("data_update_date", new Date() + "");
            
                }
        };
        xhr.send();
    }

    // Language is set by User. Default is "ar".
    set_lang(lang){
        storage_set("lang", lang);
        this.setup_language();
        this.log_user();
    }

    get_lang(lang){
        lang = storage_get("lang");
        if (typeof lang !== 'undefined') {
             return lang;
        }else{
            storage_set("lang", "ar");
            return "ar";
        }
    }

    setup_language(){
        var language_script_url = LOCALES_PATH + this.get_lang() + ".js";
        load_script(language_script_url);
        this.setup_data();

    }

    translate(key,args){
        return this.languages[this.get_lang()][key];
    }


    // Background mode: Image or Youtube Video.
    // The Setter switches the current value.
    set_background_mode(){
        var mode = storage_get("bg_mode");

        if (typeof mode == 'undefined' || mode == 'image' ) {
            storage_set("bg_mode", "video");
        }else{
            storage_set("bg_mode", "image");
        }
        return this.get_background_mode();
    }


    get_background_mode(){
        return storage_get("bg_mode");
    }


    // gets random data from the sent key name.
    get_random_data(data_type){
        this.update_data();
        var data_counter = storage_get(data_type+ "_counter") || 0;
        var result = ""

        if (data_counter != 0) {
            var data_keys = storage_get(data_type+ "_keys");
            var random = Math.floor(Math.random()*data_counter);
            var _id = data_keys[random];
            var data = storage_get(data_type) || {};
            result = data[_id];
    
        }

        return result;

    }

    // retrieve an array of background images.
    get_images(){
        var bg_array = storage_get("backgrounds_array");
        if (typeof bg_array !== 'undefined') {
             return bg_array;
        }else{
            this.setup_data(); 
            return [];
        }



    }
    // get  hijri Adjusment variable. It is used in gettings today's Hijri date.
    reset_hijri_adj(){
        storage_set("hijri_adj_number",DEFAULT_HIJRI_ADJ);
    }

    // get  hijri Adjusment variable. It is used in gettings today's Hijri date.
    get_hijri_adj(){
        var hijri_adj_number = storage_get("hijri_adj_number");
        if (typeof hijri_adj_number !== 'undefined') {
             return hijri_adj_number;
        }else{
            storage_set("hijri_adj_number",DEFAULT_HIJRI_ADJ);
            return DEFAULT_HIJRI_ADJ;
        }

    }

    // decrease hijri Adjusment variable by 1.
    dec_hijri_adj(){
           
        var hijri_adj_number = storage_get("hijri_adj_number");
        hijri_adj_number--;
        storage_set("hijri_adj_number",hijri_adj_number);
            
    }

    // decrease hijri Adjusment variable by 1. 
    inc_hijri_adj(){

        var hijri_adj_number = storage_get("hijri_adj_number");
        hijri_adj_number++;
        storage_set("hijri_adj_number",hijri_adj_number);
    }


    //radio current radio channel
    set_radio_current_channel(channel){
        storage_set("radio_current_channel",channel)
    }

    get_radio_current_channel(){
        var radio_current_channel = storage_get("radio_current_channel");
        if (typeof radio_current_channel !== 'undefined') {
             return radio_current_channel;
        }else{
            storage_set("radio_current_channel",1)
            return 1;
        }
    }
};

