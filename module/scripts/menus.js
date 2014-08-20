/* Add menu to extension bar */
ExtensionBar.addExtensionMenu({
    id: "geo-extension",
    label: "geoXtension",
    submenu: [
        {
            id: "geo-extension/about",
            label: "About...",
            click: dialogHandler(geoAboutDialog)
        }
    ]
});

// Add submenu to column header menu 
DataTableColumnHeaderUI.extendMenu(function (column, columnHeaderUI, menu) {
    MenuSystem.appendTo(menu, "", [
        { /* separator */},
        {
            id: "geo-extension/about",
            label: "geo extension",
            submenu: [
                {
                    id: "geo-extension/convert",
                    label: "Convert",
                    submenu: [
                        {
                            id: "geo-extension/convertWkt",
                            label: "WKT to WKT (different projections)",
                            click: dialogHandler(geoConvertDialog, column)
                        },
                        {
                            id: "geo-extension/convertCoordToWkt",
                            label: "Latitude and Longitude to WKT point",
                            click: dialogHandler(geoCoordToWktConvertDialog, column)
                        }
                    ]

                },
                {
                    id: "geo-extension/visualize",
                    label: "Visualize wkt objects",
                    submenu: [
                        {
                            id: "geo-extension/showGeo",
                            label: "All",
                            click: dialogHandler(geoShowDialog, column, "all")
                        },
                        {
                            id: "geo-extension/showGeo",
                            label: "What you see",
                            click: dialogHandler(geoShowDialog, column, "wys")
                        }
                    ]
                },
                {
                    id: "geo-extension/facets",
                    label: "Facet by",
                    submenu: [
                        {
                            id: "geo-extension/facets/distance",
                            label: "Distance",
                            click: dialogHandler(geoDistanceFacetDialog, column)
                        },
                        {
                            id: "geo-extension/facets/area",
                            label: "Area",
                            click: dialogHandler(geoAreaFacetDialog, column)
                        },
                        {
                            id: "geo-extension/facets/type",
                            label: "Type",
                            click: function () {
                                ui.browsingEngine.addFacet(
                                    "list",
                                    {
                                        "name": column.name,
                                        "columnName": column.name,
                                        "expression": "grel:value.replace(/[^a-zA-Z]/,\"\")"
                                    }
                                )
                            }
                        },
                    ]
                },
            ]
        },
        {
            id : "geo-extension/try",
            label : "Mean",
            click : function () {new MeanDialog(column.name);}
        }
    ]);
});


function dialogHandler(dialogConstructor) {
    var dialogArguments = Array.prototype.slice.call(arguments, 1);

    function Dialog() {
        return dialogConstructor.apply(this, dialogArguments);
    }

    Dialog.prototype = dialogConstructor.prototype;
    return function () {
        new Dialog().show();
    };
}

