//Notifications with an advice every random time between half an hour and three hours
function advice_user_loop() {
    setTimeout(function() {
    	    advice_type = data_controller.translate("advice_notification_title");
            advice = data_controller.get_random_data("advices")["body"];
            notify_me(advice_type,advice);
            advice_user_loop();  
    }, random_between(HALF_AN_HOUR,THREE_HOURS));
};


function init_bg(){
	init_storage();

	advice_user_loop();
}

function init_storage(){
    data_controller = data_controller || new DataController;
    taskinator = taskinator || new Taskinator;
    radioplayer = radioplayer || new RadioPlayer;
}

var data_controller ;
var taskinator;
var radioplayer;
var lang_dict = {};

chrome.runtime.onInstalled.addListener(function (details) {
    if (details && details.reason && details.reason == 'install') {
        open_new_tab("welcome.html");
    }else{
        open_new_tab("welcome.html");
    }

    chrome.permissions.contains({ permissions: ['storage']}, function(result) {
        if (result) {
           init_bg();
        } 
    });
});

init_bg();