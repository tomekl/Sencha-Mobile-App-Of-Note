/**
*@class APPOFNOTE.controller.NoteFormController
*
*Mediates APPOFNOTE.view.NoteFormViewComponent
*
*Manages the new / update note form. 
*
*Responds to :
*
*NOTE_SAVED_IN_LOCALSTORE 

*SHOW_ALERT_MESSAGE_BOX 

*NOTE_UPDATED_IN_LOCALSTORE

*LIST_BTN_CLICKED_EVENT

*UPDATE_NOTE_BTN_CLICKED_EVENT 

*SAVE_NOTE_BTN_CLICKED_EVENT 

*NEW_NOTE_BTN_CLICKED_EVENT

*EDIT_NOTE_BTN_CLICKED_EVENT

*ORIENTATION_CHANGE_EVENT 

*NEW_NOTE_VIEW_COMPONENT_READY
**/

/**
*@event NOTE_SAVED_IN_LOCALSTORE
*Dispatched when a APPOFNOTE.model.NoteModel instance is successfuly added to APPOFNOTE.store.NoteStore.
**/
	
/**
*@event NOTE_UPDATED_IN_LOCALSTORE
*Dispatched when the contents of an existing APPOFNOTE.model.NoteModel instance is successfuly updated in APPOFNOTE.store.NoteStore.
**/
Ext.define('APPOFNOTE.controller.NoteFormController', {

    extend: 'Ext.app.Controller'

    ,
    
    /**
    *@private 
    *Register application scope events this Controller responds to.
    **/
    init : function() {

		// Register application scope events to respond to.

		// When the NewNoteFormViewComponent is created ViewStackViewController dispatches an event
		// which is handled here.  
		APPOFNOTE.app.addListener(

			APPOFNOTE.app.config.NEW_NOTE_VIEW_COMPONENT_READY , this.registerViewComponent , this 
			 
		);

		// When the orientation of the device is changed the note body needs to be resized.
		APPOFNOTE.app.addListener(

			APPOFNOTE.app.config.ORIENTATION_CHANGE_EVENT , this.resizeViewComponentNoteBody , this 
			 
		);

		// The user is editing a note.  The form needs to be populated with the selected notes
		// values and the save button needs to say 'Update'.
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.EDIT_NOTE_BTN_CLICKED_EVENT , this.prepareEditNoteForm	 , this 

		);

		
		// The user is editing a note.  The form needs to be populated with the selected notes
		// values and the save button needs to say 'Save'.
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.NEW_NOTE_BTN_CLICKED_EVENT , this.prepareNewNoteForm , this 

		);
		

		// The user has tapped the 'Save' note button.
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.SAVE_NOTE_BTN_CLICKED_EVENT , this.saveNewNote , this 
			 
		);

		// The user has tapped the 'Update' note button.
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.UPDATE_NOTE_BTN_CLICKED_EVENT , this.updateExistingNote , this 
			 
		); 

		// The user has tapped the 'Back' button.
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.LIST_BTN_CLICKED_EVENT , this.resetForm , this 
			 
		);

		// get a local reference to the store.
		this.store = Ext.data.StoreManager.lookup('NoteStore');

	}

	,

	/**
	*@private
	*
	*Event handler for NEW_NOTE_VIEW_COMPONENT_READY. 
	*
	*The reference to APPOFNOTE.view.NoteFormViewComponent dispatched with the event being handled here is stored and references to the two text elements and three buttons on the component are stored before making sure the note body textarea 
	*is the correct size by calling APPOFNOTE.view.NewNoteFormViewComponent.resizeNoteBody().
	*
	*@param {APPOFNOTE.view.NoteFormViewComponent} eventPayload
	*/
	registerViewComponent : function( eventPayload ){
		
		this.viewComponent = eventPayload.viewComponent || null;

		if(	this.viewComponent ){

			this.noteTitleBar = this.viewComponent.query("#noteTitleBar")[0];
			this.noteTitle = this.viewComponent.query("#noteTitle")[0];
			this.noteBody = this.viewComponent.query("#noteBody")[0];

			this.saveNoteBtn = this.viewComponent.saveNoteBtn;
			this.updateNoteBtn = this.viewComponent.updateNoteBtn;
			this.listBtn = this.viewComponent.listBtn;

			this.viewComponent.resizeNoteBody();

		}
		
	}

	,

	/**
	*@private
	*
	*Event handler for ORIENTATION_CHANGE_EVENT.
	*
	*Ensure the note body textarea of APPOFNOTE.view.NewNoteFormViewComponent is the correct size by calling NewNoteFormViewComponent.resizeNoteBody()
	*
	*/
	resizeViewComponentNoteBody : function(){

		// Only react to the orientation change if the view has been created
		if(	this.viewComponent ){
			
			this.viewComponent.resizeNoteBody();
				
		}

	}

	,

	/**
	*@private
	*
	*Event handler for EDIT_NOTE_BTN_CLICKED_EVENT.
	*
	*The user has elected to edit the selected (open) note on the list.
	*
	*This handler populates the form with values stored in APPOFNOTE.selectedItemRecord.  Also ensures that the correct button is visible on the form and the title bar displays "Edit".
	*
	*/
	prepareEditNoteForm : function(){

		this.saveNoteBtn.hide(true);
		this.updateNoteBtn.show(true);
		this.listBtn.show(true);

		if(	APPOFNOTE.selectedItemRecord ){

			this.noteTitle.setValue( APPOFNOTE.selectedItemRecord.noteTitle );
			this.noteBody.setValue( APPOFNOTE.selectedItemRecord.noteBody.replace(/<br\/>/g, '\n'));

		}

		this.noteTitleBar.setTitle('Edit');

	}

	,


	/**
	*@private
	*
	*Event handler for NEW_NOTE_BTN_CLICKED_EVENT.
	*
	*The user has elected to add a new note.  This handler ensures that the correct button is visible on the form and the title bar displays "New".
	*
	*/
	prepareNewNoteForm : function() {

		this.saveNoteBtn.show(true);
		this.updateNoteBtn.hide(true);
		this.listBtn.show(true);

		this.noteTitleBar.setTitle('New');

	}

	,


	/**
	*@private
	*
	*Event handler for SAVE_NOTE_BTN_CLICKED_EVENT.
	*
	*The user has saved a new note.
	*
	*An APPOFNOTE.model.NoteModel instance is created using the values of the noteTitle and noteBody elements on APPOFNOTE.view.NoteFormViewComponent. 
	*
	*This new note model is added to APPOFNOTE.store.NoteStore and if all goes well NOTE_SAVED_IN_LOCALSTORE is dispatched and the form is reset.
	*
	*If there was a problem adding the Model to the Store a message is displayed to the user.
	*/
	saveNewNote : function(){

		var msgNoteTitle = this.noteTitle.getValue();
		var msgNoteBody = this.noteBody.getValue();

		// add a default title if necc.
		if( msgNoteTitle == "" ){

			msgNoteTitle = "Note";
		}

		// add the note data
		var noteModel  = new APPOFNOTE.model.NoteModel({

			noteTitle : msgNoteTitle ,
    		noteBody  : msgNoteBody

		});

		var records = this.store.add(noteModel);

		
		// synch with disk 

		// if all is well go back to the list and reset the fields

		// else there is a problem let the user know 
		if(  this.store.sync().added.length == 1){

			 APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.NOTE_SAVED_IN_LOCALSTORE );

			 this.resetForm();
			 
		}	else	{

			Ext.Msg.alert("Problem" , "Your note could not be saved.<br/>Please try again")

		}

	}


	,

	/**
	*@private
	*
	*Event handler for UPDATE_NOTE_BTN_CLICKED_EVENT.
	*
	*Retrieves a reference to the relevant APPOFNOTE.model.NoteModel using APPOFNOTE.selectedItemRecord.noteID as a key.
	*
	*Updates the model using the values of the noteTitle and noteBody elements on APPOFNOTE.view.NoteFormViewComponent. 
	*
	*Also dispatches NOTE_UPDATED_IN_LOCALSTORE before resetting the form.
	*/
	updateExistingNote : function(){

		var msgNoteTitle = this.noteTitle.getValue();
		var msgNoteBody = this.noteBody.getValue();

		// add a default title if necc.
		if( msgNoteTitle == "" ){

			msgNoteTitle = "Note";
		}

		var noteStoreRecord = this.store.getById( APPOFNOTE.selectedItemRecord.noteID );

		// no way of testing if the set failed or not
		noteStoreRecord.set( 'noteTitle' , msgNoteTitle  );
		noteStoreRecord.set( 'noteBody' , msgNoteBody  );

		// let the application know the model has changed
		APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.NOTE_UPDATED_IN_LOCALSTORE );

		// reset selected note and form
		APPOFNOTE.selectedItemRecord = {};

		this.resetForm();

	}

	,

	/**
	*@private
	*
	*Ensures the form fields have no values in them.
	*/
	resetForm : function(){

		this.noteTitle.setValue("");
		this.noteBody.setValue("");

	}

});