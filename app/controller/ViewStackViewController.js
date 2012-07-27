/**
*@class APPOFNOTE.controller.ViewStackViewController
*
*Manages the active view displayed by APPOFNOTE.view.ViewStackViewComponent which is attached to the viewport. 
*
*Responds to events dispatched from the buttons on the nav bar (for each view)
*
*Responds to :
*
*
*APPLICATION_READY_EVENT

*NEW_NOTE_BTN_CLICKED_EVENT

*EDIT_NOTE_BTN_CLICKED_EVENT

*LIST_BTN_CLICKED_EVENT 

*NOTE_SAVED_IN_LOCALSTORE

*NOTE_UPDATED_IN_LOCALSTORE
**/

/**
*@event ORIENTATION_CHANGE_EVENT
*Dispatched when this class handles {@link Ext.Viewport}'s orientationchange event.
**/ 
Ext.define('APPOFNOTE.controller.ViewStackViewController', {

    extend	: 'Ext.app.Controller' 

    ,

    /**
    *@private 
    *Register application scope events this Controller responds to.
    **/
    init : function(){
    	
		//this.callParent(arguments);

    	 // Register application scope events to respond to.
		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.APPLICATION_READY_EVENT , 
			this.index ,
			this

		);

		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.APPLICATION_READY_EVENT , 
			this.showList , 
			this

		);

		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.NEW_NOTE_BTN_CLICKED_EVENT , 
			this.showNewNoteForm , 
			this
        );

        APPOFNOTE.app.addListener( 

            APPOFNOTE.app.config.EDIT_NOTE_BTN_CLICKED_EVENT , 
            this.showEditNoteForm , 
            this

        );

		APPOFNOTE.app.addListener( 

			APPOFNOTE.app.config.LIST_BTN_CLICKED_EVENT , 
			this.showList , 
			this

		);


        APPOFNOTE.app.addListener( 

            APPOFNOTE.app.config.NOTE_SAVED_IN_LOCALSTORE , 
            this.showList , 
            this

        );


        APPOFNOTE.app.addListener( 

            APPOFNOTE.app.config.NOTE_UPDATED_IN_LOCALSTORE , 
            this.showList , 
            this

        );

    }
    
    ,

    /**
    *@private
    *One of two event handlers for APPLICATION_READY and establishes the initial state of the application.
    *
    *Instantiates APPOFNOTE.view.ViewStackViewComponent and sets it as the only child of the viewport
    *
    *Also sets up a handler for {@link Ext.Viewport}'s orientationchange change event.
    **/
    index	: function(){
    	
    	// Add the view stack to the view port
    	this.viewStack = new APPOFNOTE.view.ViewStackViewComponent();

    	Ext.Viewport.add( this.viewStack ) ;


        // Let the views that are sensitive to the orientation know that it has changed
        Ext.Viewport.addListener( "orientationchange" , function(){
 
            App.views.Viewport.doLayout()

            APPOFNOTE.app.fireEvent(  APPOFNOTE.app.config.ORIENTATION_CHANGE_EVENT );

        });

    }

    ,

    /**
    *@private
    *
    *Show the list of notes.
    *
    *The first view of the application. 
    *
    *This view is also returned to if the user hits back on the new/edit view or when a successful update / insert has been succesful.
    **/
    showList : function(){

    	// If there is not list view create one
    	if( !this.listViewComponent ){
    		
			this.listViewComponent = new APPOFNOTE.view.ListViewComponent();

			// and push it on to the navigationViewComponent
    		this.viewStack.add(  this.listViewComponent );

    	}

    	// show the list
    	this.viewStack.setActiveItem( this.listViewComponent );

    }

    ,

    /**
    *@private
    *
    *Shows the view which contains the form allowing the user to enter a new note.
    **/
    showNewNoteForm : function(){

    	// If a note form has not been created then make one now
    	if( !this.noteFormViewComponent ){
    		
			this.noteFormViewComponent = new APPOFNOTE.view.NoteFormViewComponent();

			// and push it on to the navigationViewComponent
    		this.viewStack.add(  this.noteFormViewComponent );

		}

		// show the form
    	this.viewStack.setActiveItem( this.noteFormViewComponent );

    }

    ,

    /**
    *@private
    * Shows the view with a note form.  The APPOFNOTE.view.NoteFormViewComponent also responds to EDIT_NOTE_BTN_CLICKED_EVENT and populates the fields.
    **/
    showEditNoteForm : function(){

        // If a note form has not been created then make one now
        if( !this.noteFormViewComponent ){
            
            this.noteFormViewComponent = new APPOFNOTE.view.NoteFormViewComponent();

            // and push it on to the navigationViewComponent
            this.viewStack.add(  this.noteFormViewComponent );

        }

        // show the form
        this.viewStack.setActiveItem( this.noteFormViewComponent );

    }

});