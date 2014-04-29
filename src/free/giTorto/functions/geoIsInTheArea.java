package free.giTorto.functions;

import com.google.refine.expr.EvalError;
import com.google.refine.grel.ControlFunctionRegistry;
import com.google.refine.grel.Function;
import org.gdal.ogr.Geometry;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONWriter;

import java.util.Iterator;
import java.util.Properties;

/**
 * @Author Giuliano Tortoreto
 */
public class geoIsInTheArea implements Function {
    @Override
    public Object call(Properties bindings, Object[] args) {
        if (args.length == 2) {
            Object firstElem = args[0];
            Object secondElem = args[1];

            if ((firstElem instanceof String) && (secondElem instanceof String)) {
                String pointA = (String) firstElem;
                String pointB = (String) secondElem;

                if (pointA.charAt(0) == '\"')
                    pointA.substring(1, pointA.length() - 1);

                if (pointB.charAt(0) == '\"')
                    pointB.substring(1, pointB.length() - 1);

                JSONObject geoJsonPolygons = null;
                Geometry wkt;
                try {
                    if (pointA.charAt(0) == '{'){
                        geoJsonPolygons = new JSONObject(pointA);
                        wkt = Geometry.CreateFromWkt(pointB);
                    }else if (pointB.charAt(0) == '{'){
                        geoJsonPolygons = new JSONObject(pointB);
                        wkt = Geometry.CreateFromWkt(pointA);
                    }else{
                       return new EvalError("One of the parameter must be a Stringified json object contanining geojson object");
                    }

                    Iterator iterator = geoJsonPolygons.keys();

                    Geometry polygon;
                    int i = 0;
                    while (iterator.hasNext()){
                        polygon = Geometry.CreateFromJson(geoJsonPolygons.get((String)iterator.next()).toString());

                        if (polygon!=null && polygon.Contains(wkt))
                            return (i+" polygon drawn");

                        i++;
                    }

                    return ("Don't belong to any");

                } catch (Exception e) {
                    return new EvalError(ControlFunctionRegistry.getFunctionName(this) + e.getMessage());
                }
            }


        }

        return new EvalError(ControlFunctionRegistry.getFunctionName(this) + " expects 1 strings, containing a wkt and an array of geojson polygons");

    }


    @Override
    public void write(JSONWriter writer, Properties options) throws JSONException {
        writer.object();
        writer.key("description");
        writer.value("Returns which rows belong to the drawn area and which not");
        writer.key("params");
        writer.value("1 string and an array of GeoJSON");
        writer.key("returns");
        writer.value("Belongs or not");
        writer.endObject();
    }
}
