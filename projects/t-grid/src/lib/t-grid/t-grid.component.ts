import { Component, ChangeDetectionStrategy, ContentChildren, QueryList, Input, AfterContentInit } from '@angular/core';
import { TGridRowComponent, TGridColumnDefinition, TGridRowData } from '../t-grid-row/t-grid-row.component';
import { TGridHeaderComponent } from '../t-grid-header/t-grid-header.component';
import { TColumnBase } from './t-column-base';


@Component({
  selector: 't-grid',
  standalone: true,
  imports: [TGridHeaderComponent, TGridRowComponent],
  templateUrl: './t-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TGridComponent<T extends TGridRowData> implements AfterContentInit {
  @Input({required: true}) data: T[] = [];
  @ContentChildren(TColumnBase) columns!: QueryList<TColumnBase>;

  columnDefintions: TGridColumnDefinition[] = [];

  ngAfterContentInit() {
    this.columnDefintions = this.columns.map(column => ({
      name: column.name,
      property: column.property,
      sortable: column.sortable
    }));
  }
}
