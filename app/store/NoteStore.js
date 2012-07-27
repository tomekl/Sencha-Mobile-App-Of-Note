/**
*A data store providing access to the phone's localstorage.
**/
Ext.define( 'APPOFNOTE.store.NoteStore' , {

	extend 	: 'Ext.data.Store'				

	,

	requires:['Ext.data.proxy.LocalStorage']

	,


	config 	: {

		model 	: 'APPOFNOTE.model.NoteModel'  

		,

		syncRemovedRecords: false

		,


		proxy : {

	        type : 'localstorage' ,

	        id   : 'APPOFNOTE-notes' 
			
	    }

	    ,

	    autoLoad : true

	}

});