/*Funciones utiles*/
function menu1click(obj) {
	var itemSelected = $('#menu1 li.item a.select');
	$('#menu2 ul#'+itemSelected.attr('id')).addClass('hide');
	itemSelected.removeClass('select');
	
	$('#menu1 li.item a#'+obj.id).addClass('select');
	$('#menu2 ul#'+obj.id).removeClass('hide');
}

$(document).ready(function () {
	$(".menu_principal").navgoco({accordion: false});
	$('.dropdown-toggle').dropdown();
});

/*
(function($) {
       var $window = $(window),
           $html = $('#menu-bar');

       $window.resize(function resize(){
           if ($window.width() < 768) {
               return $html.removeClass('nav-stacked');
           }
           $html.addClass('nav-stacked');
       }).trigger('resize');
   })(jQuery);
   */


