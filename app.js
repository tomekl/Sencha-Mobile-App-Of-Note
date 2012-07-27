Ext.application({

    name: 'APPOFNOTE'

    ,

    requires: [

        'Ext.XTemplate'     ,
        'Ext.MessageBox'    ,
        'Ext.form.FieldSet' ,
        'Ext.TitleBar'      ,
        'Ext.data.Store'    ,
        'Ext.data.proxy.LocalStorage'   ,
        'Ext.data.identifier.Uuid'

    ]

    ,

    models: ["NoteModel"]

    ,


    stores : ['NoteStore']

    ,

 
    views: [

        'ViewStackViewComponent', 
        'ListViewComponent'     , 
        'NoteFormViewComponent'

    ]

    ,
 
    controllers: [

        'ViewStackViewController'   , 
        'ListViewController'        , 
        'NoteFormController'

    ]

    ,

    icon: {

        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    }

    ,

    isIconPrecomposed: true

    ,

    startupImage: {
        
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    }


    ,

    config : {

        // Register Application scope events.  This is done as there will be a run time error if 
        // something is spelt wrong rather than the event just not being handled, which is harder to debug.
        
        // APPLICATION
        ORIENTATION_CHANGE_EVENT    : "ORIENTATION_CHANGE_EVENT"            ,
        APPLICATION_READY_EVENT     : "APPOFNOTE.APPLICATION_READY_EVENT" 

        ,

        // NOTE
        NEW_NOTE_VIEW_COMPONENT_READY   : "APPOFNOTE.NEW_NOTE_VIEW_COMPONENT_READY" ,
        LIST_BTN_CLICKED_EVENT          : "APPOFNOTE.LIST_BTN_CLICKED"              ,
        SAVE_NOTE_BTN_CLICKED_EVENT     : "APPOFNOTE.SAVE_NOTE_BTN_CLICKED_EVENT"   , 
        NOTE_SAVED_IN_LOCALSTORE        : "APPOFNOTE.NOTE_SAVED_IN_LOCALSTORE"      ,
        NOTE_UPDATED_IN_LOCALSTORE      : "APPOFNOTE.NOTE_UPDATED_IN_LOCALSTORE"    ,
        NOTE_DELETED_IN_LOCALSTORE      : "APPOFNOTE.NOTE_DELETED_IN_LOCALSTORE"    ,
        UPDATE_NOTE_BTN_CLICKED_EVENT   : "APPOFNOTE.UPDATE_NOTE_BTN_CLICKED_EVENT"
        ,

        // LIST 
        LIST_VIEW_COMPONENT_READY       : "APPOFNOTE.LIST_VIEW_COMPONENT_READY"     ,
        NEW_NOTE_BTN_CLICKED_EVENT      : "APPOFNOTE.NEW_NOTE_BTN_CLICKED_EVENT"    ,
        EDIT_NOTE_BTN_CLICKED_EVENT     : "APPOFNOTE.EDIT_NOTE_BTN_CLICKED_EVENT"   ,
        SELECTED_NOTE_CHANGED_EVENT     : "APPOFNOTE.SELECTED_NOTE_CHANGED_EVENT"   ,
        DELETE_NOTE_CONFIRMED_EVENT     : "APPOFNOTE.DELETE_NOTE_CONFIRMED_EVENT"

    }

    ,

    launch: function() {

        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Start Application
        APPOFNOTE.app.fireEvent(  APPOFNOTE.app.config.APPLICATION_READY_EVENT );

    }

    ,

    onUpdated: function() {

        Ext.Msg.confirm(

            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            
            function(buttonId) {
                
                if (buttonId === 'yes') {
                    window.location.reload();
                }

            }

        );
    }

});
