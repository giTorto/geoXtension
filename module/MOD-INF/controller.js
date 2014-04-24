var logger = Packages.org.slf4j.LoggerFactory.getLogger("geo-extension"),
    refineServlet = Packages.com.google.refine.RefineServlet,
    operationRegistry = Packages.com.google.refine.operations.OperationRegistry,
    File = Packages.java.io.File,
    refineServlet = Packages.com.google.refine.RefineServlet;

function init() {
    var RS = Packages.com.google.refine.RefineServlet;

    var cacheFolder = new refineServlet().getCacheDir("geo-extension");

    //adding commands
    RS.registerCommand(module, "convertGeo", new Packages.free.giTorto.commands.ConvertProjectionCommand);
    RS.registerCommand(module, "convertLatLngToWKT", new Packages.free.giTorto.commands.ConvertCoordToWktCommand);
    RS.registerCommand(module, "showGeo", new Packages.free.giTorto.commands.ShowOnMapCommand);
    RS.registerCommand(module, "facetsGeo", new Packages.free.giTorto.commands.GeoFacetCommand);

    //adding operations
    operationRegistry.registerOperation(
        module, "WktConvertionOperation", Packages.free.giTorto.operations.WktConvertionOperation
    );
    operationRegistry.registerOperation(
        module, "CoordConvertionOperation", Packages.free.giTorto.operations.CoordToWktOperation
    );

    //adding functions
    Packages.com.google.refine.grel.ControlFunctionRegistry.registerFunction(
        "distanceFromAPoint", new Packages.free.giTorto.functions.geoDistanceFromAPoint());

    // Script files to inject into /project page
    var resourceManager = Packages.com.google.refine.ClientSideResourceManager;
    resourceManager.addPaths(
        "project/scripts",
        module,
        [
            "dialogs/geoConvert.js",
            "dialogs/geoCoordToWktConvert.js",
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
            "dialogs/geoCoordToWktConvert.less",
            "dialogs/geoConvert.less",
            "dialogs/about.less",
            "styles/dialogs.less",
            "styles/main.less",
        ]
    );
}
