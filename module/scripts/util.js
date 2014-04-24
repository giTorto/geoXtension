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

    if (elt==null)
        return null;

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex];
}
