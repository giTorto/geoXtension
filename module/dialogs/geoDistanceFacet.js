/**
 * Created by giulian on 26/03/14.
 */
function geoDistanceFacetDialog(column) {
    this.column = column;
    this.point = null;
}

geoDistanceFacetDialog.prototype = {
    init: function (callback) {
        var self = this,
            dialogElement = this.dialogElement = $(DOM.loadHTML("geo-extension", "dialogs/geoDistanceFacet.html"));

        /* Set labels */
        $('.column-name', dialogElement).text(this.column.name);

        /* Bind controls to actions */
        var controls = DOM.bind(this.dialogElement);
        controls.cancel.click(this.geoLink("hide"));
        controls.ok.click(function () {
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

        $.getScript("http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js", function () {

            // set up the map
            map = new L.Map('map').setView([47.505, 11.3], 5);


            //setting the tile layer
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map);


            function onMapClick(e) {
                self.point = e.latlng;
                document.getElementById("latChosen").value = self.point.lat;
                document.getElementById("lonChosen").value = self.point.lng;
            }

            map.on('click', onMapClick);
        })

    },

    hide: function () {
        DialogSystem.dismissUntil(this.dialogLevel - 1);
    },

    run: function (column) {
        var self = this;

        var expression = "value.distanceFromAPoint(\"POINT (" + self.point.lng + " " + self.point.lat + ")\")";
        console.info(expression);
        ui.browsingEngine.addFacet(
            "range",
            {
                "name": self.column.name,
                "columnName": self.column.name,
                "expression": expression,
                "mode": "range"
            }
        );

        this.hide();
    }

};
