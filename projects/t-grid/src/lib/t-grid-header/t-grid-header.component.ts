import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { TGridColumnDefinition } from '../t-grid-row/t-grid-row.component';
import { Sort } from '../t-grid/t-grid.component';

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

  @Output() columnClick = new EventEmitter<TGridColumnDefinition['name']>();

  onColumnClick(event: MouseEvent, column: TGridColumnDefinition) {
    event.preventDefault();
    this.columnClick.next(column.name);
  }

  getColumnSortClass(column: TGridColumnDefinition) {
    const classList: string[] = [];

    if (this.sort.property === column.property) {
      classList.push('sortingOn');
      classList.push(this.sort.direction);
    }

    return classList;
  }
}
