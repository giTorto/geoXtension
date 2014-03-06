function geoAboutDialog() {}

geoAboutDialog.prototype = {
  init: function () {
    this.dialogElement = $(DOM.loadHTML("geo-extension", "dialogs/about.html"));
    console.log(this.dialogElement);
    var controls = DOM.bind(this.dialogElement);
    controls.close.click(this.link("hide"));
  },
  
  show: function () {
    this.init();
    this.dialogLevel = DialogSystem.showDialog(this.dialogElement);
  },
  
  hide: function () {
    DialogSystem.dismissUntil(this.dialogLevel - 1);
  },
};
