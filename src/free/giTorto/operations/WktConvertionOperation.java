package free.giTorto.operations;

import com.google.refine.browsing.RowVisitor;
import com.google.refine.expr.EvalError;
import com.google.refine.model.*;
import com.google.refine.model.changes.CellChange;
import com.google.refine.operations.EngineDependentMassCellOperation;
import com.google.refine.operations.OperationRegistry;
import org.gdal.ogr.Geometry;
import org.gdal.osr.CoordinateTransformation;
import org.gdal.osr.SpatialReference;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONWriter;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

/**
 * @author Giuliano Tortoreto
 */
public class WktConvertionOperation extends EngineDependentMassCellOperation {
    final Column column;
    final HashMap<String,Object> data;
    final JSONObject engineConfig;
    final Project project;
    final CoordinateTransformation ct;

    public WktConvertionOperation(final Project project, final Column column, final HashMap<String, Object> data, final JSONObject engineConfig){
        super(engineConfig,column.getName(),true);
        this.engineConfig = engineConfig;
        this.data = data;
        this.column = column;
        this.project = project;

        //initializing the coordinate transformation
        SpatialReference from = new SpatialReference();
        SpatialReference to = new SpatialReference();
        from.ImportFromEPSG(Integer.parseInt((String)data.get("from")));
        to.ImportFromEPSG(Integer.parseInt((String)data.get("to")));
        this.ct = new CoordinateTransformation(from, to);
    }

    static public AbstractOperation reconstruct(Project project, JSONObject obj) throws Exception {
        JSONObject engineConfig = obj.getJSONObject("engineConfig");

        String columName = obj.getString("columnName");
        String from = obj.getString("from");
        String to = obj.getString("to");
        String comm = obj.getString("op");

        Column column = project.columnModel.getColumnByName(columName);
        HashMap<String,Object> dati = new HashMap<String, Object>();
        dati.put("from",from);
        dati.put("to",to);
        dati.put("command",comm);

        return new WktConvertionOperation( project, column, dati, engineConfig);
    }

    @Override
    protected RowVisitor createRowVisitor(Project project, List<CellChange> cellChanges, long historyEntryID) throws Exception {

        return new RowVisitor() {
            List<CellChange> cellChanges;
            int cellIndex;

            public RowVisitor init(int cellIndex,List<CellChange> cellChanges){
                this.cellIndex = cellIndex;
                this.cellChanges = cellChanges;
                return this;
            }

            @Override
            public void start(Project project) {
                // nothing to do
            }

            @Override
            public boolean visit(Project project, int rowIndex, Row row) {
                Cell cell = row.getCell(cellIndex);
                final Serializable cellValue = cell == null ? null : cell.value;
                final String text = cellValue == null ? "" : cellValue.toString().trim();
                Cell newCell;
                // Perform extraction if the text is not empty
                if (text.length() > 0) {
                    newCell = convert(text);
                }else{
                    return false;
                }

                if (!newCell.value.toString().trim().equals(text)){
                    CellChange cellChange = new CellChange(rowIndex, cellIndex, cell, newCell);
                    cellChanges.add(cellChange);
                }
                return false;
            }

            @Override
            public void end(Project project) {
                // nothing to do
            }
        }.init(column.getCellIndex(),cellChanges);
    }

    @Override
    protected String createDescription(Column column, List<CellChange> cellChanges) {
        return "Wkt Trasformation on " + cellChanges.size() +
                " cells in columnName " + column.getName()  ;
    }

    @Override
    protected String getBriefDescription(Project project) {
        return "Projection transform from "+ data.get("from") + " projection to " + data.get("to") +" on cells in columnName " + _columnName;
    }

    @Override
    public void write(JSONWriter writer, Properties options) throws JSONException {
        writer.object();
        writer.key("op"); writer.value(OperationRegistry.s_opClassToName.get(this.getClass()));
        writer.key("description"); writer.value(getBriefDescription(null));
        writer.key("engineConfig"); writer.value(getEngineConfig());
        writer.key("columnName"); writer.value(_columnName);
        writer.key("from"); writer.value(data.get("from"));
        writer.key("to"); writer.value(data.get("to"));
        writer.endObject();
    }

    /**
     * This function performs the trasformation between two different Spatial Reference Systems
     * @param cellVal the value to transform
     * @return the new cell or a cell containing an evaluation error
     */
    protected Cell convert(String cellVal) {
        Geometry from_geo = Geometry.CreateFromWkt(cellVal);

        try{
            from_geo.Transform(ct);
        }catch(Exception e){
            return (new Cell(new EvalError(e.getMessage()), null));
        }

        String result = from_geo.ExportToWkt();

        return new Cell(result, null);
    }

}