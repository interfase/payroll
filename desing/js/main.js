(function ($) {
    window.ScrollTo = function () {
        var div = $('#vLOGMENSAJES');
        div.scrollTop(div.scrollTop() + div.innerHeight());
    }

    var footer = null,
        gxPlaceHolder = null,
        tdPlaceHolder = null;


    var menu = {
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
            this.screenState = $(window).width() >= 767 ? 'large' : 'small';

            $('.navbar-left').prepend($('.toggle-btn').remove().clone());
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
                    search = window.location.search,
                    obj1=obj;

                if (search != "") {
                    obj1 += search;
                }

                //buscar el elemento activo del menu
                this.activeItem = $('.nav-side-menu a[href="' + obj1 + '"]');
                
                if(this.activeItem.size() == 0)
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
            var width = $(window).width() - (m.mainMenu ? m.mainMenu.width() : 0) + 1 + 'px';
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

        if ($(window).width() <= 767) {
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
        if ($alt.size()) {
            var header = $('.inicio-cell_header'),
                img = $('img.img-module'),
                w = header.outerWidth(),
                t = w * 0.13;

            var h = t,
                windowW = $(window).width();
            console.log(windowW);
            if (windowW < 480)
                h *= 0.6;
            else if (windowW < 768)
                h *= 0.4
            else if (windowW < 992)
                h *= 0.6
            else
                h *= 0.3

            img.width(h);
            img.height('auto');

            if ($(window).width() < 992 && img.height() > 60) {
                img.width('auto');
                img.height(60);
            }

            var h = $alt.innerHeight();
            $('img.img-module').parent().height(h);

            $('img.img-module').css('top', function () {
                var height = parseInt($(window).width()) > 992 ? h : 100;
                return parseInt(height / 2) - parseInt($('img.img-module').height() / 2);
            });


            img.offset({
                left: header.offset().left + w - (t / 2 + img.width() / 2) + t * 0.14 - 10
            })
        }
    };
    var initAll = function () {
        //Cambiar el footer de posicion
        console.log('place footer');
        var f = $('.MainContainer footer')
        if (f.size()) {
            var ft = f.clone();
            f.parents('.row').first().remove();
            $('.tdContentPlaceHolder').append(ft);
        }

        footer = footer || $('.tdContentPlaceHolder footer');
        tdPlaceHolder = tdPlaceHolder || $('.tdContentPlaceHolder')
        gxPlaceHolder = gxPlaceHolder || $('.tdContentPlaceHolder .gx-content-placeholder');

        setTimeout(function () {
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
                .on('hide.bs.collapse', function (e) {
                    if (e.target.id == "menu-content") {
                        jQuery('#navbar-main.in').collapse('hide');
                    }
                })
                .on('show.bs.collapse', function (e) {
                    if (e.target.id == "menu-content") {
                        jQuery('#navbar-main.in').collapse('hide');

                        menu.sideMenu.addClass("fh");
                        menu.menuList.removeClass("fh");

                        $(".mainMenu").addClass("fh");
                    }
                })
                .on('shown.bs.collapse', function (e) {
                    if (e.target.id == "menu-content") {
                        menu.sideMenu.css("background-color", "#416392");
                        $("#menu-content").css('height', "100%");

                        menu.scrollToActive();
                        menu.updateScroll();
                    }
                });

            jQuery(".sub-menu").on('shown.bs.collapse hidden.bs.collapse', function (ev) {
                menu.updateScroll();
            });

            //Ajustar los tooltips
        }, 20);

        setTimeout(setTooltips, 500);
    }

    //testear la compatibilidad del browser con payroll
    var checkBrowserSupport = function () {
        //testear con modernizr primero
        var supported = true;
        for (var feature in MyModernizr) {
            if (typeof MyModernizr[feature] === "boolean" && MyModernizr[feature] == false) {
                supported = false;
                break;
            }
        }

        //mostrar mensaje de error en caso de palo
        if (!supported && !$.getCookie('browserSupportClosed')) {
            $('body').prepend(
                '<div id="browserAlert" class="alert alert-dismissible" role="alert">' +
                    '<div class="close fa fa-times" data-dismiss="alert" aria-label="Cerrar"></div>' +
                    '<div class="browserAlert-text"><span class="fa fa-exclamation-circle"></span>' +
                    'Esta usando un navegador no compatible o es posible que su ' +
                    'navegador esté en el modo de Vista de compatibilidad. Algunas opciones no funcionarán correctamente ' +
                    'o puede que se vea afectada la apariencia del sistema</div></div>');

            jQuery('#browserAlert').on('closed.bs.alert', function () {
                $.setCookie('browserSupportClosed', true);
                console.log('browserSupportClosed');
            });
        }
    }

    $(document).ready(function () {
        //patch para un doble ready de genexus con los prompts, 
        //no idea por que hace esto el monstruo del icono rojo
        console.log(window.alreadyLoaded ? "Already loaded" : "Not loaded yet");
        if (!window.alreadyLoaded) {
            window.alreadyLoaded = true;

            checkBrowserSupport();

            //para cuando de un error mover la vista al error viewer
            gx.fn.originalSetEV = gx.fn.setErrorViewer;
            gx.fn.setErrorViewer = function (b) {
                gx.fn.originalSetEV(b);
                if (b['MAIN'] && b['MAIN'].length) {
                    var scrollEv = false,
                        minTop = 1e10000;
                    for (var i = 0; i < b['MAIN'].length; i++) {
                        var att=null;
                        if (b['MAIN'][i].type && b['MAIN'][i].att && (att=$('#' + b['MAIN'][i].att)).size()) {
                            var top = att.offset().top;
                            minTop = Math.min(minTop, top);
                        }
                        else {
                            scrollEv = true;
                            break;
                        }
                    }
                    if (scrollEv) {
                        var ev = $('#gxErrorViewer');
                        if (ev.size()) {
                            $('.tdContentPlaceHolder').scrollTop(ev.position().top);
                        }
                    }
                    else {
                        $('.tdContentPlaceHolder').scrollTop($('.gx-content-placeholder').offset().top-minTop);
                    }
                }
            };

            // Cambio de Container por ContainerFluid
            $('div.Container').attr('class', 'container-fluid FormContainer');

            //Scroll en los Grids Largos
            $('#GRIDLARGEID').children('div').addClass('GridLarge');

            //Eliminar el borde y fondo al table principal
            $('#GridContainerDiv,#Grid1ContainerDiv,#Grid2ContainerDiv, [id$="level1itemContainerDiv"], [id$="level2itemContainerDiv"]').each(function () {
                var $this = $(this),
                    tp = $this.parents('.TablePrincipal'),
                    count = 0;
                tp.find('.row:not(:has(.Grid))').each(function () {
                    if ($(this).find('.ReadonlyAttribute:not(#span_vEMPID):not(#span_vHLDID)'+
                                      ':not(#span_EMPID):not(#span_EMPID1):not(#span_HLDID):not(#span_HLDID1)'+
                                      ':not(#span_vHLDID1):not(#span_vEMPID1),'+
                                     '.Attribute:not(#EMPID):not(#HLDID):not(#vEMPID):not(#vHLDID):not(#vEMPID1):not(#vHLDID1)'+
                                     ':not(#EMPID1):not(#HLDID1)').size())
                        count++;
                });

                if (count == 0)
                    tp.addClass('transparent');

                if ($('#FILTERSIMPLE,#FILTEREXTRA').size()) {
                    tp.addClass('border-top');
                }
            });


            setTimeout(function () {
                //setear titulo de la pagina para estandarizar todos los objetos
                //Esto es temporal, una vez eliminado el Form.Caption="..." de los
                //WP del sistema quitar esta seccion
                // if (window.objdesc && window.modulo) {
                //     var splited = objdesc.split('|');
                //     if (splited.length == 1) {
                //         splited = objdesc.split(' l ');
                //     }
                //     objdesc = splited[splited.length - 1].trim();
                //     objdesc = objdesc[0].toUpperCase() + objdesc.slice(1);
                //     modulo = modulo.trim();
                //     modulo = modulo[0].toUpperCase() + modulo.slice(1);
                //     if (modulo != objdesc)
                //         document.title = modulo + ' | ' + objdesc;
                // }
            }, 200);


            /*Ajustar los prompts a la tabla que tienen dentro*/
            var setWidthOfPopup = function () {
                var popup = gx.popup.currentPopup;
                if (popup.frameDocument) {
                    var table = $(popup.frameDocument).find('#MAINFORM,.MAINFORM').first();
                    table.css("display", "inline-block");
                    table = table.size() ? table : $(popup.frameDocument).find('body');

                    var width = table.outerWidth() + 30,
                        height = table.outerHeight() + 30,
                        id = '#' + popup.id;

                    gx.popup.interval = setInterval(function () {
                        table = $(popup.frameDocument).find('#MAINFORM');
                        table = table.size() ? table : $(popup.frameDocument).find('body');

                        width = table.outerWidth() + 30;
                        height = table.outerHeight() + 30;
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
                        top: $('body').height() / 2 - height / 2
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

            setTimeout(setPositionImg, 60);
        }
    });
})(jQuery);