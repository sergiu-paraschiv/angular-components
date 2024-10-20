import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorDirection, PaginationMetadata } from '../t-grid/t-grid.service';

@Component({
  selector: 't-grid-paginator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './t-grid-paginator.component.html',
})
export class TGridPaginatorComponent {
  @Input() pageSize: number = 0;
  @Input() totalItems: number = 0;
  @Input() hasPrev: boolean = false;
  @Input() hasNext: boolean = false;
  @Input() startIndex: number = 0;
  @Input() endIndex: number = 0;

  @Output() paginatorClick = new EventEmitter<PaginatorDirection>();
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly PAGE_SIZES = [
    10,
    25,
    50,
    100
  ];

  onPrevClick() {
    this.paginatorClick.next(PaginatorDirection.Prev);
  }

  onNextClick() { 
    this.paginatorClick.next(PaginatorDirection.Next);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSizeChange.next(pageSize);
  }
}
