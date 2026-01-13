
export function mapToApiFormat(notebook) {
    if (!notebook || !notebook.cells) {
        return { cells: [] };
    }

    const mappedCells = notebook.cells.map(cell => ({
        cell_type: cell.cell_type,
        cell_name: cell.cell_name, 
        source: cell.source,
        execution_count: cell.execution_count || 0,
        metadata: cell.metadata || {},
    }));

    return { cells: mappedCells };
}
