import { Component, ChangeDetectionStrategy, ContentChildren, QueryList, Input, Inject } from '@angular/core';
import { TColumnComponent } from '../t-column/t-column.component';
import { TGridRowComponent, TGridColumnDefinition, TGridRowData } from '../t-grid-row/t-grid-row.component';
import { TGridHeaderComponent } from '../t-grid-header/t-grid-header.component';
import { ITColumn, T_COLUMN } from './t-column-base';



@Component({
  selector: 't-grid',
  standalone: true,
  imports: [TColumnComponent, TGridHeaderComponent, TGridRowComponent],
  templateUrl: './t-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TGridComponent<T extends TGridRowData> {
  @Input({required: true}) data: T[] = [];
  @ContentChildren(T_COLUMN) columns!: QueryList<ITColumn>;

  columnDefintions: TGridColumnDefinition[] = [];

  ngAfterContentInit() {
    this.columnDefintions = this.columns.map(column => ({
      name: column.name,
      property: column.property,
      sortable: column.sortable
    }));
  }
}
