/**
 * @author Giuliano Tortoreto
 */
function geoAreaFacetDialog(column) {
    this.column = column;
    this.polygons = {};
    this.polygonCounter = 0;
}

geoAreaFacetDialog.prototype = {
    init: function (callback) {
        var self = this,
            dialogElement = this.dialogElement = $(DOM.loadHTML("geo-extension", "dialogs/geoAreaFacet.html"));

        /* Set labels */
        $('.column-name', dialogElement).text(this.column.name);

        /* Bind controls to actions */
        var controls = DOM.bind(this.dialogElement);
        controls.cancel.click(this.geoLink("hide"));
        controls.ok.click(function () {
            self.run();
        });

        if (callback)
            callback.apply(self);

    },

    show: function () {
        var self = this;
        this.init(function () {
            this.dialogLevel = DialogSystem.showDialog(this.dialogElement);
        });

        $.getScript("http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js", function () {
            $.getScript("https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.js",
                function () {
                    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
                    map = new L.Map('map', {layers: [osm], center: new L.LatLng(45.234, 11.324), zoom: 7 });

                    var drawnItems = new L.FeatureGroup();
                    map.addLayer(drawnItems);

                    // Set the title to show on the polygon button
                    L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a sexy polygon!';

                    var drawControl = new L.Control.Draw({
                        position: 'topright',
                        draw: {
                            polyline: false,
                            polygon: {
                                allowIntersection: false,
                                showArea: true,
                                drawError: {
                                    color: '#b00b00',
                                    timeout: 1000
                                },
                                shapeOptions: {
                                    color: '#bada55'
                                }
                            },
                            circle: {
                                shapeOptions: {
                                    color: '#662d91'
                                }
                            },
                            marker: false
                        },
                        edit: {
                            featureGroup: drawnItems,
                            remove: false
                        }
                    });
                    map.addControl(drawControl);

                    map.on('draw:created', function (e) {
                        var type = e.layerType,
                            layer = e.layer;

                        var json = layer.toGeoJSON();
                        if (type.toLowerCase().contains("circle")) {
                            json = circleToGeoJSON(layer);
                            var circle = {}
                            json["type"] = "Feature";
                            json["id"] = "5657";
                            json["properties"] = {};
                            L.geoJson(json, {
                                style: function (feature) {
                                    return {color: "red"};
                                }}).addTo(map);
                        }
                        self.polygons[self.polygonCounter++] = json.geometry;
                        drawnItems.addLayer(layer);
                    });

                    map.on('draw:edited', function (e) {
                        var layers = e.layers;
                        var countOfEditedLayers = 0;
                        layers.eachLayer(function (layer) {
                            countOfEditedLayers++;
                        });
                        console.log("Edited " + countOfEditedLayers + " layers");
                    });

                    L.DomUtil.get('changeColor').onclick = function () {
                        drawControl.setDrawingOptions({ rectangle: { shapeOptions: { color: '#004a80' } } });
                    };

                });

        });
    },

    hide: function () {
        DialogSystem.dismissUntil(this.dialogLevel - 1);
    },

    run: function () {
        var self = this;
        var jsonToString = JSON.stringify(self.polygons);
        var expression = "value.isInTheArea(\"" + jsonToString.replace(/"/g, "\\\"") + "\")";
        ui.browsingEngine.addFacet(
            "list",
            {
                "name": self.column.name,
                "columnName": self.column.name,
                "expression": expression
            }
        );

        this.hide();
    }

};
