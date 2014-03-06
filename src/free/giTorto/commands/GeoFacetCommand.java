package free.giTorto.commands;

import com.google.refine.commands.EngineDependentCommand;
import com.google.refine.model.AbstractOperation;
import com.google.refine.model.Project;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Giuliano Tortoreto
 */
public class GeoFacetCommand extends EngineDependentCommand {
    @Override
    protected AbstractOperation createOperation(Project project, HttpServletRequest request, JSONObject engineConfig) throws Exception {
        return null;
    }


}

