function init() {
    var RS = Packages.com.google.refine.RefineServlet;
    RS.registerCommand(module,"geoThings", new Packages.free.giTorto.commands.GeoThingsCommand);
    
    // Script files to inject into /project page
    ClientSideResourceManager.addPaths(
        "project/scripts",
        module,
        [

        ]
    );
    
    // Style files to inject into /project page
    ClientSideResourceManager.addPaths(
        "project/styles",
        module,
        [

        ]
    );
}
