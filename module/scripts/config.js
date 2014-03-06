var geoExtension = {};
geoExtension.commandPath = "/command/geo-extension/";

// Register a dummy reconciliation service that will be used to display
ReconciliationManager.registerService({
  name: "geo-extension",
  url: "geo-extension",
  // By setting the URL to "{{id}}",
  // this whole string will be replaced with the actual URL
  view: { url: "{{id}}" },
});
