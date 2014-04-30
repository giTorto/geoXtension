package free.giTorto.singleton;

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
 * @author Giuliano Tortoreto
 */
public class CacheGeometries {
   private  LoadingCache<String,Vector<Geometry>> geometryCache;

   private CacheGeometries(){
       geometryCache = CacheBuilder.newBuilder()
               .maximumSize(512)
               .build(new CacheLoader<String, Vector<Geometry>>() {
                   @Override
                   public Vector<Geometry> load(String s) throws Exception {
                       return (stringToGeometries(s));
                   }
               });
   }

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

    static class SingletonHolder {
        final static CacheGeometries INSTANCE = new CacheGeometries();
    }

    public static CacheGeometries getInstance() {
        return SingletonHolder.INSTANCE;
    }

    public Vector<Geometry> get(String stringaGeometrie){
        try {
            return geometryCache.get(stringaGeometrie);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }
}
