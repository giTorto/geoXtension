var logger = Packages.org.slf4j.LoggerFactory.getLogger("geo-extension"),
    refineServlet = Packages.com.google.refine.RefineServlet,
    operationRegistry = Packages.com.google.refine.operations.OperationRegistry;
function init() {
    var RS = Packages.com.google.refine.RefineServlet;

    //var cacheFolder = new refineServlet().getCacheDir("geo-extension");

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
    Packages.com.google.refine.grel.ControlFunctionRegistry.registerFunction(
        "isInTheArea", new Packages.free.giTorto.functions.geoIsInTheArea());

    // Script files to inject into /project page
    var resourceManager = Packages.com.google.refine.ClientSideResourceManager;
    resourceManager.addPaths(
        "project/scripts",
        module,
        [
            "dialogs/geoAreaFacet.js",
            "dialogs/geoConvert.js",
            "dialogs/geoCoordToWktConvert.js",
            "dialogs/about.js",
            "dialogs/geoShow.js",
            "dialogs/geoDistanceFacet.js",
            "scripts/config.js",
            "scripts/menus.js",
            "scripts/coordinate-ref-geo.js",
            "scripts/util.js",

            //import for Leaflet.draw   
            "leaflet.draw/examples/libs/leaflet-src.js",
            "leaflet.draw/src/Leaflet.draw.js",
            "leaflet.draw/src/edit/handler/Edit.Poly.js",
            "leaflet.draw/src/edit/handler/Edit.SimpleShape.js",
            "leaflet.draw/src/edit/handler/Edit.Circle.js",
            "leaflet.draw/src/edit/handler/Edit.Rectangle.js",

            "leaflet.draw/src/draw/handler/Draw.Feature.js",
            "leaflet.draw/src/draw/handler/Draw.Polyline.js",
            "leaflet.draw/src/draw/handler/Draw.Polygon.js",
            "leaflet.draw/src/draw/handler/Draw.SimpleShape.js",
            "leaflet.draw/src/draw/handler/Draw.Rectangle.js",
            "leaflet.draw/src/draw/handler/Draw.Circle.js",
            "leaflet.draw/src/draw/handler/Draw.Marker.js",

            "leaflet.draw/src/ext/LatLngUtil.js",
            "leaflet.draw/src/ext/GeometryUtil.js",
            "leaflet.draw/src/ext/LineUtil.Intersect.js",
            "leaflet.draw/src/ext/Polyline.Intersect.js",
            "leaflet.draw/src/ext/Polygon.Intersect.js",

            "leaflet.draw/src/Control.Draw.js",
            "leaflet.draw/src/Tooltip.js",
            "leaflet.draw/src/Toolbar.js",

            "leaflet.draw/src/draw/DrawToolbar.js",
            "leaflet.draw/src/edit/EditToolbar.js",
            "leaflet.draw/src/edit/handler/EditToolbar.Edit.js",
            "leaflet.draw/src/edit/handler/EditToolbar.Delete.js"
        ]
    );

    // Style files to inject into /project page
    ClientSideResourceManager.addPaths(
        "project/styles",
        module,
        [
            "dialogs/geoAreaFacet.less",
            "dialogs/geoDistanceFacet.less",
            "dialogs/geoShow.less",
            "dialogs/geoCoordToWktConvert.less",
            "dialogs/geoConvert.less",
            "dialogs/about.less",
            "styles/dialogs.less",
            "styles/main.less",
            //import to use leaflet.draw
            //"leaflet.draw/examples/libs/leaflet.css",
            "leaflet.draw/dist/leaflet.draw.css"
        ]
    );
}
