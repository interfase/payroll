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
    $('div.toggle').click(function(e) {
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

    $('.toggle').click(function() {
        $input = $(this);
        $target = $('#' + $input.attr('data-toggle'));
        $target.slideToggle();
    });

    // Se comprueba que elementos del menú estaban abiertos
    $('.list-group-item').each(function(index) {
        id = $(this).attr('id');
        if (getCookie(id) == 1) {
            $(this).css('display', 'block');
            $('#dropdown-' + id).find('i').toggleClass('fa-chevron-right fa-chevron-down');
        }
    });
    
    // Para manejar el ancho del contenido    
    $.contenWidth = function() {
        if ($(window).width() >= 768) {
            $('.tdContentPlaceHolder').width($(window).width() - 280);
        } else {
            $('.tdContentPlaceHolder').width($(window).width());
        }
    }      
    
    //para manejar el alto del contenido
    $.contenHeight = function() {
        $('.ContentContainer').height($(window).height() - 63);           
    }
    
    $.contenWidth();
    $.contenHeight();
    $(window).resize(function() {
        $.contenWidth();
        $.contenHeight();
    });  
        
    $('.mainMenu a').each(function(index){
        baseUrl = window.location.pathname.split('/'); 
        obj = baseUrl[baseUrl.length-1]; 
		
		search = window.location.search;
		if (search != ""){
		  obj = obj+search;
		}		
		
        if ($(this).attr('href') == obj){
       		 //Se garantiza que se posicione en el lugar donde selecciones
             $('#sidebar-wrapper').animate({scrollTop:$(this).position().top}, 'slow');
             $(this).addClass('activo');
        }else{
            $(this).removeClass('activo');
        }
    });    
    
    // Cambio de Container por ContainerFluid
    $('div.Container').attr('class','container-fluid FormContainer');    
    
    //Scroll en los Grids Largos
    $('#GRIDLARGEID').children('div').addClass('GridLarge');
	
	//Para ocultar los nodos padres sin hijos

    $('div.toggle').each(function(){ 	//Se recorre por primera vez para eliminar padres sin hijos	
		if ($(this).next().children().size() == 0){
			 $(this).next().remove();
			 $(this).remove();  
		}
    });
	$('div.toggle').each(function(){ 	//Se recorre para eliminar los padres nodos raiz
										//sin hijos luego de haber pasado la primera vuelta
		if ($(this).next().children().size() == 0){
			 $(this).next().remove();
			 $(this).remove();  
		}
    });

});
