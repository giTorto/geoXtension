function geoCoordToWktConvertDialog(column) {
    this.column = column;
}

geoCoordToWktConvertDialog.prototype = {
    init: function (callback) {
        var self = this,
            dialogElement = this.dialogElement = $(DOM.loadHTML("geo-extension", "dialogs/geoCoordToWktConvert.html"));

        /* Bind controls to actions */
        var controls = DOM.bind(this.dialogElement);
        controls.cancel.click(this.geoLink("hide"));
        controls.create.click(function(){
            self.execute();
        });

        if (callback)
            callback.apply(self);
    },

    show: function () {
        this.init(function () {
            this.dialogLevel = DialogSystem.showDialog(this.dialogElement);
        });
        var self = this;

        var selectLatitude = document.getElementById("latitude");
        var selectLongitude = document.getElementById("longitude");

        for (var i in theProject.columnModel.columns) {
            var optionLat = document.createElement("option");
            var optionLng = document.createElement("option");
            optionLng.value = theProject.columnModel.columns[i].name;
            optionLat.value = theProject.columnModel.columns[i].name;

            optionLng.text = theProject.columnModel.columns[i].name;
            optionLat.text = theProject.columnModel.columns[i].name;

            if (theProject.columnModel.columns[i].name.toString()==self.column.name) {
                optionLat.selected = "selected";
            }

            selectLongitude.add(optionLng);
            selectLatitude.add(optionLat);
        }


    },

    hide: function () {
        DialogSystem.dismissUntil(this.dialogLevel - 1);
    },

    execute: function () {
        var self = this;
        var data = {  };
        data["column"] = self.column.name;
        data["latitude"] = getSelectedText("latitude").value;
        data["longitude"] = getSelectedText("longitude").value;

        Refine.postProcess('geo-extension', 'convertLatLngToWKT', data, {},
            { rowsChanged: true, modelsChanged: true });
        this.hide();

    },

};

function swapValues() {
    var latVal = getSelectedText("latitude");
    var lngVal = getSelectedText("longitude");

    $('#latitude').find('option:contains(' + lngVal.value + ')').prop('selected', true);
    $('#longitude').find('option:contains(' + latVal.value + ')').prop('selected', true);
}