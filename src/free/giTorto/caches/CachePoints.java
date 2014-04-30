package free.giTorto.caches;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.gdal.ogr.Geometry;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * @author Giuliano Tortoreto
 */
public class CachePoints {
    private LoadingCache<String,Geometry> geometryCache;

    /**
     * In this constructor is initilized the Cache, the expireAfterAccess of 500 Millisecond allows to add
     * the value for each row(not only the fixed one), in order to optimize the memory usage and the function
     * also when is called for a custom numeric facet.
     */
    private CachePoints(){
        geometryCache = CacheBuilder.newBuilder()
                .maximumSize(1024)
                .expireAfterAccess(500, TimeUnit.MILLISECONDS)
                .build(new CacheLoader<String, Geometry>() {
                    @Override
                    public Geometry load(String s) throws Exception {
                        return (Geometry.CreateFromWkt(s));
                    }
                });
    }

    /**
     * This class ensure the Thread safety
     */
    static class SingletonHolder {
        final static CachePoints INSTANCE = new CachePoints();
    }

    public static CachePoints getInstance() {
        return SingletonHolder.INSTANCE;
    }

    public Geometry get(String s){
        try {
            return geometryCache.get(s);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }
}
