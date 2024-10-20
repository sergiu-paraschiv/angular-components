import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { TGridColumnDefinition } from '../t-grid-row/t-grid-row.component';
import { Direction, Sort } from '../t-grid/t-grid.component';

@Component({
  selector: '[t-grid-header]',
  standalone: true,
  imports: [],
  templateUrl: './t-grid-header.component.html',
  styleUrl: './t-grid-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TGridHeaderComponent {
  @Input({ required: true }) columns!: TGridColumnDefinition[];
  @Input({ required: true }) sort!: Sort;
  @Input({ required: true }) disableSort!: boolean;

  @Output() columnClick = new EventEmitter<TGridColumnDefinition['name']>();

  onColumnClick(column: TGridColumnDefinition) {
    if (!this.disableSort) {
      this.columnClick.next(column.name);
    }
  }

  getColumnSortState(column: TGridColumnDefinition) {
    const sortingOn = this.sort.property === column.property;
    return {
      sortingOn,
      ascending: sortingOn && this.sort.direction === Direction.Ascending,
      descending: sortingOn && this.sort.direction === Direction.Descending,
    };
  }
}
