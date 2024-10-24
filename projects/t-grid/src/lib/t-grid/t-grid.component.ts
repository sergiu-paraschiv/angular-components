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
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Observable, SubscriptionLike, isObservable } from 'rxjs';
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
  columnName: string;
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
  implements
    AfterContentInit,
    AfterContentChecked,
    OnInit,
    OnChanges,
    OnDestroy
{
  @ContentChildren(TColumnBase) private columns!: QueryList<TColumnBase>;

  private dataSubscription: SubscriptionLike | undefined;

  @Input({ required: true }) public set data(value: T[] | Observable<T[]>) {
    this.removeDataSubscription();

    if (!isObservable(value)) {
      this.gridService.data = value;
    } else {
      this.dataSubscription = value.subscribe((next) => {
        this.cd.markForCheck();
        this.gridService.data = next;
      });
    }
  }

  @Input({ transform: booleanAttribute }) sortable: boolean = true;
  @Input({ transform: numberAttribute }) pageSize: number | null = null;

  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  @Output() paginationChange = new EventEmitter<PaginationChangeEvent>();

  constructor(
    private cd: ChangeDetectorRef,
    public gridService: TGridService<T>
  ) {}

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
  }

  ngAfterContentInit(): void {
    this.refreshColumnDefinitions();
  }

  ngAfterContentChecked(): void {
    this.refreshColumnDefinitions();
  }

  ngOnDestroy(): void {
    this.removeDataSubscription();
  }

  refreshPagination() {
    this.gridService.onPageSizeChange(this.pageSize);
  }

  refreshSortable() {
    this.gridService.disableSort = !this.sortable;
  }

  refreshColumnDefinitions() {
    const newDefinitions = this.columns.map((column) => ({
      name: column.name,
      property: column.property,
      sortable: column.sortable,
    }));

    if (JSON.stringify(this.gridService.columnDefintions) !== JSON.stringify(newDefinitions)) {
      this.gridService.columnDefintions = newDefinitions;
      this.cd.markForCheck();
    }
  }

  onColumnClick(columnName: string) {
    if (this.gridService.onColumnSort(columnName)) {
      this.sortChange.next({
        direction: this.gridService.sort.direction,
        columnName,
      });
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

  private removeDataSubscription() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = undefined;
    }
  }
}
