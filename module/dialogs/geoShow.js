/**
 * Created by giulian on 26/03/14.
 */
function geoShowDialog(column, mode) {
    this.column = column;
    this.mode = mode;
    this.responseGeo = null;
}

geoShowDialog.prototype = {
    init: function (callback) {
        var dialogElement = this.dialogElement = $(DOM.loadHTML("geo-extension", "dialogs/geoShow.html"));

        /* Set labels */
        $('.column-name', dialogElement).text(this.column.name);

        /* Bind controls to actions */
        var controls = DOM.bind(this.dialogElement);
        controls.cancel.click(this.geoLink("hide"));

        this.run(callback);

    },

    show: function () {
        var self = this;
        this.init(function () {
            this.dialogLevel = DialogSystem.showDialog(this.dialogElement);

            $.getScript("http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js", function () {
                var arrayJson = self.responseGeo.wktObjects;

                // set up the map
                map = new L.Map('map');

                $.getScript("https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js",
                    function () {
                        var markers = L.markerClusterGroup();
                        var geoData = {"type": "FeatureCollection",
                            "features": [
                            ]
                        };

                        for (var index = 0; index < arrayJson.length; index++){
                            geoData["features"].push(arrayJson[index].geoFeature);
                        }


                        var geoJsonLayer = L.geoJson(geoData, {
                            onEachFeature: function (feature, layer) {
                                layer.bindPopup(feature.properties.message);
                            }
                        });

                        //setting the tile layer
                        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                            maxZoom: 18
                        }).addTo(map);

                        markers.addLayer(geoJsonLayer);
                        map.addLayer(markers);
                        map.fitBounds(markers.getBounds());

                    });
            })
        })
    },

    hide: function () {
        DialogSystem.dismissUntil(this.dialogLevel - 1);
    },

    run: function (initCallback) {
        var self = this;
        var data = {  };
        var rows = theProject.rowModel.rows;
        data["column"] = this.column.name;
        data["mode"] = this.mode;
        if (this.mode != "all") {
            data["rowIndexes"] = rows[0].i;
            for (var index = 1; index < rows.length; index++)
                data["rowIndexes"] = data["rowIndexes"] + " " + rows[index].i;
        }

        callback = {
            "onDone": function (response) {
                self.responseGeo = response;
                if (initCallback)
                    initCallback.apply(self);
            }
        };

        Refine.postProcess('geo-extension', 'showGeo', data, {},
           {}, callback
        );

    }

};
