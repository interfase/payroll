$(document).ready(function() {      
    //para manejar el alto del contenido
    $.contenHeight = function() {
        $('.ContentContainer').height($(window).height() - 63);           
    }    
    $.contenHeight();
    $(window).resize(function() {
        $.contenHeight();
    }); 
});