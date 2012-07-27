/**
*@class APPOFNOTE.view.ListViewComponent
*
*View component that displays the list of notes.
*
*Renders a Ext.TitleBar at the top of the view which contains buttons for creating a new note or editing the selected note, should one be selected.
**/

/**
*@event LIST_VIEW_COMPONENT_READY
*Lets the application know this view is ready once #initialize has completed.  Handled by {@link APPOFNOTE.controller.ListViewController}.
*@param {APPOFNOTE.view.ListViewComponent} this
**/

/**
*@event SELECTED_NOTE_CHANGED_EVENT
*Dispatched when the user taps a note to either select it, which may deselect another one, or deselect the currently selected one.  This is handled by {@link APPOFNOTE.controller.ListViewController}.
*
*Also dispatched when the user taps the new note button with an empty payload to reset the {@link APPOFNOTE.controller.ListViewController}'s reference to the selected note.
*@param {Ext.data.Model / Object} record The record backing the selected note or an empty object if none selected
**/

/**
*@event NEW_NOTE_BTN_CLICKED_EVENT
*Dispatched when the user taps the new note button.  
**/

/**
*@event EDIT_NOTE_BTN_CLICKED_EVENT
*Dispatched when the user taps the edit note button.  
*@param {Ext.data.Model} record The record backing the selected note.
**/

