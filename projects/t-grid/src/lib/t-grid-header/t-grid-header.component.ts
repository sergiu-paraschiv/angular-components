import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ColumnDefinition, Direction, Sort } from '../t-grid/t-grid.service';

@Component({
  selector: '[t-grid-header]',
  standalone: true,
  imports: [],
  templateUrl: './t-grid-header.component.html',
  styleUrl: './t-grid-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TGridHeaderComponent {
  @Input({ required: true }) columns!: ColumnDefinition[];
  @Input({ required: true }) sort!: Sort;
  @Input({ required: true }) disableSort!: boolean;

  @Output() columnClick = new EventEmitter<ColumnDefinition['name']>();

  onColumnClick(column: ColumnDefinition) {
    if (!this.disableSort) {
      this.columnClick.next(column.name);
    }
  }

  getColumnSortState(column: ColumnDefinition) {
    const sortingOn = this.sort.property === column.property;
    return {
      sortingOn,
      ascending: sortingOn && this.sort.direction === Direction.Ascending,
      descending: sortingOn && this.sort.direction === Direction.Descending,
    };
  }
}
