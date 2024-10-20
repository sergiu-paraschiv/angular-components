import {
  Component,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  Input,
  AfterContentInit,
  AfterContentChecked,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  TGridRowComponent,
  TGridColumnDefinition,
  TGridRowData,
} from '../t-grid-row/t-grid-row.component';
import { TGridHeaderComponent } from '../t-grid-header/t-grid-header.component';
import { TColumnBase } from './t-column-base';

export enum Direction {
  Ascending = 'ascending',
  Descending = 'descending',
}

export interface Sort {
  property: string | undefined;
  direction: Direction;
}

export type SortChangeEvent = Sort

@Component({
  selector: 't-grid',
  standalone: true,
  imports: [TGridHeaderComponent, TGridRowComponent],
  templateUrl: './t-grid.component.html',
  styleUrl: './t-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TGridComponent<T extends TGridRowData>
  implements AfterContentInit, AfterContentChecked
{
  @ContentChildren(TColumnBase) private columns!: QueryList<TColumnBase>;
  @Input({ required: true }) data: T[] = [];

  @Output() sortChange = new EventEmitter<SortChangeEvent>();

  columnDefintions: TGridColumnDefinition[] = [];
  sort: Sort = { property: undefined, direction: Direction.Ascending };

  onColumnClick(columnName: string) {
    const columnDefinition = this.columnDefintions.find(columnDefinition => columnDefinition.name === columnName);
    if (!columnDefinition || !columnDefinition?.sortable) {
      return;
    }

    const newSort = {
      property: columnDefinition.property,
      direction:
        this.sort.property !== columnDefinition.property ||
        this.sort.direction === Direction.Descending
          ? Direction.Ascending
          : Direction.Descending,
    };

    this.sort = newSort;
    this.sortChange.next(newSort);
  }

  ngAfterContentInit() {
    this.refreshColumnDefinitions();
  }

  ngAfterContentChecked() {
    this.refreshColumnDefinitions();
  }

  private refreshColumnDefinitions() {
    this.columnDefintions = this.columns.map((column) => ({
      name: column.name,
      property: column.property,
      sortable: column.sortable,
    }));
  }
}
