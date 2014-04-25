/**
 * Created by giulian on 26/03/14.
 */
function geoAreaFacetDialog(column) {
    this.column = column;
    this.polygons = {};
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
        controls.ok.click(function() {
            self.run(this.column)
        });

        if (callback)
            callback.apply(self);

    },

    show: function () {
        var self = this;
        this.init(function () {
            this.dialogLevel = DialogSystem.showDialog(this.dialogElement);
        });

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
                    polyline:false,
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

                console.info(e);
                drawnItems.addLayer(layer);
            });

            map.on('draw:edited', function (e) {
                var layers = e.layers;
                var countOfEditedLayers = 0;
                layers.eachLayer(function(layer) {
                    countOfEditedLayers++;
                });
                console.log("Edited " + countOfEditedLayers + " layers");
            });

            L.DomUtil.get('changeColor').onclick = function () {
                drawControl.setDrawingOptions({ rectangle: { shapeOptions: { color: '#004a80' } } });
            };



    },

    hide: function () {
        DialogSystem.dismissUntil(this.dialogLevel - 1);
    },

    run: function (column) {
        var self = this;


        console.info(expression);
        ui.browsingEngine.addFacet(
            "range",
            {
                "name": self.column.name,
                "columnName": self.column.name,
                "expression": value,
                "mode": "range"
            }
        );

        this.hide();
    }

};
