var logger = Packages.org.slf4j.LoggerFactory.getLogger("geo-extension"),
    refineServlet = Packages.com.google.refine.RefineServlet,
    File = Packages.java.io.File,
    refineServlet = Packages.com.google.refine.RefineServlet;

    function init() {
    var RS = Packages.com.google.refine.RefineServlet;

    var cacheFolder = new refineServlet().getCacheDir("geo-extension");

    RS.registerCommand(module,"convertGeo", new Packages.free.giTorto.commands.ConvertProjectionCommand);
    RS.registerCommand(module,"visualizeGeo", new Packages.free.giTorto.commands.ShowOnMapCommand);
    RS.registerCommand(module,"facetsGeo", new Packages.free.giTorto.commands.GeoFacetCommand);


       
    
    // Script files to inject into /project page


        var resourceManager = Packages.com.google.refine.ClientSideResourceManager;
        resourceManager.addPaths(
        "project/scripts",
        module,
        [
            "scripts/coordinate-ref-geo.js",
            "dialogs/geoConvert.js",
            "scripts/util.js",
            "dialogs/about.js",
            "scripts/config.js",
            "scripts/menus.js",
            "scripts/standards_projections.json.js"
        ]
    );
    
    // Style files to inject into /project page
    ClientSideResourceManager.addPaths(
        "project/styles",
        module,
        [
            "dialogs/geoConvert.less",
            "dialogs/about.less",
            "styles/dialogs.less",
            "styles/main.less",
        ]
    );
}
