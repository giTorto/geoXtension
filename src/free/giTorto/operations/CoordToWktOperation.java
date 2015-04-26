package free.giTorto.operations;

import com.google.refine.browsing.Engine;
import com.google.refine.browsing.FilteredRows;
import com.google.refine.browsing.RowVisitor;
import com.google.refine.expr.EvalError;
import com.google.refine.history.Change;
import com.google.refine.history.HistoryEntry;
import com.google.refine.model.*;
import com.google.refine.model.changes.*;
import com.google.refine.operations.EngineDependentOperation;
import com.google.refine.operations.OperationRegistry;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONWriter;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Properties;
import java.util.Vector;
import java.util.regex.Pattern;


/**
 * @author Giuliano Tortoreto
 */
public class CoordToWktOperation extends EngineDependentOperation {
    final Project project;
    final JSONObject engineConfig;
    final String columnName;
    final HashMap<String,Object> data;
    final String newColumnName;

    public CoordToWktOperation(final Project project, JSONObject engineConfig, String columnName, HashMap<String, Object> data, boolean updateRowContextDependencies) {
        super(engineConfig);
        this.columnName = columnName;
        this.data = data;
        this.engineConfig = engineConfig;
        this.project = project;
        this.newColumnName = "WktObject of "+(String)data.get("latitude")+ "_" + (String)data.get("longitude");

    }

    static public AbstractOperation reconstruct(Project project, JSONObject obj) throws Exception {
        JSONObject engineConfig = obj.getJSONObject("engineConfig");

        String columName = obj.getString("columnName");
        String latitude = obj.getString("latitude");
        String longitude = obj.getString("longitude");

        HashMap<String,Object> dati = new HashMap<String, Object>();
        dati.put("longitude",longitude);
        dati.put("latitude",latitude);

        return new CoordToWktOperation(project, engineConfig, columName, dati, true);
    }


    protected RowVisitor createRowVisitor(Project project, Vector<CellAtRow> newCells) throws Exception {
        Column column = project.columnModel.getColumnByName(columnName);
        int latCell = project.columnModel.getColumnIndexByName((String)data.get("latitude"));
        int lngCell = project.columnModel.getColumnIndexByName((String)data.get("longitude"));

        return new RowVisitor() {
            int              latCell;
            int              lngCell;
            Cell             cell;
            Vector<CellAtRow>  cellsAtRows;
            Pattern pattern;
            String latitude;
            String longitude;
            CellAtRow newCell;

            public RowVisitor init(int latCell,int lngCell, Vector<CellAtRow> cellAtRows) {
                this.latCell = latCell;
                this.lngCell = lngCell;
                this.cellsAtRows = cellAtRows;
                pattern = Pattern.compile("([-]?[\\d]*([\\.,][\\d]+)?)");
                return this;
            }

            @Override
            public void start(Project project) {
                // nothing to do
            }

            @Override
            public void end(Project project) {
                // nothing to do
            }

            @Override
            public boolean visit(Project project, int rowIndex, Row row) {
                cell = row.getCell(latCell);
                Serializable cellValue = cell == null ? null : cell.value;
                latitude = cellValue == null ? "" : cellValue.toString().trim();
                latitude = latitude.replaceAll("[\\s\\+]","");

                cell = row.getCell(lngCell);
                cellValue = cell == null ? null : cell.value;
                longitude = cellValue == null ? "" : cellValue.toString().trim();
                longitude = longitude.replaceAll("[\\s\\+]","");

                if (!latitude.equals("") && !longitude.equals("") &&
                        pattern.matcher(latitude).matches() && pattern.matcher(longitude).matches()) {
                    newCell = new CellAtRow(rowIndex, new Cell("POINT (" + longitude + " " + latitude + ")", null));
                }else{
                    newCell = new CellAtRow(rowIndex, new Cell(new EvalError("The latitude or/and longitude given are not a valid number"), null));
                }


                cellsAtRows.add(rowIndex, newCell);

                return false;
            }
        }.init(latCell,lngCell, newCells);
    }

    @Override
    public void write(JSONWriter writer, Properties options) throws JSONException {
        writer.object();
        writer.key("op"); writer.value(OperationRegistry.s_opClassToName.get(this.getClass()));
        writer.key("description"); writer.value(getBriefDescription(null));
        writer.key("engineConfig"); writer.value(getEngineConfig());
        writer.key("columnName"); writer.value(columnName);
        writer.key("latitude"); writer.value(data.get("latitude"));
        writer.key("longitude"); writer.value(data.get("longitude"));
        writer.endObject();
    }

    @Override
    protected String getBriefDescription(Project project) {
        return "Create "+ newColumnName + " based on column " + data.get("latitude") +
                " and column " + data.get("longitude");
    }

    @Override
    protected HistoryEntry createHistoryEntry(Project project, long historyEntryID) throws Exception {
        Engine engine = createEngine(project);
        Column column = project.columnModel.getColumnByName(columnName);

        if (project.columnModel.getColumnByName(newColumnName) != null) {
            throw new Exception("Another columnName already named " + newColumnName);
        }

        Vector<CellAtRow> cellsAtRows = new Vector<CellAtRow>(project.rows.size());

        FilteredRows filteredRows = engine.getAllFilteredRows();
        filteredRows.accept(project, createRowVisitor(project, cellsAtRows));
        String description = createDescription(columnName, cellsAtRows);

        Change change = new ColumnAdditionChange(newColumnName, column.getCellIndex()+1, cellsAtRows);

        return new HistoryEntry(
                historyEntryID, project, description, this, change);
    }

    private String createDescription(String column, Vector<CellAtRow> cellsAtRows) {
        return "Creating a WKT-point from column " + data.get("latitude") + " and from " + data.get("longitude");
    }

}
