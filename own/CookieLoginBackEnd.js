  
/////////////////// CONFIGURACION ////////////////////////////////////  
var separador = "$"     //caracter separador de campos en el texto de la cookie  

 
/////////////////// DATOS QUE SE MOSTRARAN ///////////////////////////  
function MostrarBackEnd(){	
	
    var pieza = null; 
	var nombre = "LoginBackEnd";	
	if(CojerCookieBackEnd(nombre) != null) {  
        nombre = CojerCookieBackEnd(nombre)  
        pieza = nombre.split(separador);	
		inputs = document.getElementsByTagName('input')
		
		if (pieza.length < 3)
		{
			inputs[0].value = '';
			inputs[1].value = '';
			inputs[2].checked = false;
		}
		else
		{
			inputs[0].value = atob(pieza[0]);
			inputs[1].value = atob(pieza[1]);
			inputs[2].checked = true;
		}        	
    }   
}  
/////////////////////////DATOS QUE SE GUARDARAN /////////////////////////////////////  
function JuntarPiezasBackEnd() {   
    var entero = ''	
	inputs = document.getElementsByTagName('input')
	var	remember = inputs[2].checked;	
	if (remember)
	{	
		var user = inputs[0].value; //user
		var	pass = inputs[1].value;	//pass
		entero = btoa(user) + separador + btoa(pass) + separador;    
    }
	else
	{
		entero = separador;  
	}
	IntroducirCookieBackEnd(entero);
	return true;	
}  
  
////////////////////////////////// FIN DE VARIABLES A CAMBIAR /////////////////////////////////  
  
function CojerValorCookieBackEnd(indice) {  
    //indice indica el comienzo del valor  
    var galleta = document.cookie  
    //busca el final del valor, dado por ;, a partir de indice  
    var finDeCadena = galleta.indexOf(";", indice)  
    //si no existe el ;, el final del valor lo marca la longitud total de la cookie  
    if (finDeCadena == -1)  
        finDeCadena = galleta.length  
  
    return unescape(galleta.substring(indice, finDeCadena))  
    }  
  
function CojerCookieBackEnd(nombre) {  
    var galleta = document.cookie  
    //construye la cadena con el nombre del valor  
    var arg = nombre + "="  
        var alen = arg.length           //longitud del nombre del valor  
    var glen = galleta.length       //longitud de la cookie  
  
    var i = 0  
    while (i < glen) {  
        var j = i + alen            //posiciona j al final del nombre del valor  
        if (galleta.substring(i, j) == arg) //si en la cookie estamo ya en nombre del valor       
            return CojerValorCookieBackEnd(j)  //devuleve el valor, que esta a partir de j  
  
        i = galleta.indexOf(" ", i) + 1     //pasa al siguiente  
        if (i == 0)  
            break               //fin de la cookie  
    }  
    return null                 //no se encuentra el nombre del valor  
}  
  
function GuardarCookieBackEnd(nombre, valor, caducidad) {  
    if(!caducidad)  
        caducidad = CaducaBackEnd(0)  
  
    //crea la cookie: incluye el nombre, la caducidad y la ruta donde esta guardada  
    //cada valor esta separado por ; y un espacio  
    document.cookie = nombre + "=" + escape(valor) + "; expires=" + caducidad + "; path=/"  
}  
  
function CaducaBackEnd(dias) {  
    var hoy = new Date()                    //coge la fecha actual  
    var msEnXDias = eval(dias) * 24 * 60 * 60 * 1000    //pasa los dias a mseg.  
  
    hoy.setTime(hoy.getTime() + msEnXDias)          //fecha de caducidad: actual + caducidad  
    return (hoy.toGMTString())  
}  
  
function BorrarCookieBackEnd(nombre) {  
    //para borrar la cookie, se le pone una fecha del pasado mediante Caduca(-1)  
    document.cookie = nombre + "=; expires=" + CaducaBackEnd(-1) + "; path=/"  
}  
  
function IntroducirCookieBackEnd(nombre) {  
    //establece la cookie: la caducidad es de 31 dias  
    var _31dias = CaducaBackEnd(31)                //crea la fecha de caducidad si 31 dias  
    if (nombre != "")   
        GuardarCookieBackEnd("LoginBackEnd", nombre, _31dias)  
}  