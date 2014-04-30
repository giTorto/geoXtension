package free.giTorto.caches;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.gdal.ogr.Geometry;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.Vector;
import java.util.concurrent.ExecutionException;

/**
 * This class allows to cache geometries Vector given a string containing JSONObjects
 * @author Giuliano Tortoreto
 */
public class CachePolygons {
   private  LoadingCache<String,Vector<Geometry>> geometryCache;

   private CachePolygons(){
       geometryCache = CacheBuilder.newBuilder()
               .maximumSize(512)
               .build(new CacheLoader<String, Vector<Geometry>>() {
                   @Override
                   public Vector<Geometry> load(String s) throws Exception {
                       return (stringToGeometries(s));
                   }
               });
   }

    /**
     * This function, given a string returns the extracted Vector of Geometries
     * @param s is a string containing a JSONObject, which contains a list of JSONObject geometries
     * @return a geometries Vector
     */
    private Vector<Geometry> stringToGeometries (String s){
        Vector<Geometry> geometries = new Vector<Geometry>(1);
        try {
            JSONObject geom = new JSONObject(s);
            Iterator iterator = geom.keys();
            while(iterator.hasNext()){
                geometries.add(Geometry.CreateFromJson(geom.get(iterator.next().toString()).toString()));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return geometries;
    }

    /**
     * This class ensure the Thread safety
     */
    static class SingletonHolder {
        final static CachePolygons INSTANCE = new CachePolygons();
    }

    public static CachePolygons getInstance() {
        return SingletonHolder.INSTANCE;
    }

    /**
     * This function wraps the get function of the cache
     * @param stringaGeometrie the String to pass to the cache as a key
     * @return the geometry take from the cache
     */
    public Vector<Geometry> get(String stringaGeometrie){
        try {
            return geometryCache.get(stringaGeometrie);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }
}
