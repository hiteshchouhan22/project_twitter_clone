"use strict";

$(document).ready(function(){
	var csrf_token = $("input#csrf-token").val();
	$.ajaxSetup({ 
	    data: {
	        hash: ((csrf_token != undefined) ? csrf_token : 0)
	    },
	    cache: false,
	    timeout:(1000 * 360)
	});

	$.fn.reloadPage = function(_time = 0) {
		setTimeout(function(){
			this.location.reload();
		},_time);
	}

	$.fn.replaceClass = function(class1,class2) {  
		$(this).removeClass(class1);
		$(this).addClass(class2);
		return this;
	};

	if ($("div#main-preloader-holder").length) {
		$("div#main-preloader-holder").fadeOut(1500,function(){
			$(this).remove();
		});
	}

	$(document).on('hidden.bs.modal','div[data-onclose="remove"]', function () {  
        $(this).remove();
    });

    $.fn.scroll2inner = function(elem, speed) { 
	    $(this).animate({
	        scrollTop:  ($(this).scrollTop() - $(this).offset().top + $(elem).offset().top - 50)
	    }, speed == undefined ? 1000 : speed); 
	    return this; 
	};

	$.fn.scroll2 = function (speed = 500,top_offset = 50) {
		if (typeof(speed) === 'undefined')
			speed = 500;

		$('html, body').animate({
			scrollTop: ($(this).offset().top - top_offset)
		}, speed);

		return $(this);
	};

	$(document).on('show.bs.modal', 'div.modal', function() {
	    $('body').find('div.modal.show').not($(this)).each(function(index, el) {
	    	$(this).addClass('d-none');
	    });

	    $('body').find('div.modal-backdrop.show').each(function(index, el) {
	    	$(this).addClass('d-none');
	    });
	});

	$(document).on('hide.bs.modal', 'div.modal', function() {
	    $('body').find('div.modal.show.d-none').not($(this)).each(function(index, el) {
	    	$(this).removeClass('d-none');
	    });

	    $('body').find('div.modal-backdrop.show.d-none').each(function(index, el) {
	    	$(this).removeClass('d-none');
	    });
	});

	$(document).on('click', '[data-anchor]', function(event) {
		event.preventDefault();

		var link = $(this).data('anchor');

		SMColibri.spa_load(link);
	});

	$(document).on('click.bs.dropdown.data-api', 'div.vue-dropdown-multiselect', function (e) {
		e.stopPropagation();
	});
});

window.mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function cl_load_media(e = false) {
	if (e) {
		var n = $(e).parents('[data-lozad-media="loading"]');
		n.attr('data-lozad-media', 'loaded');
		n.find('[data-lozad-preloader="icon"]').remove();
	}
}

function cl_redirect(url = "/", blank = false) {

	if (blank == true) {
		window.open(url, '_blank');
	}
	else {
		document.location.href = url;
	}
	
	return;
}

function cl_empty(value = '') {
	if (value === '' || value === null || value === undefined || value == 0) {
        return true
    }
    else {
        return false
    }
}

function cl_uname_valid(uname = null) {
	if (cl_empty(uname)) {
		return false;
	} 

	else {
		return /^[a-zA-Z0-9_]{3,25}$/.test(uname);
	}

	return false;
}

String.prototype.format = function () {
    var a = this;
    for (var k in arguments) {
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a
}

Array.prototype.contains = function(obj) {
	
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }

    return false;
}

Array.prototype.rmItem = function(item) {
	
    for(var i = 0; i < this.length; i++){ 
    	if (this[i] === item) { 
    		this.splice(i, 1); break;
    	}
    }

    return this;
}

Array.prototype.getItem = function(item) {
    return this[item];
}

Array.prototype.hasIndex = function(item) {
    for (var i = 0; i < this.length; i++) {
    	if (item === i) {
    		return true;
    	}
    }

    return false;
}

var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

function log(val = null) {
	console.log(val);
}

function cl_bs_notify(msg = "", time = 1000) {
	if (cl_empty(msg)) {
		return false;
	}

	else {
		$("body").find('div.main-modalnotif-container').each(function(index, el) {
			$(el).remove();
		}).promise().done(function() {
			$("body").append($("<div>",{
				class: "main-modalnotif-container",
				html: $("<span>", {
					text: msg
				})
			}));

			setTimeout(function() {
				$("body").find('div.main-modalnotif-container').each(function(index, el) {
					$(el).removeClass('animated fadeIn').fadeOut(300, function() {
						$(this).remove();
					});
				});
			}, time);
		});
	}
}

function cl_parse_url_parms(text) {

	let values = text.split(/\&/);
	let data   = {};
	let val    = null;

	for (var i = 0; i < values.length; i++) {

		val = values[i].split(':');
		
		data[val[0]] = val[1];
	}

	return data;
}

function cl_randint(min = 0, max = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cl_get_ulang() {
	var lang       = window.navigator.languages ? window.navigator.languages[0] : null;
    var lang       = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
	var short_lang = lang;

	if (short_lang.indexOf('-') !== -1) {
		short_lang = short_lang.split('-')[0];
	}

	else if (short_lang.indexOf('_') !== -1) {
		short_lang = short_lang.split('_')[0];
	}

	return short_lang;
}