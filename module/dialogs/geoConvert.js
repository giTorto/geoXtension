function geoConvertDialog(column) {
    this.column = column;
}

geoConvertDialog.prototype = {
    init: function (callback) {
        var self = this,
            selectedServices = {},
            dialogElement = this.dialogElement = $(DOM.loadHTML("geo-extension", "dialogs/geoConvert.html"));
        var operazione = new String();

        /* Set labels */
        $('.column-name', dialogElement).text(this.column.name);

        /* Bind controls to actions */
        var controls = DOM.bind(this.dialogElement);
        controls.cancel.click(this.geoLink("hide"));

        controls.convert.click(function () {
            var from=$('#from_projection').val();
            var to =$('#to_projection').val();
            self.execute(from, to);
        });

        if (callback)
            callback.apply(self);

    },

    show: function () {
        this.init(function () {
            this.dialogLevel = DialogSystem.showDialog(this.dialogElement);
        });

        $('#from_projection').autocomplete({
            source: function(request, response){
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.grep( coord_ref_sistem, function( value ) {
                    return matcher.test(value.label) || matcher.test(value.code)
                }).slice(0,12)
                );
            },
            appendTo:"#fromwrapper"
        })


        $('#to_projection').autocomplete({
            source: function(request, response){
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.grep( coord_ref_sistem, function( value ) {
                    return matcher.test(value.label) || matcher.test(value.code)
                }).slice(0,12)
                );
            },
            appendTo:"#towrapper"
        })

    },

    hide: function () {
        DialogSystem.dismissUntil(this.dialogLevel - 1);
    },

    execute: function (from,to) {
        var data = {  };
        data["column"] = this.column.name;

        if ( from == to ){
            alert("You are converting from a standard projection to the same standard projection");
        }

        for(var i in coord_ref_sistem){
            if ( (String)(coord_ref_sistem[i].label).contains(from)) {
                data["from"] = coord_ref_sistem[i].code;
            }else if ((String)(coord_ref_sistem[i].label).contains(to) ) {
                data["to"] = coord_ref_sistem[i].code;
            }
        }

        Refine.postProcess('geo-extension', 'convertGeo', data, {},
            { rowsChanged: true, modelsChanged: true });
        this.hide();
    },

};



