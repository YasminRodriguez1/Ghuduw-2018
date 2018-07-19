// Set to true to get noisier console.log statements
var VERBOSE_DEBUG = false;


// disable logging by default
logging(false); 


//	API Data
var API_DOMAIN = "http://ghuduw.herokuapp.com";
var DATA_FOR_CACHING = API_DOMAIN + "/cache_all.json?"
var LOG_URL = "/log_user"
var LANG_PARAM = "lang=";
var UPDATE_FREQ = 4;


//  PATH
var LOCALES_PATH = "/data/_locales/"

//	Defaults
var DEFAULT_HIJRI_ADJ = -1;
var THREE_HOURS = 10800000;
var HALF_AN_HOUR = 1800000;
var DEFAULT_ICON_IMG_PATH = "icons/icon-128.png"
