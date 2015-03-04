
$(document).ready(function() {
                                            
    //patch para un doble ready de genexus con los prompts, 
    //no idea por que hace esto el monstruo del icono rojo
    console.log(window.alreadyLoaded ? "Already loaded" : "Not loaded yet");
    if(!window.alreadyLoaded){
        window.alreadyLoaded=true;
        
        // Cambio de Container por ContainerFluid
        $('div.Container').attr('class', 'container-fluid FormContainer');

        //Scroll en los Grids Largos
        $('#GRIDLARGEID').children('div').addClass('GridLarge');

       
        setTimeout(function(){
            //setear titulo de la pagina para estandarizar todos los objetos
            //Esto es temporal, una vez eliminado el Form.Caption="..." de los
            //WP del sistema quitar esta seccion
            if(window.objdesc && window.modulo){
                var splited=objdesc.split('|');
                if(splited.length==1){
                    splited=objdesc.split(' l ');
                }
                objdesc=splited[splited.length-1].trim();
                objdesc=objdesc[0].toUpperCase()+objdesc.slice(1);
                modulo=modulo.trim();
                modulo=modulo[0].toUpperCase()+modulo.slice(1);
                document.title=modulo+' | '+objdesc;
            }
        }, 200);


        /*Ajustar los prompts a la tabla que tienen dentro*/
        var setWidthOfPopup=function(){
            var popup=gx.popup.currentPopup;
            if(popup.frameDocument){
                var table=$(popup.frameDocument).find('#MAINFORM');
                table.css("display","inline-block");
                table=table.size()?table:$(popup.frameDocument).find('body');

                var width=table.outerWidth()+30,
                    height=table.outerHeight()+80,
                    id='#'+popup.id;
                
                gx.popup.interval = setInterval(function(){
                    width=table.outerWidth()+30;
                    height=table.outerHeight()+80;
                    if(width!=gx.popup.width){
                        $(id+"_b").append("<style id='s1'>.fw1{width:" + (width+10) + "px!important;}"
                                  +".fw2{width:" + width + "px!important;}"
                                  +".fh1{height:"+height+"px!important;}"
                                  +".fh2{height:"+(height+25)+"px!important;}</style>");
                
                        $(id + "_b").addClass("fw1").addClass("fh2");
                        $(id + "_t").addClass("fw2");

                        console.log("popup width changed!");
                        gx.popup.width=width;
                    }
                },1);

                

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
        gx.popup.origClosePrompt=gx.popup.ext.close;

        gx.popup.ext.show=function(c){
            console.log("openPrompt");
            gx.popup.origOpenPrompt(c);
            setWidthOfPopup();
        };

        gx.popup.ext.close=function(c,e){
            console.log("closePrompt");
            clearInterval(gx.popup.interval);
            gx.popup.width=0;
            gx.popup.origClosePrompt(c,e);

        }
    }
});


function ScrollTo() {
   var div = $('#vLOGMENSAJES');
   div.scrollTop(div.scrollTop() + div.innerHeight());
}

/*-------------------------------------------------------------
--        ****             MENU           ****               --
-------------------------------------------------------------*/

(function(){
    var menu={
        sideMenu: null,
        menuList: null,
        brandHeight: null,
        toggle: null,
        small: false,
        active: null
    };

    // Métodos para menejo de Cookie
    $.setCookie = function(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    };

    $.getCookie = function(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    };

    //inicializa los objetos del menu
    var initMenu = function(m){
        m.sideMenu = $(".nav-side-menu");
        m.menuList = m.sideMenu.find(".menu-list");
        m.brandHeight = m.sideMenu.find(".brand").height();
        m.toggle = m.sideMenu.find('.toggle-btn');
        
        if(m.sideMenu.size()==0)
            m.sideMenu=null;

    };

    //para ajustar el alto del menu a la ventana
    var resizeMenu = function(m){
        if(m.sideMenu){
            var h1 = $('body').height() - (m.sideMenu ? m.sideMenu.offset().top - 2 : 0),
                h2 = $('.tdContentPlaceHolder footer').height();

            m.sideMenu.css('height', h1 + 'px');
            m.menuList.css('height',
                h1 - m.brandHeight - ($(window).width() >= 767? h2:0) + 'px'
            );
        }
    };

    //Para manejar el ancho del contenido    
    var contentWidth = function (m) {
        if ($(window).width() >= 767) { //pantalla grande
            if(m.small){ //si estaba en pantalla xs
                m.small=false;

                if(m.sideMenu){ //si esta activo el menu lateral
                    m.toggle.addClass('collapsed');
                    $("#menu-content").addClass('in');
                    m.sideMenu.removeClass("fh");
                    m.menuList.removeClass("fh");
                    $(".mainMenu").removeClass("fh");
                }

                scrollToActive(m);//Scrollear al elemento activo del menu
            }

            //El width se lo doy por css porque en IE no esta pinchando
            var width=$(window).width() - (m.sideMenu?m.sideMenu.width()-1: 0) + 'px';
            $('.tdContentPlaceHolder')
                .css({"min-width": width, 'width': width })

                .show();

        } else { //pantalla xs
            if(!m.small){ //si estaba en pantalla grande
                
                if($('.nav.navbar-nav a').size()==0){ //si no hay elementos en la navegacion del menu general
                    $('.navbar-toggle').hide();
                }

                m.small=true;
                if(m.sideMenu){
                    menu.menuList.addClass("fh");
                    m.toggle.removeClass('collapsed');
                    $("#menu-content").removeClass('in')
                }
            }

            //El width se lo doy por css porque en IE no esta pinchando
            $('.tdContentPlaceHolder').css({width: '100%','min-width':0});
        }
        // document.title=$('.tdContentPlaceHolder').width();
    };

    var footer=null,
        gxPlaceHolder=null,
        tdPlaceHolder=null;
    //para manejar el alto del contenido
    var contentHeight = function (m) {
        footer = footer || $('.tdContentPlaceHolder footer');
        tdPlaceHolder = tdPlaceHolder || $('.tdContentPlaceHolder')
        gxPlaceHolder = gxPlaceHolder || $(".tdContentPlaceHolder .gx-content-placeholder");

        var extraH=$('.MainContainer.homePage footer .navbar').height() + 61;

        if ($(window).width() <= 767){
            tdPlaceHolder.css("height", ($(window).height() - extraH 
                - $('.mainMenu .brand').height()) + 'px');
        }
        else{
            tdPlaceHolder.css("height", ($(window).height()- extraH) + 'px');
        }
        
        //cambiar el position del footer en dependencia del alto del contenido
        if(footer.height() + gxPlaceHolder.height() < tdPlaceHolder.height()){
            footer.css({position:'absolute'});
        }
        else{
            footer.css({position:'relative'});
        }
    };

    //buscar el elemento activo del menu
    var findActive = function(m){
        if(m.sideMenu){
            var baseUrl = window.location.pathname.split('/'),
                obj     = baseUrl[baseUrl.length - 1],
                search  = window.location.search;

            if (search != ""){
                obj += search;
            }

            //buscar el elemento activo del menu
            m.active=$('.nav-side-menu a[href="'+obj+'"]');

            if(m.active.size()==0){ //si el elemnto de la url no se encuentra 
                                    //en el menu se busca el ultimo activo
                var ultimo = $.getCookie('ultimoactivo');
                if(ultimo){
                    m.active=$('.nav-side-menu a[href="'+ultimo+'"]');
                }
            }
            else{
                $.setCookie('ultimoactivo', obj); //se setea la cookie del ultimo activo
            }

            if(m.active.size() && !m.active.parent().hasClass('brand')){
                m.active.parent().addClass('active');
                m.active.parent().parents('ul').each(function(){
                    $(this).prev('.parent').addClass('active');
                })
            }
        }
    };

    //busca el elemento activo del menu y scrollea para que se muestre este
    var scrollToActive = function(m){
        if(m.sideMenu && m.active && m.active.size()){

            m.active.parents('.sub-menu').each(function(){
                var $this=$(this);
                $this.addClass("in")
                     .prev().removeClass("collapsed");
            });
            m.menuList.scrollTop(m.active.parent().position().top-100)
        }
    };

    var setTooltips = function(){
        if(jQuery.fn.tooltip){
            $('.nav-side-menu li')
                .each(function(){
                    var text = null,
                        $this = jQuery(this);

                    if($this.hasClass('parent')){
                        text = $this.text();
                    }
                    else{
                        text = $this.find("a").first().text();
                    }

                    $this.tooltip({
                        title: text,
                        placement: 'right',
                        container: 'body',
                        trigger: 'manual'
                    });
                })                
                .mouseenter(function(){
                    var a=null,
                        $this = jQuery(this);

                    if($this.hasClass('parent')){
                        a = $this[0];
                    }
                    else{
                        a = $this.find("a").first()[0];
                    }

                    if(a.offsetWidth < a.scrollWidth){
                        $this.tooltip('show');
                    }
                })
                .mouseleave(function(){
                    jQuery(this).tooltip('hide');
                });
        }
    }

    var elminiarRaicesVacias=function(){
        $('#menu-content ul').each(function () {  //Se recorre por primera vez para eliminar padres sin hijos 
            if($(this).children().size() == 0){
                $(this).prev().remove();
                $(this).remove();
            }
        });

        $('#menu-content ul').each(function () {  //Se recorre por primera vez para eliminar padres sin hijos 
            if($(this).children().size() == 0){
                $(this).prev().remove();
                $(this).remove();
            }
        });

        $('#menu-content ul').each(function () {  //Se recorre por primera vez para eliminar padres sin hijos 
            if($(this).children().size() == 0){
                $(this).prev().remove();
                $(this).remove();
            }
        });
    }

    $(function(){

        //Cambiar el footer de posicion
        var f=$('.MainContainer:not(.homePage) footer')
        if(f.size()){
            var footer=f.clone();
            f.remove();
            $('.tdContentPlaceHolder').append(footer);
        }

        

        setTimeout(function(){
            //Para ocultar los nodos padres sin hijos
            elminiarRaicesVacias();

            initMenu(menu);

            contentWidth(menu);
            setInterval(function(){
                contentHeight(menu);
            },100);
            resizeMenu(menu);

            findActive(menu);
            scrollToActive(menu);

            $(window).resize(function(){
                contentWidth(menu);
                contentHeight(menu);
                resizeMenu(menu);
            });

            //Cuando se hace click en el boton de tres lineas del menu
            menu.toggle.click(function(){
                if($("#menu-content").hasClass("in")){
                    
                }else{
                    
                    
                }
            });
            
            jQuery("#menu-content")
                .on('hidden.bs.collapse', function (e) {
                    if(e.target.id=="menu-content"){
                        menu.sideMenu.removeClass("fh");
                        menu.menuList.addClass("fh");

                        $(".mainMenu").removeClass("fh");

                        // $('.tdContentPlaceHolder').show();
                    }
                })
                .on('shown.bs.collapse', function (e) {
                    if(e.target.id=="menu-content"){
                        // $('.tdContentPlaceHolder').hide();

                        menu.sideMenu.addClass("fh");
                        menu.menuList.removeClass("fh");

                        $(".mainMenu").addClass("fh");

                        scrollToActive(menu);
                    }
                });
            
            //Ajustar los tooltips
            setTooltips();
        }, 
        100);
    });
})();