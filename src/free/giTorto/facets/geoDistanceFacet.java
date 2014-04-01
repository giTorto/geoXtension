package free.giTorto.facets;

import com.google.refine.browsing.FilteredRecords;
import com.google.refine.browsing.FilteredRows;
import com.google.refine.browsing.RecordFilter;
import com.google.refine.browsing.RowFilter;
import com.google.refine.browsing.facets.RangeFacet;
import com.google.refine.browsing.filters.AnyRowRecordFilter;
import com.google.refine.browsing.filters.ExpressionNumberComparisonRowFilter;
import com.google.refine.browsing.util.ExpressionBasedRowEvaluable;
import com.google.refine.browsing.util.RowEvaluable;
import com.google.refine.model.Project;

/**
 * @author Giuliano Tortoreto
 */
public class geoDistanceFacet extends RangeFacet {

    @Override
    public void computeChoices(Project project, FilteredRows filteredRows) {

    }

    @Override
    public void computeChoices(Project project, FilteredRecords filteredRecords) {

    }

    protected RowEvaluable getRowEvaluable(Project project) {
        //to change
        return new ExpressionBasedRowEvaluable(_columnName, _cellIndex, _eval);
    }

    @Override
    public RowFilter getRowFilter(Project project) {
        if (_eval != null && _errorMessage == null && _selected) {
            return new ExpressionNumberComparisonRowFilter(
                    getRowEvaluable(project), _selectNumeric, _selectNonNumeric, _selectBlank, _selectError) {

                @Override
                protected boolean checkValue(double d) {
                    return d >= _from && d < _to;
                };
            };
        } else {
            return null;
        }
    }

    @Override
    public RecordFilter getRecordFilter(Project project) {
        RowFilter rowFilter = getRowFilter(project);
        return rowFilter == null ? null : new AnyRowRecordFilter(rowFilter);
    }

}
