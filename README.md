geoXtension for OpenRefine
======================================

This is an Extension for OpenRefine.
This extension allows to:
- Show you **wkt objects on a map**
- Convert from **one projection to another**
- Create **WKT point from two columns** (one stands for the latitude and one stands for the longitude).
- **Facet** based on spatial reference:
   * by distance: given a selected point on the map and a column containing wkt object it shows the distance from each wkt point in the project from that point
   * by area: given selected areas on the map and a column containing wkt objects it shows the rows of the project that belong to that area and the rows that doesn't
   * by type: given a wkt columns it shows you the rows clusterized for the type

##INSTALLATION
0. Download and Install GEOS(3.4.2)
0. Download and Install Proj(4.8.0)
0. Download and Install GDAL(1.9.2) with GEOS support
0. Follow the steps at https://github.com/OpenRefine/OpenRefine/wiki/Installing-Extensions

##USAGE
0. Open or create a project
0. Click the small triangle before the column name and choose *Extract e-mails,urls,etx...*
0. Choose the interest operation

##LICENSE
This extension is provided free of charge under the MIT license.
