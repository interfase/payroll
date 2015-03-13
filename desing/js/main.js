function ScrollTo() {
    var div = $('#vLOGMENSAJES');
    div.scrollTop(div.scrollTop() + div.innerHeight());
}

/*-------------------------------------------------------------
 --        ****             MENU           ****               --
 -------------------------------------------------------------*/

(function(){
    var footer=null,      
        gxPlaceHolder=null,
        tdPlaceHolder=null;

    var menu={
        mainMenu: null,
        sideMenu: null,
        menuList: null,
        brandHeight: null,
        toggleButton: null,
        screenState: null,
        activeItem: null,
        init: function () {
            this.mainMenu = $(".mainMenu");
            this.sideMenu = $(".nav-side-menu");
            this.menuList = this.sideMenu.find(".menu-list");
            this.brandHeight = this.sideMenu.find(".brand").height();
            this.toggleButton = this.sideMenu.find('.toggle-btn');

            if (this.sideMenu.size() == 0)
                this.sideMenu = null;

            this.levels = 0;

            this.deleteEmptyParents();

            menu.checkState();

            this.initScroll();
            this.screenState = $(window).width()>=767?'large':'small';
        },
        updateScroll: function () {
            if (this.menuList && this.menuList.size())
                Ps.update(this.menuList[0]);
        },
        initScroll: function () {
            if (this.menuList && this.menuList.size())
                Ps.initialize(this.menuList[0]);
        },
        findActive: function () {
            if (this.sideMenu) {
                var baseUrl = window.location.pathname.split('/'),
                        obj = baseUrl[baseUrl.length - 1],
                        search = window.location.search;

                if (search != "") {
                    obj += search;
                }

                //buscar el elemento activo del menu
                this.activeItem = $('.nav-side-menu a[href="' + obj + '"]');

                if (this.activeItem.size() == 0) { //si el elemnto de la url no se encuentra 
                    //en el menu se busca el ultimo activo
                    var ultimo = $.getCookie('ultimoactivo');
                    if (ultimo) {
                        this.activeItem = $('.nav-side-menu a[href="' + ultimo + '"]');
                    }
                }
                else {
                    $.setCookie('ultimoactivo', obj); //se setea la cookie del ultimo activo
                }

                if (this.activeItem.size() && !this.activeItem.parent().hasClass('brand')) {
                    this.activeItem.parent().addClass('active');
                    this.activeItem.parent().parents('ul').each(function () {
                        $(this).prev('.parent').addClass('active');
                    })
                }
            }
        },
        scrollToActive: function () {
            if (this.sideMenu && this.activeItem && this.activeItem.size()) {
                this.activeItem.parents('.sub-menu').each(function () {
                    var $this = $(this);
                    $this.addClass("in").prev().removeClass("collapsed");
                });

                this.menuList.scrollTop(this.activeItem.parent().position().top - 100);
                this.updateScroll();
            }
        },
        resize: function () {
            if (this.sideMenu) {
                var h1 = $('body').height() - (this.sideMenu ? this.sideMenu.offset().top - 2 : 0),
                        h2 = $('.tdContentPlaceHolder footer').height();

                this.sideMenu.css('height', h1 + 'px');
                this.menuList.css('height',
                        h1 - this.brandHeight + 'px'
                        );

                this.updateScroll();
            }
        },
        toggle: function () {
            this.mainMenu.toggleClass('collapsed');
            $('.ContentContainer').toggleClass('menuCollapsed');
            contentWidth(this);

            $.setCookie('menuCollapsed', this.mainMenu.hasClass('collapsed'));
            this.updateScroll();
        },
        checkState: function () {
            if ($.getCookie('menuCollapsed') === 'true'
                    && this.sideMenu && this.sideMenu.size()) {
                this.mainMenu.addClass('collapsed');
                $('.ContentContainer').addClass('menuCollapsed');
            }

            if (this.mainMenu && this.mainMenu.find('.menu-error').size()) {
                this.mainMenu.addClass('empty');
            }
        },
        deleteEmptyParents: function () {
            if (this.levels < 3) {
                this.menuList
                        .find('#menu-content ul')
                        .each(function () {
                            if ($(this).children().size() == 0) {
                                $(this).prev().remove();
                                $(this).remove();
                            }
                        });
                this.levels++;
                this.deleteEmptyParents();
            }
        }
    };

    // Métodos para menejo de Cookie
    $.setCookie = function (key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    };

    $.getCookie = function (key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    };

    //Para manejar el ancho del contenido    
    var contentWidth = function (m) {
        if ($(window).width() > 767) { //pantalla grande
            if (m.screenState == 'small') { //si estaba en pantalla xs
                m.screenState = 'large';

                if (m.sideMenu) { //si esta activo el menu lateral
                    m.toggleButton.addClass('collapsed');
                    $("#menu-content").addClass('in');
                    m.sideMenu.removeClass("fh");
                    m.menuList.removeClass("fh");
                    $(".mainMenu").removeClass("fh");
                }

                m.scrollToActive();//Scrollear al elemento activo del menu
            }

            //El width se lo doy por css porque en IE no esta pinchando
            var width = $(window).width() - (m.mainMenu ? m.mainMenu.width() : 0) + 'px';
            $('.tdContentPlaceHolder')
                    .css({"min-width": width, 'width': width})
                    .show();
        } else { //pantalla xs
            if (m.screenState == 'large') { //si estaba en pantalla grande
                m.screenState = 'small';

                if (m.sideMenu) {
                    menu.menuList.addClass("fh");
                    m.toggleButton.removeClass('collapsed');
                    $("#menu-content").removeClass('in');
                    $("#menu-content").css("height", "0");
                }
            }
            //El width se lo doy por css porque en IE no esta pinchando
            $('.tdContentPlaceHolder').css({width: '100%', 'min-width': 0});
        }
        placeFooter();
    };

    //para manejar el alto del contenido
    var contentHeight = function (m) {
        var extraH = /*$('.MainContainer.homePage footer .navbar').height()*/0 + 65;

        if ($(window).width() <= 767){
            tdPlaceHolder.css("height", ($(window).height() - extraH 
                - $('.mainMenu .brand').height()) + 'px');
        }
        else {
            tdPlaceHolder.css("height", ($(window).height() - extraH) + 'px');
        }
    };

    //settear la position del footer en dependencia del contenido
    var placeFooter = function () {
        //cambiar el position del footer en dependencia del alto del contenido
        if (footer.height() + gxPlaceHolder.outerHeight() + 40 < tdPlaceHolder.height()) {
            footer.css({position: 'absolute', width: '100%'});
        }
        else {
            footer.css({position: 'relative', width: 'auto'});
        }
    }

    var setTooltips = function () {
        if (jQuery.fn.tooltip) {
            $('.nav-side-menu li')
                    .each(function () {
                        var text = null,
                                $this = jQuery(this);

                        if ($this.hasClass('parent')) {
                            text = $this.text();
                        }
                        else {
                            text = $this.find("a").first().text();
                        }

                        $this.tooltip({
                            title: text,
                            placement: 'right',
                            container: 'body',
                            trigger: 'manual'
                        });
                    })
                    .mouseenter(function () {
                        var a = null,
                                $this = jQuery(this);

                        if ($this.hasClass('parent')) {
                            a = $this[0];
                        }
                        else {
                            a = $this.find("a").first()[0];
                        }

                        if (a.offsetWidth < a.scrollWidth) {
                            $this.tooltip('show');
                        }
                    })
                    .mouseleave(function () {
                        jQuery(this).tooltip('hide');
                    });
        }
    }

    //Posición icono de las páginas inicio de los módulos
    var setPositionImg = function () {
        $alt = $('.inicio-header').parent();
        if ($alt) {
            var h = $alt.innerHeight();
            $('img.img-module').parent().height(h);

            $('img.img-module').css('top', function () {
                var height = parseInt($(window).width()) > 992 ? h : 100;
                return parseInt(height / 2) - parseInt($('img.img-module').height() / 2);
            });

            $('img.img-module').css('left', function () {
                var diff = $(window).width() > 992 ? 10 : 0;
                var w = $('img.img-module').parent().innerWidth();
                return parseInt(w / 2) - parseInt($('img.img-module').width() / 2) - diff;
            });
        }
    };

    var initAll = function () {
        //Cambiar el footer de posicion
        console.log('place footer');
        var f=$('.MainContainer footer')
        if(f.size()){
            var ft=f.clone();
            f.parents('.row').first().remove();
            $('.tdContentPlaceHolder').append(ft);
        }

        footer = footer || $('.tdContentPlaceHolder footer');
        tdPlaceHolder = tdPlaceHolder || $('.tdContentPlaceHolder')
        gxPlaceHolder = gxPlaceHolder || $(".tdContentPlaceHolder .gx-content-placeholder");

        setTimeout(function(){
            //Dejar .mainMenu unico
            $(".mainMenu").not($(".mainMenu").first()).remove()

            menu.init();

            contentWidth(menu);
            contentHeight(menu);

            menu.resize();
            setTimeout(function () { //Algunas veces el menu se queda colgado
                menu.resize();
            }, 100);


            placeFooter();
            setInterval(function () {
                placeFooter();
            }, 100);


            menu.findActive();
            menu.scrollToActive();

            setPositionImg();

            /* -----  Event Handlers */
            $(window).resize(function () {
                contentWidth(menu);
                contentHeight(menu);
                menu.resize();
                placeFooter();
                setPositionImg();
            });

            $('.brand i').click(function () {
                menu.toggle();
            });

            jQuery("#menu-content")
                    .on('hidden.bs.collapse', function (e) {
                        if (e.target.id == "menu-content") {
                            menu.sideMenu.removeClass("fh");
                            menu.menuList.addClass("fh");

                            $(".mainMenu").removeClass("fh");

                            menu.updateScroll();
                        }
                    })
                    .on('show.bs.collapse', function (e) {
                        if (e.target.id == "menu-content") {

                        menu.sideMenu.addClass("fh");
                        menu.menuList.removeClass("fh");

                        $(".mainMenu").addClass("fh");
                    }
                })
                .on('shown.bs.collapse', function(e){
                    if(e.target.id=="menu-content"){
                        menu.sideMenu.css("background-color", "#416392");
                        $("#menu-content").css('height', "100%");

                        menu.scrollToActive();
                        menu.updateScroll();
                    }
                });

            //Ajustar los tooltips
            setTooltips();
        }, 20);
    }


    $(document).ready(function () {
        //patch para un doble ready de genexus con los prompts, 
        //no idea por que hace esto el monstruo del icono rojo
        console.log(window.alreadyLoaded ? "Already loaded" : "Not loaded yet");
        if (!window.alreadyLoaded) {
            window.alreadyLoaded = true;

            // Cambio de Container por ContainerFluid
            $('div.Container').attr('class', 'container-fluid FormContainer');

            //Scroll en los Grids Largos
            $('#GRIDLARGEID').children('div').addClass('GridLarge');


            setTimeout(function () {
                //setear titulo de la pagina para estandarizar todos los objetos
                //Esto es temporal, una vez eliminado el Form.Caption="..." de los
                //WP del sistema quitar esta seccion
                if (window.objdesc && window.modulo) {
                    var splited = objdesc.split('|');
                    if (splited.length == 1) {
                        splited = objdesc.split(' l ');
                    }
                    objdesc=splited[splited.length-1].trim();
                    objdesc=objdesc[0].toUpperCase()+objdesc.slice(1);
                    modulo=modulo.trim();
                    modulo=modulo[0].toUpperCase()+modulo.slice(1);
                    if(modulo!=objdesc)
                        document.title=modulo+' | '+objdesc;
                }
            }, 200);


            /*Ajustar los prompts a la tabla que tienen dentro*/
            var setWidthOfPopup = function () {
                var popup = gx.popup.currentPopup;
                if (popup.frameDocument) {
                    // popup.frameWindow.gx.popup.ext.show=gx.popup.ext.show;
                    // popup.frameWindow.gx.popup.ext.close=gx.popup.ext.close;

                    var table = $(popup.frameDocument).find('#MAINFORM');
                    table.css("display", "inline-block");
                    table = table.size() ? table : $(popup.frameDocument).find('body');

                    var width = table.outerWidth() + 30,
                            height = table.outerHeight() + 80,
                            id = '#' + popup.id;

                    gx.popup.interval = setInterval(function () {
                        table = $(popup.frameDocument).find('#MAINFORM');
                        table = table.size() ? table : $(popup.frameDocument).find('body');

                        width = table.outerWidth() + 30;
                        height = table.outerHeight() + 80;
                        if (width != gx.popup.width) {
                            table.css("display", "inline-block");
                            $(id + "_b").append("<style id='s1'>.fw1{width:" + (width + 10) + "px!important;}"
                                    + ".fw2{width:" + width + "px!important;}"
                                    + ".fh1{height:" + height + "px!important;}"
                                    + ".fh2{height:" + (height + 25) + "px!important;}</style>");

                            $(id + "_b").addClass("fw1").addClass("fh2");
                            $(id + "_t").addClass("fw2");

                            console.log("popup width changed!");
                            gx.popup.width = width;
                        }
                    }, 1);



                    $(id + "_b").css({
                        left: $('body').width() / 2 - width / 2 - 9,
                        top: $('body').height() / 2 - height / 2 - 28
                    });

                    $(id + "_c").addClass("fh1");
                    $(id + "_rs").css("display", "none");
                }
                else {
                    setTimeout(setWidthOfPopup, 100);
                }
            }

            gx.popup.origOpenPrompt = gx.popup.ext.show;
            gx.popup.origClosePrompt = gx.popup.ext.close;

            gx.popup.ext.show = function (c) {
                console.log("openPrompt");
                gx.popup.origOpenPrompt(c);
                setWidthOfPopup();
            };

            gx.popup.ext.close = function (c, e) {
                console.log("closePrompt");
                clearInterval(gx.popup.interval);
                gx.popup.width = 0;
                gx.popup.origClosePrompt(c, e);

            }

            initAll();
        }
    });
})();