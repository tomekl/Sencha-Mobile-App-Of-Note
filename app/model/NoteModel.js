/**
*The data model for the record representing one note in APPOFNOTE.store.NoteStore
*/
Ext.define('APPOFNOTE.model.NoteModel', {

    extend: 'Ext.data.Model' ,
    
    config: {

        identifier: {

             type: 'uuid'
        
        }

        ,

        fields: [

            {	name: 'noteID'		, type: 'auto'	    },
            {	name: 'noteTitle'	, type: 'string'    } ,
            {	name: 'noteBody'	, type: 'string'  , convert : function( value, record ){ return value.replace(/\n/g, '<br/>'); } }

        ]

        ,

        idProperty : "noteID"

        ,

        proxy: {

	        type : 'localstorage' ,

	        id   : 'APPOFNOTE-notes'

	    }

    }

});