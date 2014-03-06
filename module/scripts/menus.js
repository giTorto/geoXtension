/* Add menu to extension bar */
ExtensionBar.addExtensionMenu({
	id : "geo-extension",
	label : "geo extension",
	submenu : [
	
	{
		id : "geo-extension/about",
		label : "About...",
		click:dialogHandler(AboutDialog)
	} ]
});

// Add submenu to column header menu 
DataTableColumnHeaderUI.extendMenu(function(column, columnHeaderUI, menu) {
	MenuSystem.appendTo(menu, "", [ { /* separator */}, {
		id : "geo-extension/about",
		label : "geo extension",
        submenu : [
            {
                id : "geo-extension/convert",
                label : "Convert projection",
                click:dialogHandler(geoConvertDialog, column)
            },
            {
                id : "geo-extension/visualize",
                label : "Visualize",
                click:dialogHandler(geoAboutDialog)
            },
            {
                id : "geo-extension/facets",
                label : "Facet by",
                submenu : [
                    {
                        id : "geo-extension/facets/distance",
                        label : "Distance",
                        click:dialogHandler(geoAboutDialog)
                    },
                    {
                        id : "geo-extension/facets/area",
                        label : "Area",
                        click:dialogHandler(geoAboutDialog)
                    },
                    {
                        id : "geo-extension/facets/type",
                        label : "Type",
                        click:dialogHandler(geoAboutDialog)
                    },
                ]
            },
        ]
	} ]);
});



function dialogHandler(dialogConstructor) {
	var dialogArguments = Array.prototype.slice.call(arguments, 1);
	function Dialog() {
		return dialogConstructor.apply(this, dialogArguments);
	}
	Dialog.prototype = dialogConstructor.prototype;
	return function() {
		new Dialog().show();
	};
}

