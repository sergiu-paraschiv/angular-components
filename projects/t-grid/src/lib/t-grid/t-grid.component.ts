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
  booleanAttribute,
  numberAttribute,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TColumnBase } from './t-column-base';
import { TGridRowComponent } from '../t-grid-row/t-grid-row.component';
import { TGridHeaderComponent } from '../t-grid-header/t-grid-header.component';
import { TGridPaginatorComponent } from '../t-grid-paginator/t-grid-paginator.component';
import {
  Direction,
  Pagination,
  PaginatorDirection,
  TGridRowData,
  TGridService,
} from './t-grid.service';

export type SortChangeEvent = {
  property: string;
  direction: Direction;
};

export type PaginationChangeEvent = Pagination;

@Component({
  selector: 't-grid',
  standalone: true,
  imports: [TGridHeaderComponent, TGridRowComponent, TGridPaginatorComponent],
  templateUrl: './t-grid.component.html',
  styleUrl: './t-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TGridComponent<T extends TGridRowData>
  implements AfterContentInit, AfterContentChecked, OnInit, OnChanges
{
  @ContentChildren(TColumnBase) private columns!: QueryList<TColumnBase>;
  @Input({ required: true }) data: T[] = [];
  @Input({ transform: booleanAttribute }) sortable: boolean = true;
  @Input({ transform: numberAttribute }) pageSize: number | null = null;

  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  @Output() paginationChange = new EventEmitter<PaginationChangeEvent>();

  constructor(public gridService: TGridService<T>) {}

  ngOnInit(): void {
    this.refreshPagination();
    this.refreshSortable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('pageSize' in changes) {
      this.refreshPagination();
    }

    if ('sortable' in changes) {
      this.refreshSortable();
    }

    if ('data' in changes) {
      this.refreshData();
    }
  }

  ngAfterContentInit(): void {
    this.refreshColumnDefinitions();
  }

  ngAfterContentChecked(): void {
    this.refreshColumnDefinitions();
  }

  refreshPagination() {
    this.gridService.onPageSizeChange(this.pageSize);
  }

  refreshSortable() {
    this.gridService.disableSort = !this.sortable;
  }

  refreshColumnDefinitions() {
    this.gridService.columnDefintions = this.columns.map((column) => ({
      name: column.name,
      property: column.property,
      sortable: column.sortable,
    }));
  }

  refreshData() {
    this.gridService.data = this.data;
  }

  onColumnClick(columnName: string) {
    if (this.gridService.onColumnSort(columnName)) {
      const property = this.gridService.sort.property;
      if (property) {
        this.sortChange.next({
          ...this.gridService.sort,
          property,
        });
      }
    }
  }

  onPaginatorClick(paginatorDirection: PaginatorDirection) {
    this.gridService.onPaginationPageChange(paginatorDirection);
    this.paginationChange.next(this.gridService.pagination);
  }

  onPageSizeChange(pageSize: number) {
    this.gridService.onPageSizeChange(pageSize);
    this.paginationChange.next(this.gridService.pagination);
  }
}
