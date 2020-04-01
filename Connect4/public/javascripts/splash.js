var main = function(){
    "use strict";

    var cookiesArray = document.cookie.split('; ');
    var cookies=[];

    for(var i=0; i < cookiesArray.length; i++) {
        var cookie = cookiesArray[i].split("=");
        cookies[cookie[0]]=cookie[1];
    }

    if(cookiesArray.length>0){
        var numvisits = parseInt(cookies["numvisits"])+1;
        document.cookie = "numvisits=" + numvisits + "; expires=Fri, 24-Jan-2025 12:45:00 GMT";
        document.getElementById("visitsinfo").innerHTML = numvisits;        
    }
    else{
        document.cookie = "numvisits=1; expires=Fri, 24-Jan-2025 12:45:00 GMT";
        document.getElementById("visitsinfo").innerHTML = 1;
    }
}
$(document).ready(main);

