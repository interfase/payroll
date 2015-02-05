$(document).ready(function() {


    // Métodos para menejo de Cookie
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }
    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    // Click sobre elemento padre del menu
    $('div.toggle').click(function (e) {
        e.preventDefault();
        $(this).find('i').toggleClass('fa-chevron-right fa-chevron-down');

        toggle = $(this).attr('data-toggle')
        if (getCookie(toggle) == 1) {
            setCookie(toggle, 0);
        } else {
            setCookie(toggle, 1);
        }
    });

    $('[id^=detail-]').hide();

    $('.toggle').click(function () {
        $input = $(this);
        $target = $('#' + $input.attr('data-toggle'));
        $target.slideToggle();
    });

    // Se comprueba que elementos del menú estaban abiertos
    $('.list-group-item').each(function (index) {
        id = $(this).attr('id');
        if (getCookie(id) == 1) {
            $(this).css('display', 'block');
            $('#dropdown-' + id).find('i').toggleClass('fa-chevron-right fa-chevron-down');
        }
    });

    // Para manejar el ancho del contenido    
    $.contenWidth = function () {
        if ($(window).width() >= 768) {
            $('.tdContentPlaceHolder').width($(window).width() - 280);
        } else {
            $('.tdContentPlaceHolder').width($(window).width());
        }
    }

    //para manejar el alto del contenido
    $.contenHeight = function () {
        $('.ContentContainer').height($(window).height() - 63);
    }

    $.contenWidth();
    $.contenHeight();
    $(window).resize(function () {
        $.contenWidth();
        $.contenHeight();
    });
    var bandera = false;
    $('.mainMenu a').each(function (index) {
        baseUrl = window.location.pathname.split('/');
        obj = baseUrl[baseUrl.length - 1];

        search = window.location.search;
        if (search != "") {
            obj = obj + search;
        }
        strhref=$(this).attr('href');

        if (strhref.indexOf(obj) >= 0) {
            //Se garantiza que se posicione en el lugar donde seleccione
            $('#sidebar-wrapper').animate({scrollTop: $(this).position().top}, 'slow');
            $(this).addClass('activo');
            /**/
            $.cookie('ultimoactivo', $(this).attr('href'));
            bandera = true;
        } else {
            $(this).removeClass('activo');
        }
    });
    if (!bandera) {
        var ultimo = $.cookie('ultimoactivo');
        $(".mainMenu li").find('a').each(function () {
            var href2 = $(this).attr('href');
            if (href2 == ultimo) {
                $(this).addClass('activo');
            }
        });
    }

    // Cambio de Container por ContainerFluid
    $('div.Container').attr('class', 'container-fluid FormContainer');

    //Scroll en los Grids Largos
    $('#GRIDLARGEID').children('div').addClass('GridLarge');

    //Para ocultar los nodos padres sin hijos

    $('div.toggle').each(function () { 	//Se recorre por primera vez para eliminar padres sin hijos	
        if ($(this).next().children().size() == 0) {
            $(this).next().remove();
            $(this).remove();
        }
    });
    $('div.toggle').each(function () { 	//Se recorre para eliminar los padres nodos raiz
        //sin hijos luego de haber pasado la primera vuelta
        if ($(this).next().children().size() == 0) {
            $(this).next().remove();
            $(this).remove();
        }
    });
	
	//Para que se muestre bien el sidebar menu
	$(window).resize(function(){
		var height=$('body').height()-$("#sidebar-wrapper").offset().top;
		$("#sidebar-wrapper").height(height);
		$("#sidebar-wrapper .sidebar-container").height(height-56);
	});
	setTimeout(function(){$(window).resize();},500);
	
});
