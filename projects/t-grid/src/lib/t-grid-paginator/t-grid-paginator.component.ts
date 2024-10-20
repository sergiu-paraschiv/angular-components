import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { PaginatorDirection } from '../t-grid/t-grid.service';

@Component({
  selector: 't-grid-paginator',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './t-grid-paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TGridPaginatorComponent {
  @Input() pageSize: number | null = null;
  @Input() totalItems: number = 0;
  @Input() hasPrev: boolean = false;
  @Input() hasNext: boolean = false;
  @Input() startIndex: number = 0;
  @Input() endIndex: number = 0;

  @Output() paginatorClick = new EventEmitter<PaginatorDirection>();
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly PAGE_SIZES = [2, 3, 4, 5, 10, 25, 50, 100];

  onPrevClick() {
    this.paginatorClick.next(PaginatorDirection.Prev);
  }

  onNextClick() {
    this.paginatorClick.next(PaginatorDirection.Next);
  }

  onPageSizeChange(pageSize: string) {
    this.pageSizeChange.next(parseInt(pageSize, 10) || 0);
  }
}
