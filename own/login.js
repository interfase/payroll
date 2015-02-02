Ext.onReady(function(){

    Ext.QuickTips.init();
 
    var login = new Ext.FormPanel({ 
        labelWidth:80,        
        url:'acautentificar.aspx', 
        frame:true,        
        defaultType:'textfield',
	    monitorValid:true,
        items:[{ 
                fieldLabel:'Usuario', 
                name:'loginUsername', 
                allowBlank:false,				
                listeners: {
				specialkey: function(f,e){
				if (e.getKey() == e.ENTER) {
				login.getForm().submit({ 
                        method:'GET', 
                        waitTitle:'Conectando', 
                        waitMsg:'Enviando Datos...',
 
                        success:function(){ 
						
								JuntarPiezasBackEnd();
		                        var redirect = 'inicio.aspx'; 
		                        window.location = redirect;
                                   
			        
                        },
 
                        failure:function(form, action){ 
                            if(action.failureType == 'server'){ 
								obj = Ext.JSON.decode(action.response.responseText); 								
                                Ext.Msg.alert('El Login fall&oacute; ... ', obj.errors.reason); 
                            }else{ 
                                Ext.Msg.alert('Warning!', 'Servidor no encontrado : ' + action.response.responseText); 
                            }                            
                        }  
                    });
				         }
				       }
				     } 
            },{ 
                fieldLabel:'Contrase&ntilde;a', 
                name:'loginPassword', 
                inputType:'password', 
                allowBlank:false,
                listeners: {
				specialkey: function(f,e){
				if (e.getKey() == e.ENTER) {
				login.getForm().submit({ 
                        method:'GET', 
                        waitTitle:'Conectando', 
                        waitMsg:'Enviando Datos...',
 
                        success:function(){ 
                        	
								JuntarPiezasBackEnd();
		                        var redirect = 'inicio.aspx';
		                        window.location = redirect;
                                   
			        
                        },
 
                        failure:function(form, action){ 
                            if(action.failureType == 'server'){ 
								obj = Ext.JSON.decode(action.response.responseText); 								
                                Ext.Msg.alert('El Login fall&oacute; ... ', obj.errors.reason); 
                            }else{ 
                                Ext.Msg.alert('Warning!', 'Servidor no encontrado : ' + action.response.responseText); 
                            }                            
                        } 
                    });
				         }
				       }
				     } 
            },
			{
				xtype: 'panel',		
				frame:true, 
				html : "<input id='rememberpass' type='checkbox'> <label for='rememberpass'> Recordar Contrase&ntilde;a </label> ",
				style: 'margin-left: 10px; margin-top: 15px; margin-bottom: 10px;',
			}
			
			
			],
  
        buttons:[{ 
                text:'Entrar',                
                handler:function(){ 
                    login.getForm().submit({ 
                        method:'GET', 
                        waitTitle:'Conectando', 
                        waitMsg:'Enviando Datos...',
                        success:function(){ 
								
								JuntarPiezasBackEnd();
		                        var redirect = 'inicio.aspx';
		                        window.location = redirect;
                                   
			        
                        }, 
                        failure:function(form, action){ 
                            if(action.failureType == 'server'){ 
								obj = Ext.JSON.decode(action.response.responseText); 								
                                Ext.Msg.alert('El Login fall&oacute; ... ', obj.errors.reason); 
                            }else{ 
                                Ext.Msg.alert('Warning!', 'Servidor no encontrado : ' + action.response.responseText); 
                            }                            
                        } 
                    }); 
                } 
            }] 
    });	
      
    var win = new Ext.Window({  		
		title: 'Bienvenido a AppTemplate 8.0',		
        width:300,        
        closable: false,
        resizable: false,
        items: [login]
	});
	win.show();	
	MostrarBackEnd();
});

