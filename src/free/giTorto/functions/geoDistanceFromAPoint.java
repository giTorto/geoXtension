package free.giTorto.functions;

import com.google.refine.expr.EvalError;
import com.google.refine.grel.ControlFunctionRegistry;
import com.google.refine.grel.Function;
import free.giTorto.caches.CachePoints;
import org.gdal.ogr.Geometry;
import org.json.JSONException;
import org.json.JSONWriter;

import java.util.Properties;

/**
 * This is a function added at the Refine Expression Languages, and given two point returns
 * the distance between them
 * @author Giuliano Tortoreto
 */
public class geoDistanceFromAPoint implements Function {

    @Override
    public Object call(Properties bindings, Object[] args) {
        if (args.length == 2) {
            Object pointA = args[0];
            Object pointB = args[1];
            CachePoints cache = CachePoints.getInstance();

            if ((pointA instanceof String) && (pointB instanceof String)) {
                try {
                    Geometry a = Geometry.CreateFromWkt((String)pointA);
                    return a.Distance(cache.get((String)pointB));
                } catch (Exception e) {
                    return new EvalError(ControlFunctionRegistry.getFunctionName(this) + e.getMessage());
                }
            }


        }

        return new EvalError(ControlFunctionRegistry.getFunctionName(this) + " expects 2 strings, each containing a geometry");
    }

    @Override
    public void write(JSONWriter writer, Properties options) throws JSONException {
        writer.object();
        writer.key("description");
        writer.value("Returns the distance from two points");
        writer.key("params");
        writer.value("2 string");
        writer.key("returns");
        writer.value("number");
        writer.endObject();
    }
}
