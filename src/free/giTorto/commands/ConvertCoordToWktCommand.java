package free.giTorto.commands;

import com.google.refine.commands.EngineDependentCommand;
import com.google.refine.model.AbstractOperation;
import com.google.refine.model.Project;
import free.giTorto.operations.CoordToWktOperation;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

/**
 * @author Giuliano Tortoreto
 */
public class ConvertCoordToWktCommand extends EngineDependentCommand {
    @Override
    protected AbstractOperation createOperation(Project project, HttpServletRequest request, JSONObject engineConfig) throws Exception {
        String columName = request.getParameter("column");
        HashMap<String,Object> data = new HashMap();
        data.put("latitude",request.getParameter("latitude"));
        data.put("longitude",request.getParameter("longitude"));

        return new CoordToWktOperation(project, engineConfig, columName, data, true);
    }
}
