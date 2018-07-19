// Run a function on the background page.
// Inputs (positional):
//   first, a string - the name of the function to call
//   then, any arguments to pass to the function (optional)
//   then, a callback:function(return_value:any) (optional)
function BGcall() {
    var args = [];
    for (var i=0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    var fn = args.shift();
    var has_callback = (typeof args[args.length - 1] === "function");
    var callback = (has_callback ? args.pop() : function() {});
    chrome.runtime.sendMessage({ command: "call", fn:fn, args:args }, callback);
}

// Needs to be enabled to be used.
// How to enable? check Adblock code here: 
//Enabled in adblock_start_common.js and background.js if the user wants
var log = function() {};

function logging(enabled) {
    if (enabled) {
        log = function() {
            if (VERBOSE_DEBUG) { // comment out for verbosity
                console.log.apply(console, arguments);
            }
        };
    } else {
        log = function() {};
    }
}

logging(false); // disabled by default

// Behaves very similarly to $.ready() but does not require jQuery.
function onReady(callback) {
    if (document.readyState === "complete") {
        window.setTimeout(callback, 0);
    } else {
        window.addEventListener("load", callback, false);
    }
}

// Inputs: key:string.
// Returns value if key exists, else undefined.
function storage_get(key) {
    var store = localStorage;
    if (store === undefined) {
        return undefined;
    }
    var json = store.getItem(key);
    if (json === null) {
        return undefined;
    }
    try {
        return JSON.parse(json);
    } catch (e) {
        log("Couldn't parse json for " + key);
        return undefined;
    }
}

// Inputs: key:string, value:object.
// If value === undefined, removes key from storage.
// Returns undefined.
function storage_set(key, value) {
    var store =  localStorage;
    if (value === undefined) {
        store.removeItem(key);
        return;
    }
    try {
        store.setItem(key, JSON.stringify(value));
    } catch (ex) {
        log(ex);
    }
}

// Return obj[value], first setting it to |defaultValue| if it is undefined.
function setDefault(obj, value, defaultValue) {
    if (obj[value] === undefined) {
        obj[value] = defaultValue;
    }
    return obj[value];
}

// Inputs: key:string.
// Returns value if key exists, else undefined.
function sessionstorage_get(key) {
    var json = sessionStorage.getItem(key);
    if (json === null) {
        return undefined;
    }
    try {
        return JSON.parse(json);
    } catch (e) {
        log("Couldn't parse json for " + key);
        return undefined;
    }
}

// Inputs: key:string.
// Returns value if key exists, else undefined.
function sessionstorage_set(key, value) {
    if (value === undefined) {
        sessionStorage.removeItem(key);
        return;
    }
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (ex) {
        if (ex.name === "QUOTA_EXCEEDED_ERR") {
        }
    }
}


// Date methods
var DateDiff = {

    inDays: function(a) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        var old_date = new Date(a);
        var today = new Date();

        return ((today - old_date) / _MS_PER_DAY) | 0; 

    }

}


// return random number between min and max
function random_between(min,max){
    return  Math.round(Math.random() * (max - min)) + min;
}

// generates random key
function random_key(){
    return Math.random().toString(36).substring(7);
}

// opens new tab with a url
function open_new_tab(new_url){
    chrome.tabs.create({url: new_url});
}

// sends notification
function notify_me(notification_type, notification_text,icon_img=DEFAULT_ICON_IMG_PATH) {

    if (Notification.permission === "granted") {

        // If it's okay let's create a notification
        var notification = new Notification(notification_type, {
          icon: icon_img,
          body: notification_text
        });
    }
     
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {

          // Whatever the user answers, we make sure we store the information
          if(!('permission' in Notification)) {
            Notification.permission = permission;
          }

          // If the user is okay, let's create a notification
          if (permission === "granted") {

                    var notification = new Notification(notification_type, {
                      icon: icon_img,
                      body: notification_text
                    });


          }
        });
    }

  // At last, if the user already denied any notification, and you 
  // want to be respectful there is no need to bother him any more.
}


