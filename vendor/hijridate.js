function gmod(n,m){
    return ((n%m)+m)%m;
}

function kuwaiticalendar(adjust){
    var today = new Date();
    var wd = today.getDay() + 1;


    if(adjust) {
        var adjustmili = 86400000*adjust;
        var todaymili = today.getTime()+adjustmili;
        today = new Date(todaymili);
    }
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var m = month+1;
    var y = year;
    if(m<3) {
        y -= 1;
        m += 12;
    }

    var a = Math.floor(y/100.);
    var b = 2-a+Math.floor(a/4.);
    if(y<1583) b = 0;
    if(y==1582) {
        if(m>10)  b = -10;
        if(m==10) {
            b = 0;
            if(day>4) b = -10;
        }
    }

    var jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;
    var jd_for_wd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+(new Date()).getDate()+b-1524;

    b = 0;
    if(jd>2299160){
        a = Math.floor((jd-1867216.25)/36524.25);
        b = 1+a-Math.floor(a/4.);
    }
    var bb = jd+b+1524;
    var cc = Math.floor((bb-122.1)/365.25);
    var dd = Math.floor(365.25*cc);
    var ee = Math.floor((bb-dd)/30.6001);
    day =(bb-dd)-Math.floor(30.6001*ee);
    month = ee-1;
    if(ee>13) {
        cc += 1;
        month = ee-13;
    }
    year = cc-4716;

    var iyear = 10631./30.;
    var epochastro = 1948084;
    var epochcivil = 1948085;

    var shift1 = 8.01/60.;

    var z = jd-epochastro;
    var cyc = Math.floor(z/10631.);
    z = z-10631*cyc;
    var j = Math.floor((z-shift1)/iyear);
    var iy = 30*cyc+j;
    z = z-Math.floor(j*iyear+shift1);
    var im = Math.floor((z+28.5001)/29.5);
    if(im==13) im = 12;
    var id = z-Math.floor(29.5001*im-29);

    var myRes = new Array(8);

    myRes[0] = day; //calculated day (CE)
    myRes[1] = month-1; //calculated month (CE)
    myRes[2] = year; //calculated year (CE)
    myRes[3] = jd-1; //julian day number
    myRes[4] = wd-1; //weekday number
    myRes[5] = id; //islamic date
    myRes[6] = im-1; //islamic month
    myRes[7] = iy; //islamic year

    return myRes;
}

function writeIslamicDate(adjustment=0, lang,wdNames,iMonthNames,ending) {

    var progress_bar;
    var result;

    var iDate = kuwaiticalendar(adjustment);
    var outputIslamicDate = wdNames[iDate[4]] + "  "
        + iDate[5] + " " + iMonthNames[iDate[6]] + " " + iDate[7] + " " + ending;
    /* progress bar */
    var month_name = iMonthNames[iDate[6]];
    var month_percentage = (iDate[5]*100)/30;
    var day_number = iDate[5];
    
    progress_bar = '<p style="width:'  + month_percentage + '%" data-value="' + day_number.toString().toIndiaDigits() +'"> ... </p><progress max="30" value="' + day_number +'" class="python"><div class="progress-bar"><span >' + day_number.toString().toIndiaDigits()+'</span></div></progress>';
    result = outputIslamicDate.toIndiaDigits();

    $('.month-progress').html(progress_bar);


    return result;
}

/***/



function setDate() {
    adjday = bg.data_controller.get_hijri_adj();
    lang  = bg.data_controller.get_lang();
    week_days = bg.data_controller.languages[lang].week_days;
    hijri_months = bg.data_controller.languages[lang].hijri_months;
    hijri_ending_suffix = bg.data_controller.languages[lang].hijri_ending_suffix;
    $('.today-date').html(writeIslamicDate(adjday,lang,week_days,hijri_months,hijri_ending_suffix));
}