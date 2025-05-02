import { Injectable } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class GridUtilsService {

  commonQtyColumnDefs: ColDef[] = [];
  qtyFieldNames: string[] = [];
  lst: any[];

  constructor() { }

  setCommonQtyColumnDef(columnDef: ColDef): ColDef {
    this.qtyFieldNames.push(columnDef.field);
    const commonQtyColumnDef = {
      ...columnDef,
      cellStyle: (params: any) => {
        if (params.node.rowPinned) {
          return {
            fontWeight: 'bold',
            backgroundColor: '#baeafc',
            display: 'flex',
            justifyContent: 'right',
          };
        } else {
          return {
            display: 'flex',
            justifyContent: 'right',
          };
        }
      }
    };
    this.commonQtyColumnDefs.push(commonQtyColumnDef);
    return commonQtyColumnDef;
  }

  calculateTotalQty(field: string, filteredRows: any[]): number {
    if (!filteredRows || filteredRows.length === 0) {
      return 0;
    }
    return filteredRows.reduce((acc, item) => acc + (item[field] || 0), 0);
  }

  setRecords(lst: any[]): void {
    this.lst = lst;
  }

  setPinnedBottomRow(gridApi: GridApi, propertyName?: string): void {
    if (!gridApi || !this.qtyFieldNames.length || !this.lst) {
      return;
    }

    // Get displayed rows from gridApi
    const filteredRows = [];
    for (let i = 0; i < gridApi.getDisplayedRowCount(); i++) {
      const rowNode = gridApi.getDisplayedRowAtIndex(i);
      if (rowNode && rowNode.data) {
        filteredRows.push(rowNode.data);
      }
    }

    const bottomRowData: any = {};
    this.qtyFieldNames.forEach(field => {
      bottomRowData[field] = this.calculateTotalQty(field, filteredRows);
    });

    // Get the footer with total rows count
    const footer = this.getTotalRowsFooter(gridApi, propertyName);

    // Ensure that each key from the footer is correctly assigned in the mergedBottomRowData
    const mergedBottomRowData = { ...bottomRowData, ...footer };

    // Override footer values in case they are present in bottomRowData
    Object.keys(bottomRowData).forEach(key => {
      if (bottomRowData[key] !== null) {
        mergedBottomRowData[key] = bottomRowData[key];
      }
    });

    // Set pinned bottom row data
    gridApi.setPinnedBottomRowData([mergedBottomRowData]);
  }

  getTotalRowsFooter(gridApi: any, propertyName?: string): any {
    let totalRows = 0;
    if (gridApi) {
      const rows = gridApi.getModel().rootNode.childrenAfterFilter;
      if (propertyName) {
        totalRows = rows.filter((node: any) => node.data[propertyName]).length;
      } else {
        totalRows = rows.length;
      }
    }

    // Get all columns dynamically
    const allColumns: any = gridApi ? gridApi.getColumnDefs() : [];

    if (!allColumns.length) {
      return {};
    }

    const firstColumnField = allColumns[0].field;

    const footer = {
      [firstColumnField]: `Rows: ${totalRows}`,
      ...allColumns.slice(1).reduce((acc, col) => {
        acc[col.field] = null;
        return acc;
      }, {})
    };

    return footer;
  }

  updateColumnDefsWithFooter(gridApi: GridApi, columnDefs: any[], propertyName?: string): any[] {
    const footer = this.getTotalRowsFooter(gridApi, propertyName);
    const updatedColumnDefs = [...columnDefs];
    gridApi.setPinnedBottomRowData([footer]);
    return updatedColumnDefs;
  }

  removePinnedBottomRow(gridApi: GridApi): void {
    if (gridApi) {
      gridApi.setPinnedBottomRowData([]);
    }
  }
}