// JQuery file loader
function load_script(script_url){

    var script = document.createElement('script');
    script.onload = function () {
        //do whatever you want after loading the script here
    };
    script.src = script_url;

    document.head.appendChild(script); 
}



var splitMessageWithReplacementText = function(rawMessageText, messageID) {
    var anchorStartPos = rawMessageText.indexOf('[[');
    var anchorEndPos = rawMessageText.indexOf(']]');

    if (anchorStartPos === -1 || anchorEndPos === -1) {
      log("replacement tag not found", messageID, rawMessageText, anchorStartPos, anchorEndPos);
      return { error: "no brackets found" };
    }
    var returnObj = {};
    returnObj.anchorPrefixText = rawMessageText.substring(0, anchorStartPos);
    returnObj.anchorText = rawMessageText.substring(anchorStartPos + 2, anchorEndPos);
    returnObj.anchorPostfixText = rawMessageText.substring(anchorEndPos + 2);
    return returnObj;
};

//localize page
var localizePage = function (rtl=true) {

    //translate a page into the users language
    $('[i18n]:not(.i18n-replaced, [i18n_replacement_el])').each(function () {
        $(this).text(bg.data_controller.translate($(this).attr('i18n')));
    });

    $('[i18n_value]:not(.i18n-replaced)').each(function () {
        $(this).val(bg.data_controller.translate($(this).attr('i18n_value')));
    });

    $('[i18n_title]:not(.i18n-replaced)').each(function () {
        $(this).attr('title', bg.data_controller.translate($(this).attr('i18n_title')));
    });

    $('[i18n_placeholder]:not(.i18n-replaced)').each(function () {
        $(this).attr('placeholder', bg.data_controller.translate($(this).attr('i18n_placeholder')));
    });

  $("[i18n_replacement_el]:not(.i18n-replaced)").each(function() {
    // Replace a dummy <a/> inside of localized text with a real element.
    // Give the real element the same text as the dummy link.
    var messageID = $(this).attr("i18n");
    if (!messageID || typeof messageID !== "string") {
      $(this).addClass("i18n-replaced");
      return;
    }
    if (!$(this).get(0).firstChild) {
       log("returning, no first child found", $(this).attr("i18n"));
       return;
    }
    if (!$(this).get(0).lastChild) {
       log("returning, no last child found", $(this).attr("i18n"));
       return;
    }
    var replaceElId = '#' + $(this).attr("i18n_replacement_el");
    if ($(replaceElId).length === 0) {
      log("returning, no child element found", $(this).attr("i18n"), replaceElId);
      return;
    }
    var rawMessageText = bg.data_controller.translate(messageID) || "";
    var messageSplit = splitMessageWithReplacementText(rawMessageText, messageID);
    $(this).get(0).firstChild.nodeValue = messageSplit.anchorPrefixText;
    $(this).get(0).lastChild.nodeValue = messageSplit.anchorPostfixText;
    if ($(replaceElId).get(0).tagName === "INPUT") {
      $('#' + $(this).attr("i18n_replacement_el")).prop('value', messageSplit.anchorText);
    } else {
      $('#' + $(this).attr("i18n_replacement_el")).text(messageSplit.anchorText);
    }

    // If localizePage is run again, don't let the [i18n] code above
    // clobber our work
    $(this).addClass("i18n-replaced");
  });

  // Make a right-to-left translation for Arabic.
  var language = bg.data_controller.get_lang();
  if (language === 'ar' ) {
    //$('#main_nav').removeClass('right').addClass('left');
    //$('.adblock-logo').removeClass('left').addClass('right');
    //$('.closelegend').css('float', 'left');
    if(rtl){
        document.documentElement.dir = 'rtl';
    }else{
        $(".rtl-element").attr("dir","rtl");

    }
    $(".channels-list").css("text-align","right");
    $(".taskinator .delete").css({"left":"4rem", "right":"initial"});






  }

};  // end of localizePage

//Convert to Indian Digits if Arabic
String.prototype.toIndiaDigits= function(){
    if(bg.data_controller.get_lang() == "ar"){
        var id= ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        return this.replace(/[0-9]/g, function(w){
            return id[+w]
        });
    }else{
        return this;
    }
}
