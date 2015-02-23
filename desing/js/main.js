
$(document).ready(function() {
                                            
    //patch para un doble ready de genexus con los prompts, 
    //no idea por que hace esto el monstruo del icono rojo
    console.log(window.alreadyLoaded?"Already loaded":"Not loaded yet");
    if(!window.alreadyLoaded){
        window.alreadyLoaded=true;
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
            $(this).find('i') .toggleClass('fa-chevron-right fa-chevron-down');

            toggle = $(this).attr('data-toggle')
            if (getCookie(toggle) == 1) {
                setCookie(toggle, 0);
            } else {
                setCookie(toggle, 1);
            }
            $('#'+toggle).slideToggle();
        });

        $('[id^=detail-]').hide();

        // $('.toggle').click(function () {
        //     $input = $(this);
        //     $target = $('#' + $input.attr('data-toggle'));

        //     $target.slideToggle();
        // });

        // Se comprueba que elementos del menú estaban abiertos
        $('.list-group-item').each(function (index) {
            id = $(this).attr('id');
            if (getCookie(id) == 1) {
                $(this).css('display', 'block');
                $('#dropdown-' + id).find('i').toggleClass('fa-chevron-right fa-chevron-down');
            }
        });

        //Para manejar el ancho del contenido    
        $.contenWidth = function () {
            if ($(window).width() >= 768) {
                $('.tdContentPlaceHolder').width($(window).width() - $('#sidebar-wrapper').width()-10);
            } else {
                $('.tdContentPlaceHolder').width($(window).width());
            }
        }

        //para manejar el alto del contenido
        $.contenHeight = function () {
            $('.ContentContainer .tdContentPlaceHolder').height($(window).height() - 63);
        }

        $.contenWidth();
        $.contenHeight();
        $(window).resize(function () {
            $.contenWidth();
            $.contenHeight();
        });
        
            var bandera = false;
            var baseUrl = window.location.pathname.split('/'),
                obj = baseUrl[baseUrl.length - 1],
                search = window.location.search;
            if (search != "") {
                obj = obj + search;
            }
        $('.mainMenu a').each(function (index) {
            if ($(this).attr('href')== obj) {
                //Se garantiza que se posicione en el lugar donde seleccione
                $('.sidebar-container').animate({scrollTop: $(this).position().top-50}, 'slow');
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

        $('div.toggle').each(function () {  //Se recorre por primera vez para eliminar padres sin hijos 
            if ($(this).next().children().size() == 0) {
                $(this).next().remove();
                $(this).remove();
            }
        });
        $('div.toggle').each(function () {  //Se recorre para eliminar los padres nodos raiz
            //sin hijos luego de haber pasado la primera vuelta
            if ($(this).next().children().size() == 0) {
                $(this).next().remove();
                $(this).remove();
            }
        });
        
        //Para que se muestre bien el sidebar menu
        $(window).resize(function(){
            var h1=$('body').height()-$("#sidebar-wrapper").offset().top;
            $("#sidebar-wrapper").height(h1);
            $("#sidebar-wrapper .sidebar-container").height(h1-56);
        });
        
        

        setTimeout(function(){
            
            //setear titulo de la pagina para estandarizar todos los objetos
            //Esto es temporal, una vez eliminado el Form.Caption="..." de los
            //WP del sistema quitar esta seccion
            if(objdesc && modulo){
                var splited=objdesc.split('|');
                objdesc=splited[splited.length-1].trim();
                objdesc=objdesc[0].toUpperCase()+objdesc.slice(1);
                modulo=modulo.trim();
                modulo=modulo[0].toUpperCase()+modulo.slice(1);
                document.title=modulo+' | '+objdesc;
            }


            $(window).resize();

            $('.nivel2').each(function(){
                var $this=$(this),
                    text=$this.text(),
                    i=$this.find('i');
                $this.empty();
                $this.append($("<span>"+text+"</span>"));
                $this.append(i);
                if(jQuery.fn.tooltip){
                    jQuery(this).tooltip(
                    {
                        title: $(this).text(),
                        placement: 'right',
                        container: 'body'
                    });
                }
            });

            if(jQuery.fn.tooltip){
                $(".sidebar-nav li a").each(function(){
                    jQuery(this).tooltip(
                    {
                        title: $(this).text(),
                        placement: 'right',
                        container: 'body'
                    });
                });
            }
        },200);


        /*Ajustar los prompts a la tabla que tienen dentro*/
        var setWidthOfPopup=function(){
            var popup=gx.popup.currentPopup;
            if(popup.frameDocument){
                var table=$(popup.frameDocument).find('#MAINFORM');
                table=table.size()?table:$(popup.frameDocument).find('body');

                var width=table.outerWidth()+30,
                    height=table.outerHeight()+60,
                    id='#'+popup.id;

                $(id+"_b").append("<style>.fw1{width:" + (width+10) + "px!important;}"
                                  +".fw2{width:" + width + "px!important;}"
                                  +".fh1{height:"+height+"px!important;}"
                                  +".fh2{height:"+(height+25)+"px!important;}</style>");
                
                $(id + "_b").addClass("fw1").addClass("fh2");
                $(id + "_t").addClass("fw2");
                $(id + "_b").css({
                                  left:$('body').width()/2 - width/2 - 9,
                                  top: $('body').height()/2 - height/2 -28
                                });
                            
                $(id + "_c").addClass("fh1");
                $(id+"_rs").css("display", "none");
            }
            else{
                setTimeout(setWidthOfPopup, 100);
            }
        }

        gx.popup.origOpenPrompt=gx.popup.ext.show;

        gx.popup.ext.show=function(c){
            console.log("openPrompt");
            gx.popup.origOpenPrompt(c);
            setWidthOfPopup();
        };
    }
});


function ScrollTo() {
   var div = $('#vLOGMENSAJES');
   div.scrollTop(div.scrollTop() + div.innerHeight());
}
