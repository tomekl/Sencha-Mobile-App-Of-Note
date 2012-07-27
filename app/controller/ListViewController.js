/**
*@class APPOFNOTE.controller.ListViewController
*
*Mediates APPOFNOTE.view.ListViewComponent
*
*Responds to :
*
*LIST_VIEW_COMPONENT_READY

*SELECTED_NOTE_CHANGED_EVENT

*NOTE_SAVED_IN_LOCALSTORE

*NOTE_UPDATED_IN_LOCALSTORE

*NOTE_DELETED_IN_LOCALSTORE

*DELETE_NOTE_CONFIRMED_EVENT

*NEW_NOTE_BTN_CLICKED_EVENT

*LIST_BTN_CLICKED_EVENT
**/

/**
*@event NOTE_DELETED_IN_LOCALSTORE
*Lets the application know the store has succesfully delete a note. This event is both dispatched and responded to on by this class.
**/
Ext.define('APPOFNOTE.controller.ListViewController', {

    extend: 'Ext.app.Controller'

    ,

    /**
    *@private 
    *Register application scope events this Controller responds to.
	**/
    init : function() {
	
		// When the ListViewComponent is created it dispatches an event.
		APPOFNOTE.app.addListener(

			APPOFNOTE.app.config.LIST_VIEW_COMPONENT_READY , this.registerViewComponent ,this 
			 
		);

		// When the user expands (selects) a new note on the list its record is stored
		// so it can be edited/deleted
		APPOFNOTE.app.addListener(

			APPOFNOTE.app.config.SELECTED_NOTE_CHANGED_EVENT , this.registerSelectedNoteRecord	, this
		);

		
		// When a new note is stored this view is shown again with a refreshed list
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.NOTE_SAVED_IN_LOCALSTORE , this.refreshListStore , this

		);

		// When an existing note is stored this view is shown again with a refreshed list
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.NOTE_UPDATED_IN_LOCALSTORE , this.refreshListStore , this

		);

		// When an existing note is deleted from the store the store needs refreshing
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.NOTE_DELETED_IN_LOCALSTORE , this.refreshListStore , this

		);

		// When a user confirms they want to delete a note the view dispatches this event
		// and the store is accessed from here
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.DELETE_NOTE_CONFIRMED_EVENT , this.deleteNote , this

		);



		// Remove any references to selected records as the user is entering the new note user journey.
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.NEW_NOTE_BTN_CLICKED_EVENT , this.registerSelectedNoteRecord , this

		);

		// The user has tapped the 'Back' button
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.LIST_BTN_CLICKED_EVENT , this.hideDeleteButton , this 
			 
		);


	}

	,

	/**
	*@private
	*An event handler for LIST_VIEW_COMPONENT_READY which is dispatched from APPOFNOTE.view.ListViewComponent
	*
	*Store a reference to APPOFNOTE.view.ListViewComponent.
	*
	*Create a store based on APPOFNOTE.model.NoteModel and set it as APPOFNOTE.view.ListViewComponent's store.
	*
	*Adds an "itemtap" listender to APPOFNOTE.view.ListViewComponent
	*
	*@param {APPOFNOTE.view.ListViewComponent} eventPayload
	**/
	registerViewComponent : function( eventPayload ){
		
		this.viewComponent = eventPayload;

		this.store = Ext.data.StoreManager.lookup('NoteStore');
	
		this.viewComponent.setStore( this.store );

		this.viewComponent.addListener("itemtap" , this.checkItemState); 
		
	}

	,

	/**
	*@private
	*An event handler for SELECTED_NOTE_CHANGED_EVENT and NEW_NOTE_BTN_CLICKED_EVENT
	*
	*Responds by either :
	*
	*1. A note has been selected on the list and SELECTED_NOTE_CHANGED_EVENT has been received. The record (VO) is stored in the namespace (APPOFNOTE.selectedItemRecord) so that it can be accessed if the note is deleted or edited.
	*
	*or 
	*
	*2. This controller is has recieved NEW_NOTE_BTN_CLICKED_EVENT as the user is creating a new note.  In which case all reference to selected note is removed as none will be selected when they return to the list.
	*
	*@param {APPOFNOTE.model.NoteModel} eventPayload
	**/
	registerSelectedNoteRecord : function( eventPayload ){

		if( eventPayload.selectedItemRecord != null ){

			APPOFNOTE.selectedItemRecord = eventPayload.selectedItemRecord;

		} else {

			APPOFNOTE.selectedItemRecord = null;
		}

	}

	,

	/**
	*@private
	*An event handler for NOTE_SAVED_IN_LOCALSTORE, NOTE_UPDATED_IN_LOCALSTORE and NOTE_DELETED_IN_LOCALSTORE.
	*
	*When a new note is stored, updated or deleted, the local reference to APPOFNOTE.store.NoteStore is synced and reloaded to ensure APPOFNOTE.view.ListViewComponent reflects the change.
	*
	**/
	refreshListStore : function(){

		if( this.store ){

			this.store.sync();

			this.store.load();

		}

	}

	,

	/**
	*@private
	*Responds to DELETE_NOTE_CONFIRMED_EVENT
	*
	*The user has confirmed they would like to remove a note from the store.  
	*
	*This is realised through a call to APPOFNOTE.model.NoteModel.erase() which takes two callback functions, defined here.
	*If successful NOTE_DELETED_IN_LOCALSTORE is dispatched and APPOFNOTE.selectedItemRecord is set to null.
	*
	*If not succesful the user is presented with a message.
	*
	**/
	deleteNote : function(){

	 	this.store.getById( APPOFNOTE.selectedItemRecord.noteID ).erase( {

	 		success : function(){


	 			APPOFNOTE.app.fireEvent(  APPOFNOTE.app.config.NOTE_DELETED_IN_LOCALSTORE  );

	 			APPOFNOTE.selectedItemRecord = null;

	 		}

	 		, 

	 		failure : function(){

	 			Ext.Msg.alert("Problem", "Your note could not be deleted.<br/>Please try again", Ext.emptyFn );

	 		}


	 	} );

	 }

	 ,

	/**
	*@private
	*Responds to LIST_BTN_CLICKED_EVENT
	*
	*The user has hit the back button from a new or edit note.  
	*
	*If this is from an edit note state the delete button on the list view needs hiding
	*
	**/
	hideDeleteButton : function(){

		this.viewComponent.deleteNoteBtn ? this.viewComponent.deleteNoteBtn.hide() : null;

	}

});