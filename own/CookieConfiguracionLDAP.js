  
/////////////////// CONFIGURACION ////////////////////////////////////  
var separador = "$"     //caracter separador de campos en el texto de la cookie  
  
/////////////////// DATOS QUE SE MOSTRARAN ///////////////////////////  
function MostrarConfigLDAP(){  
    var pieza = null; 
	var nombre = "ConfigurationLDAP";	
	if(CojerCookieConfigLDAP(nombre) != null) {  
        nombre = CojerCookieConfigLDAP(nombre)  
        pieza = nombre.split(separador);
		if (pieza.length < 3)
		{
			document.getElementById('vLDAPUSUARIO').value = '';
			document.getElementById('vLDAPPASSWORD').value = '';
			document.getElementById('remember').checked = false;
		}
		else
		{
			document.getElementById('vLDAPUSUARIO').value = atob(pieza[0]);
			document.getElementById('vLDAPPASSWORD').value = atob(pieza[1]);
			document.getElementById('remember').checked = true;
		}        	
    }         
}  
/////////////////////////DATOS QUE SE GUARDARAN /////////////////////////////////////  
function JuntarPiezasConfigLDAP() {   
    var entero = '' 
	var	remember = document.getElementById('remember').checked;
	if (remember)
	{
		var user = document.getElementById('vLDAPUSUARIO').value;
		var	pass = document.getElementById('vLDAPPASSWORD').value;
		entero = btoa(user) + separador + btoa(pass) + separador;    
    }
	else
	{
		entero = separador;  
	}
	IntroducirCookieConfigLDAP(entero);
	return true;	
}  
  
////////////////////////////////// FIN DE VARIABLES A CAMBIAR /////////////////////////////////  
  
function CojerValorCookieConfigLDAP(indice) {  
    //indice indica el comienzo del valor  
    var galleta = document.cookie  
    //busca el final del valor, dado por ;, a partir de indice  
    var finDeCadena = galleta.indexOf(";", indice)  
    //si no existe el ;, el final del valor lo marca la longitud total de la cookie  
    if (finDeCadena == -1)  
        finDeCadena = galleta.length  
  
    return unescape(galleta.substring(indice, finDeCadena))  
    }  
  
function CojerCookieConfigLDAP(nombre) {  
    var galleta = document.cookie  
    //construye la cadena con el nombre del valor  
    var arg = nombre + "="  
        var alen = arg.length           //longitud del nombre del valor  
    var glen = galleta.length       //longitud de la cookie  
  
    var i = 0  
    while (i < glen) {  
        var j = i + alen            //posiciona j al final del nombre del valor  
        if (galleta.substring(i, j) == arg) //si en la cookie estamo ya en nombre del valor       
            return CojerValorCookieConfigLDAP(j)  //devuleve el valor, que esta a partir de j  
  
        i = galleta.indexOf(" ", i) + 1     //pasa al siguiente  
        if (i == 0)  
            break               //fin de la cookie  
    }  
    return null                 //no se encuentra el nombre del valor  
}  
  
function GuardarCookieConfigLDAP(nombre, valor, caducidad) {  
    if(!caducidad)  
        caducidad = CaducaConfigLDAP(0)  
  
    //crea la cookie: incluye el nombre, la caducidad y la ruta donde esta guardada  
    //cada valor esta separado por ; y un espacio  
    document.cookie = nombre + "=" + escape(valor) + "; expires=" + caducidad + "; path=/"  
}  
  
function CaducaConfigLDAP(dias) {  
    var hoy = new Date()                    //coge la fecha actual  
    var msEnXDias = eval(dias) * 24 * 60 * 60 * 1000    //pasa los dias a mseg.  
  
    hoy.setTime(hoy.getTime() + msEnXDias)          //fecha de caducidad: actual + caducidad  
    return (hoy.toGMTString())  
}  
  
function BorrarCookieConfigLDAP(nombre) {  
    //para borrar la cookie, se le pone una fecha del pasado mediante Caduca(-1)  
    document.cookie = nombre + "=; expires=" + CaducaConfigLDAP(-1) + "; path=/"  
}  
  
function IntroducirCookieConfigLDAP(nombre) {  
    //establece la cookie: la caducidad es de 31 dias  
    var _31dias = CaducaConfigLDAP(31)                //crea la fecha de caducidad si 31 dias  
    if (nombre != "")   
        GuardarCookieConfigLDAP("ConfigurationLDAP", nombre, _31dias)  
}  
  
function MostrarMiCookieConfigLDAP() {  
    MostrarConfigLDAP('ConfigurationLDAP')
	//document.write(document.cookie)
} 
window.onload = MostrarMiCookieConfigLDAP;  
if (document.captureEvents) {               //N4 requiere invocar la funcion captureEvents  
    document.captureEvents(Event.LOAD)  
}   