var logger = Packages.org.slf4j.LoggerFactory.getLogger("geo-extension"),
    refineServlet = Packages.com.google.refine.RefineServlet,
    operationRegistry = Packages.com.google.refine.operations.OperationRegistry,
    File = Packages.java.io.File,
    refineServlet = Packages.com.google.refine.RefineServlet;

function init() {
    var RS = Packages.com.google.refine.RefineServlet;

    var cacheFolder = new refineServlet().getCacheDir("geo-extension");

    RS.registerCommand(module, "convertGeo", new Packages.free.giTorto.commands.ConvertProjectionCommand);
    RS.registerCommand(module, "showGeo", new Packages.free.giTorto.commands.ShowOnMapCommand);
    RS.registerCommand(module, "facetsGeo", new Packages.free.giTorto.commands.GeoFacetCommand);

    operationRegistry.registerOperation(
        module, "ConvertionOperation", Packages.free.giTorto.operations.GeoConvertionOperation
    );

    // Script files to inject into /project page
    var resourceManager = Packages.com.google.refine.ClientSideResourceManager;
    resourceManager.addPaths(
        "project/scripts",
        module,
        [
            "dialogs/geoConvert.js",
            "scripts/util.js",
            "dialogs/about.js",
            "dialogs/geoShow.js",
            "dialogs/geoDistanceFacet.js",
            "scripts/config.js",
            "scripts/menus.js",
            "scripts/coordinate-ref-geo.js"
        ]
    );

    // Style files to inject into /project page
    ClientSideResourceManager.addPaths(
        "project/styles",
        module,
        [
            "dialogs/geoDistanceFacet.less",
            "dialogs/geoShow.less",
            "dialogs/geoConvert.less",
            "dialogs/about.less",
            "styles/dialogs.less",
            "styles/main.less",
        ]
    );
}
