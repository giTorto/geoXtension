package free.giTorto.commands;

import com.google.refine.commands.EngineDependentCommand;
import com.google.refine.model.AbstractOperation;
import com.google.refine.model.Column;
import com.google.refine.model.Project;
import free.giTorto.operations.WktConvertionOperation;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

/**
 * This is the command thriggered by the ConvertProjectionDialog
 * @author Giuliano Tortoreto
 */
public class ConvertProjectionCommand extends EngineDependentCommand {
    @Override
    protected AbstractOperation createOperation(Project project, HttpServletRequest request, JSONObject engineConfig) throws Exception {
        String columName = request.getParameter("column");
        Column column = project.columnModel.getColumnByName(columName);
        HashMap<String, Object> data = new HashMap<String, Object>();

        data.put("from", request.getParameter("from"));
        data.put("to", request.getParameter("to"));
        data.put("command", request.getPathInfo().replaceAll("(/command/)", ""));

        return new WktConvertionOperation(project, column, data, engineConfig);
    }


}

