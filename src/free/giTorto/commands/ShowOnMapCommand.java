package free.giTorto.commands;

import com.google.refine.ProjectManager;
import com.google.refine.browsing.Engine;
import com.google.refine.browsing.FilteredRows;
import com.google.refine.browsing.RowVisitor;
import com.google.refine.commands.Command;
import com.google.refine.model.Cell;
import com.google.refine.model.Column;
import com.google.refine.model.Project;
import com.google.refine.model.Row;
import org.gdal.ogr.Geometry;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;
import java.util.Vector;

/**
 * This is the Command thriggered on the initialization of the dialog
 * ShowOnMap
 * @author Giuliano Tortoreto
 */
public class ShowOnMapCommand extends Command {


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);

    }


    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Project project = getProject(request);
        ProjectManager.singleton.setBusy(true);

        JSONObject engineConfig;
        Engine engine = new Engine(project);
        Column column = project.columnModel.getColumnByName(request.getParameter("column"));
        int cellIndex = column.getCellIndex();

        //setting the mode
        String mode = request.getParameter("mode");
        Boolean onAll = true;
        if ("wys".equals(mode))
            onAll = false;

        Vector<Integer> cleanIndexes = null;
        //taking the indices if it's not on all operation
        if (!onAll) {
            String rowIndices = request.getParameter("rowIndices");
            String[] rowIndexes = rowIndices.split(" ");
            cleanIndexes = new Vector<Integer>(rowIndexes.length);
            for (int i = 0; i < rowIndexes.length; i++)
                cleanIndexes.add(Integer.parseInt(rowIndexes[i]));
        }

        try {
            //setting the engine
            engineConfig = getEngineConfig(request);
            engine.initializeFromJSON(engineConfig);

            //here the List of the wkt objects is filled using the rowvisitor
            Vector<String> wktObjects = new Vector<String>(5);
            FilteredRows filteredRows = engine.getAllFilteredRows();
            filteredRows.accept(project, createRowVisitor(project, cellIndex, wktObjects, cleanIndexes));


            JSONWriter writer = new JSONWriter(response.getWriter());

            //writing in the response
            writer.object();
            writer.key("wktObjects");
            writer.array();
            for (String wktObject : wktObjects) {
                writer.object();
                writer.key("geoFeature");
                writer.value(wktObject);
                writer.endObject();
            }
            writer.endArray();
            writer.endObject();

        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ProjectManager.singleton.setBusy(false);
        }
    }

    /**
     * This function returns the rowvisitor that allows to visit each cell and place all values
     * in the wktObjects according to the indexToTake
     *
     * @param project     the project we are working on
     * @param cellIndex   the cell index to check and parse
     * @param wktObjects  the container of values finded
     * @param indexToTake the index to check, if null it runs on all rows
     * @return a RowVisitor that visit each cell
     * @throws Exception
     */
    protected RowVisitor createRowVisitor(Project project, final int cellIndex, final Vector<String> wktObjects, final Vector<Integer> indexToTake) throws Exception {
        return new RowVisitor() {
            int cellIndex;
            Vector<Integer> indexToTake;
            Vector<String> wktObjects;
            String[] tempArray = new String[2];
            Geometry geo = null;
            JSONObject geoJson = null;

            public RowVisitor init(int cellIndex, Vector<String> wktObjects, Vector<Integer> indexToTake) {
                this.cellIndex = cellIndex;
                this.wktObjects = wktObjects;
                this.indexToTake = indexToTake;
                return this;
            }

            @Override
            public void start(Project project) {
                //nothing to do
            }

            @Override
            public boolean visit(Project project, int rowIndex, Row row) {
                //check if it's a visit on all rows or if it is only on the indexes that the user sees
                if (!(indexToTake == null) && !indexToTake.contains(rowIndex)) {
                    return false;
                }

                Cell cell = row.getCell(cellIndex);

                Serializable cellValue = cell == null ? null : cell.value;
                final String text = cellValue == null ? "" : cellValue.toString().trim();

                //the row index add
                tempArray[0] = String.valueOf(rowIndex);

                //the first column add
                cell = row.getCell(0);
                cellValue = cell == null ? null : cell.value;

                tempArray[1] = cellValue == null ? "" : cellValue.toString().trim();

                //the selected column add
                geoJson = new JSONObject();

                try {
                    geo = Geometry.CreateFromWkt(text);
                    if (geo == null)
                        return false;
                    //setting the geoJson feature
                    geoJson.put("type", "Feature");
                    geoJson.put("geometry", new JSONObject(geo.ExportToJson()));
                    geoJson.put("properties", new JSONObject("{\"message\": \"row: " + tempArray[0] + ", first column: " + tempArray[1] + " \" }"));
                    geoJson.put("id", rowIndex);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                if (geo != null) {
                    //converting geoJson to string
                    String result = geoJson.toString().replaceAll("(\\\\\")", "\"");
                    if (indexToTake == null || indexToTake.contains(rowIndex))
                        wktObjects.add(result);
                }

                return false;
            }

            @Override
            public void end(Project project) {
                //nothing to do
            }
        }.init(cellIndex, wktObjects, indexToTake);
    }
}