/**
*@event DELETE_NOTE_CONFIRMED_EVENT
*Dispatched when the user taps the "yes" button on the delete confirm dialogue.
**/
Ext.define('APPOFNOTE.view.ListViewComponent' , {
	
	extend : 'Ext.DataView' 

	,

	config : {

        cls : "list-view-container"

        ,

        showAnimation: {

            type: 'slide'

            ,

            direction: 'right'
        }

        ,

        hideAnimation: {

            type: 'slide'

            ,

            direction: 'left'
        }

        ,

		items : [ 

			{ 

                docked: 'top' , xtype: 'titlebar' , title: 'Notes' , 

                cls : 'titleBar' , 

                items : [

                	{

                        id : 'newNoteBtn'       ,
                        text : 'New'
                    } 

                    ,

                    {
                        
                        id : 'editNoteBtn' ,
                        text : 'Edit' ,
                        align : 'right'    ,
                        hidden : true      

                    } 
                    
                ]

            }

		]


        ,

       // changed from a bit of html on index.html to here as there was a strange template error when running a Sencha "package" build
       itemTpl: '<tpl for="."><div class="noteWrapperElement"><div class="noteTitleElement"><div class="noteTitleElementTextContainer">{noteTitle}</div></div><div class="noteBodyElement"><div class="noteButtonContainer"></div><br class="clearBoth" />{noteBody}</div></div></tpl>'

	}

    ,

    /**
    *@private
    *Set up "tap" listeners on the new and update buttons and an "itemtap" event listener on the list.
    *
    *Ensures the local references to selected items are set to default values via #resetList() and dispatches
    *LIST_VIEW_COMPONENT_READY
    **/
    initialize : function() {


        this.callParent(arguments);

        /**
        *@property {Ext.Button}
        *The edit note button.
        */
        this.editNoteBtn = this.query('#editNoteBtn')[0];
        this.editNoteBtn.addListener( "tap" , this.editNoteBtnClicked , this );

        /**
        *@property {Ext.Button}
        *The new note button.
        */
        this.newNoteBtn = this.query('#newNoteBtn')[0];
        this.newNoteBtn.addListener( "tap" , this.newNoteBtnClicked , this );

        this.addListener("itemtap" , this.noteItemTapped ); 

        // no items are open which is the same state as when we reset the list
        this.resetList();

        APPOFNOTE.app.fireEvent(  APPOFNOTE.app.config.LIST_VIEW_COMPONENT_READY , this );

    }

    ,

    /**
    *@private
    *Event handler for "itemtap" event.
    *
    *If the item tapped is already selected the references to the selected record are reset via #resetList().  
    *SELECTED_NOTE_CHANGED_EVENT is dispatched with an empty object as the pay load and finally the update button is hidden.
    *
    *If the item tapped is not selected SELECTED_NOTE_CHANGED_EVENT is dispatched with the Ext.data.Model record backing the newly selected note.
    *This is handled by {@link APPOFNOTE.controller.ListViewController} which stores a refence to this record which is used by potential subsequent editing or deleting operations.
    *The edit button is shown and a delete button is added to the selected, expanded, note.
    *@param {Ext.dataview.DataView} that
    *@param {Number} index
    *@param {Ext.Element / Ext.dataview.component.DataItem} target
    *@param {Ext.data.Model} record
    *@param {Ext.EventObject} e
    *@param {Object} eOpts
    **/
    noteItemTapped : function( that , index , target , record , e , eOpts) {

         // if there is a delete button destroy it
        this.deleteNoteBtn ? this.deleteNoteBtn.destroy() : null;

        // is the item tapped already selected?
        if( this.selectedRecord == record.data ){

            // yes 

            // toggle the selected item back to unselected
            this.resetList();

            this.editNoteBtn.hide(true);

            // Handled on the ListViewController
            APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.SELECTED_NOTE_CHANGED_EVENT , { 'selectedItemRecord' : {} } );

        } else {
  
            // the item tapped is not already selected

            /**
            *@private
            *@property {Ext.data.Model}
            *If there is currently a note selected this property refers to the APPOFNOTE.model.NoteModel backing it.
            */
            this.selectedRecord = record.data;
    
            // Handled on the ListViewController
            APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.SELECTED_NOTE_CHANGED_EVENT , { 'selectedItemRecord' : this.selectedRecord } );

            this.editNoteBtn.show(false);

            // add the delete button
            var noteButtonContainerElementHTML =  target.query(".noteButtonContainer")[0];
       
            if( noteButtonContainerElementHTML ){

                var noteButtonContainerElement = Ext.get( noteButtonContainerElementHTML );

                this.deleteNoteBtn ? this.deleteNoteBtn.destroy() : null;

                /**
                *@property {Ext.Button}
                *The delete note button.  If there is no delete button visible then this will not reference anything.
                */
                this.deleteNoteBtn = Ext.create('Ext.Button', {

                    cls:'noteItemDeleteButton'  ,
                    renderTo    : noteButtonContainerElement ,
                    showAnimation : 'fade'      ,
                    hidden : true               ,
                    listeners: {
                        
                        tap : {

                            fn : this.showConfirmNoteDeleteMsgBox   ,
                            scope : this
                        }

                    }

                });

                this.deleteNoteBtn.show();

            }

        }

    }

    ,

    /**
    *@private
    *Event handler for "tap" event on the new note button.
    *
    *Dispatches SELECTED_NOTE_CHANGED_EVENT , NEW_NOTE_BTN_CLICKED_EVENT and calls #resetList.
    */
    newNoteBtnClicked : function(){ 
        
        // Handled on the ListViewController
        APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.SELECTED_NOTE_CHANGED_EVENT , { 'selectedItemRecord' : {} } );

        APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.NEW_NOTE_BTN_CLICKED_EVENT ); 

        this.resetList();

    }

    ,

    /**
    *@private
    *Event handler for "tap" event on the update note button.
    *
    *Dispatches EDIT_NOTE_BTN_CLICKED_EVENT with the Ext.data.Model record backing the selected note, hides the edit note button and calls #resetList.
    */
    editNoteBtnClicked : function(){

        APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.EDIT_NOTE_BTN_CLICKED_EVENT ,

            { selectedItemRecord : this.selectedItemRecord }

        );

        this.editNoteBtn.hide(true);

        this.resetList();

    }

    ,

    /**
    *If the internal reference to the selected record is not null then that is used to visually deselect that item on the list
    *before the reference is set to null as no items should be selected when the list is reset.
    */
    resetList : function() {

        this.selectedRecord ? this.deselectAll( this.selectedRecord ) : null;
        this.selectedRecord = null; 
        
    }

    ,

    /**
    *@private
    *Event handler for "tap" event on the delete note button.  Prevents the event from bubbling further as this would select the item in the list and displays the delete confirm dialogue box.
    */
    showConfirmNoteDeleteMsgBox : function( that , e , eOpts ){

        e.stopEvent();

        this.confirmDeleteMsgBox = Ext.Msg.confirm("Delete Note?", "Do you really want to delete that note?", this.handleConfirmNoteDeleteMsgBox , this );

    }

    ,

    /**
    *@private
    *Event handler for the delete confirm dialogue box.  If the "yes" button was clicked dispatch DELETE_NOTE_CONFIRMED_EVENT and hide the edit and delete buttons and show the new button.
    *@param {String} buttonLabelText The label of the button clicked
    */
    handleConfirmNoteDeleteMsgBox : function( buttonLabelText ){

        if( buttonLabelText == "yes" ){

            APPOFNOTE.app.fireEvent( APPOFNOTE.app.config.DELETE_NOTE_CONFIRMED_EVENT );

            this.editNoteBtn.hide(true);
            this.deleteNoteBtn.hide(true);

            this.newNoteBtn.show(true);

        }
       
    }

});