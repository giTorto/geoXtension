package free.giTorto.functions;

import com.google.refine.expr.EvalError;
import com.google.refine.grel.ControlFunctionRegistry;
import com.google.refine.grel.Function;
import free.giTorto.singleton.CacheGeometries;
import org.gdal.ogr.Geometry;
import org.json.JSONException;
import org.json.JSONWriter;

import java.util.Iterator;
import java.util.Properties;
import java.util.Vector;

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
                CacheGeometries cache = CacheGeometries.getInstance();

                if (pointA.charAt(0) == '\"')
                    pointA.substring(1, pointA.length() - 1);

                if (pointB.charAt(0) == '\"')
                    pointB.substring(1, pointB.length() - 1);

                Vector<Geometry> Polygons = null;
                Geometry wkt;
                try {
                    if (pointA.charAt(0) == '{'){
                        wkt = Geometry.CreateFromWkt(pointB);
                        Polygons = cache.get(pointA);
                    }else if (pointB.charAt(0) == '{'){
                        wkt = Geometry.CreateFromWkt(pointA);
                        Polygons = cache.get(pointB);
                    }else{
                       return new EvalError("One of the parameter must be a Stringified json object contanining geojson object");
                    }

                    Iterator iterator = Polygons.iterator();
                    Geometry temp;
                    int i = 1;
                    while(iterator.hasNext()){

                        temp = (Geometry)iterator.next();

                        if (temp!=null && temp.Contains(wkt)){
                            if (Integer.toString(i).equals("11") || Integer.toString(i).equals("12")
                                || Integer.toString(i).equals("13") || Integer.toString(i).matches("(.*[4567890])"))
                                    return (i+"th Polygon");
                            else if (Integer.toString(i).contains("1"))
                                return (i+"st Polygon");
                            else if (Integer.toString(i).contains("2"))
                                return (i+"nd Polygon");
                            else if (Integer.toString(i).contains("3"))
                                return (i+"rd Polygon");
                        }

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

