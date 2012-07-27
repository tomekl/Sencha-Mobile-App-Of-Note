/**
*@class APPOFNOTE.view.ViewStackViewComponent
*
*An Ext.Container with a Ext.layout.Card layout which acts as a view stack for the application. 
*
*This class is intitiated by APPOFNOTE.controller.ViewStackViewController which adds it directly as the only child of the application's viewport when responding to APPLICATION_READY_EVENT.
**/
Ext.define('APPOFNOTE.view.ViewStackViewComponent' , {
	
	extend : 'Ext.Container'

	,
	
	config : {
		
		navigationBar: {

	        docked: 'top'

   	 	}

   	 	,

		layout: {


			type : 'card'

		}

	}

}); 

