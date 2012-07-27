/**
*@class APPOFNOTE.view.NoteFormViewComponent
*
*View component that displays a form with a note title and note body input elements.  Used by both the new and edit note scenarios.
**/

/**
*@event NEW_NOTE_VIEW_COMPONENT_READY
*Lets the application know this view is ready once #initialize() has completed.  Handled by {@link APPOFNOTE.controller.NoteFormController}.
*@param {APPOFNOTE.view.NoteFormViewComponent} this
**/

/**
*@event LIST_BTN_CLICKED_EVENT
*Dispatched when the user clicks the back button to return to the list from the form without creating or updating.
**/

/**
*@event SAVE_NOTE_BTN_CLICKED_EVENT 
*Dispatched when the user clicks the save button after entering new note details on the form.
**/

/**
*@event UPDATE_NOTE_BTN_CLICKED_EVENT
*Dispatched when the user clicks the update button after editing note details on the form.
**/
Ext.define('APPOFNOTE.view.NoteFormViewComponent' , { extend : 'Ext.Panel' ,

	config : {

		layout: 'fit'

		,

		showAnimation: {

            type: 'slide'

            ,

            direction: 'left'
        }

        ,

       	hideAnimation: {

            type: 'slide'

            ,

            direction: 'right'
        }

        ,

		items : [ 

			{

	        docked: 'top' , xtype: 'titlebar' , title: 'New' , cls : 'titleBar' , id  : 'noteTitleBar' ,
	        items : [ 

	        		{ id : 'listBtn'       , text : 'Back' } , 
	        		{ id : 'saveNoteBtn'   , text : 'Save'   , align : 'right' } ,
	        		{ id : 'updateNoteBtn' , text : 'Update' , align : 'right' , hidden : true } ,

	        	] 

	    	} 

	        , 

	        {
	            
	        xtype : 'fieldset' 

	        ,

	        defaults : {	labelWidth: '60px' } 

	        ,

	        items : [

	        		{ xtype : 'textfield', id  : 'noteTitle', label : 'Title' , clearIcon : false } , 
	        		{ xtype : 'textareafield' , id  : 'noteBody' , label : 'Note' , bottom : 0 , right : 0 , left : 0 ,
			    	top : 45 , clearIcon : false } 

				]

			} 

		]

	}

	,

	/**
    *@private
    *
    *The first time the component is initialised get references to the HTML textarea backing the Ext.field.TextArea.
    *
    *The reason for this is the height of the element can not be affected any other way.
    *
    *Dispatch NEW_NOTE_VIEW_COMPONENT_READY which is handled by APPOFNOTE.controller.NoteFormController which immediately calls #resizeNoteBody().
    **/
	initialize : function() {
		
		this.callParent(arguments);

		// get reference to the textarea HTML element itself - seems a bit precarious this

		/**
		*@private
        *@property textarea HTML element
        *A reference to the textarea HTML element backing the Ext.field.TextArea used for note body text.  This is used by resizeNoteBody() to keep the note body filling all of the remaining height when responding to orientation change.
        **/
		this.noteBodyTextArea = (this.query('#noteBody')[0]).getComponent().element.dom.firstChild;
		
		// get reference to the buttons on the titlebar

		/**
        *@property {Ext.Button}
        *@private
        *The "back" to the list button.
        **/
		this.listBtn = this.query('#listBtn')[0];
        this.listBtn.addListener( "tap" , this.dispatchListButtonClicked , this );

        /**
        *@property {Ext.Button}
        *@private
        *The save a "new" note button.
        **/
        this.saveNoteBtn = this.query('#saveNoteBtn')[0];
        this.saveNoteBtn.addListener( "tap" , this.dispatchSaveNoteButtonClicked , this );

        /**
        *@property {Ext.Button}
        *@private
        *The "update" an existing note button.
        **/
        this.updateNoteBtn = this.query('#updateNoteBtn')[0];
		this.updateNoteBtn.addListener( "tap" , this.dispatchUpdateNoteButtonClicked , this );

        // let the application know this component has been created.  This is handled by the NoteFormController
        APPOFNOTE.app.fireEvent(APPOFNOTE.app.config.NEW_NOTE_VIEW_COMPONENT_READY , { 'viewComponent' : this});

	}

	,

	/**
	*Calculate the target height based on the current orientation's scrollHeight and resize the HTML textarea element that backs the Ext.field.TextArea used for note body text.
	**/
	resizeNoteBody : function(){
		
		// calculate target height.

		// the document height - the height of noteTitle and the height of the navigation bar 
		this.targetHeight = document.body.scrollHeight - 45 - 45;

		this.noteBodyTextArea.setAttribute('style', "height: " + this.targetHeight + "px");

	}

	,

	/**
	*@private
	*Event handler invoked when the user taps the "back" button which returns them to the list of notes.
	*
	*Ensure the correct buttons are visible on the title bar and dispatches LIST_BTN_CLICKED_EVENT
	**/
	dispatchListButtonClicked : function(){

		this.updateNoteBtn.hide(true);
		this.saveNoteBtn.hide(true);
		this.listBtn.hide(true);

		APPOFNOTE.app.fireEvent(APPOFNOTE.app.config.LIST_BTN_CLICKED_EVENT );

	}

	,


	/**
	*@private
	*Event handler invoked when the user has finished adding a new note and has hit the "save" button.  
	*Hide the "new" and "back" buttons to help the transition's appearance.
	*Dispatch SAVE_NOTE_BTN_CLICKED_EVENT which gets APPOFNOTE.controller.NoteFormController to add the note to the model.
	**/
	dispatchSaveNoteButtonClicked : function(){

		this.saveNoteBtn.hide(true);
		this.listBtn.hide(true);

		APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.SAVE_NOTE_BTN_CLICKED_EVENT);

	}

	,

	/**
	*@private
	*Event handler invoked when the user has finished adding a new note and has hit the "update" button.  
	*Hide the "update" and "back" buttons to help the transition's appearance.
	*Dispatch UPDATE_NOTE_BTN_CLICKED_EVENT which gets APPOFNOTE.controller.NoteFormController to update the note on the model.
	*/ 
	dispatchUpdateNoteButtonClicked : function(){

		this.updateNoteBtn.hide(true);
		this.listBtn.hide(true);

		APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.UPDATE_NOTE_BTN_CLICKED_EVENT );

	}

}); 