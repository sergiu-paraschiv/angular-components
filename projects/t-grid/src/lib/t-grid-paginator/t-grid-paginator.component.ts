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
import { TIconComponent } from '../t-icon/t-icon.component';

@Component({
  selector: 't-grid-paginator',
  standalone: true,
  imports: [FormsModule, NgForOf, TIconComponent],
  templateUrl: './t-grid-paginator.component.html',
  styleUrl: './t-grid-paginator.component.css',
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

  get pageSizes() {
    return [10, 25, 50, 100];
  };

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
