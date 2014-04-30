// Bind a method to an object and cache it
Object.defineProperty(Object.prototype, "geoLink", {
    value: function (methodName) {
        var boundName = "__geoLink__" + methodName;
        return this[boundName] || (this[boundName] = this[methodName].bind(this));
    },
});


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt == null)
        return null;

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex];
}

function circleToGeoJSON(layer){
    const d2r = Math.PI / 180;   // degrees to radians
    const r2d = 180 / Math.PI;   // radians to degrees
    const earthRadius = 6378000;
    const radius = layer.getRadius();
    const center = layer.getLatLng();
    var geoJson = {};
    var geometry = {};
    geometry["type"]="Polygon";
    geometry["coordinates"] = [];
    var lat_lng;
    var points = 64.0;

    var polygon_points = (radius/422);

    if(polygon_points > points)
        if (polygon_points>1024) //the limit is 1024 because of gdal have problem with polygons with more than 1024 points
            points = 1024;
        else
            points = polygon_points;

    var coordinates = [];
    var r_latitude = (radius/earthRadius) * r2d;
    var r_longitude = r_latitude / Math.cos(center.lat * d2r);

    for (var i=0; i < points+1; i++) // one extra here makes sure we connect the
    {
        var theta = (Math.PI * (i / (points/2)));
        lat_lng = [];
        lat_lng.push(center.lng + (r_longitude * Math.cos(theta))); // center lng + radius x * cos(theta)
        lat_lng.push(center.lat + (r_latitude * Math.sin(theta))); // center lat + radius y * sin(theta)
        coordinates.push(lat_lng);
    }

    if(coordinates[0] != coordinates[coordinates.length-1])
        coordinates.push(coordinates[0]);

    geometry["coordinates"].push(coordinates);
    geoJson["geometry"]=geometry;
    return geoJson;
}

