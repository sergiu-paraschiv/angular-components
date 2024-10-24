import { Injectable } from '@angular/core';

export enum Direction {
  Ascending = 'ascending',
  Descending = 'descending',
}

export interface Sort {
  property: string | undefined;
  direction: Direction;
}

export enum PaginatorDirection {
  Prev = 'prev',
  Next = 'next',
}

export interface Pagination {
  currentPage: number;
  pageSize: number | null;
}

export interface PaginationMetadata {
  pageSize: number | null;
  totalItems: number;
  hasPrev: boolean;
  hasNext: boolean;
  startIndex: number;
  endIndex: number;
}

export interface ColumnDefinition {
  name: string;
  property: string;
  sortable?: boolean;
}

export interface TGridRowData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TGridService<T extends TGridRowData> {
  columnDefintions: ColumnDefinition[] = [];
  data: T[] = [];
  sort: Sort = { property: undefined, direction: Direction.Ascending };
  pagination: Pagination = { currentPage: 0, pageSize: null };
  disableSort: boolean = false;

  onColumnSort(columnName: keyof T): boolean {
    if (this.disableSort) {
      return false;
    }

    const columnDefinition = this.columnDefintions.find(
      (columnDefinition) => columnDefinition.name === columnName
    );
    if (!columnDefinition || !columnDefinition?.sortable) {
      return false;
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

    return true;
  }

  onPageSizeChange(pageSize: number | null) {
    if (pageSize === null) {
      this.pagination = {
        pageSize: null,
        currentPage: 0,
      };
    } else {
      const newPagination = {
        ...this.pagination,
        pageSize,
      };

      if (
        this.data.length > 0 &&
        newPagination.currentPage * newPagination.pageSize >= this.data.length
      ) {
        newPagination.currentPage = this.getLastPageIndex(
          this.data.length,
          newPagination.pageSize
        );
      }

      this.pagination = newPagination;
    }
  }

  onPaginationPageChange(paginatorDirection: PaginatorDirection) {
    if (this.pagination.pageSize === null) {
      return false;
    }

    const paginationMetadata = this.getPaginationMetadata();
    if (
      paginatorDirection === PaginatorDirection.Next &&
      !paginationMetadata.hasNext
    ) {
      return false;
    }
    if (
      paginatorDirection === PaginatorDirection.Prev &&
      !paginationMetadata.hasPrev
    ) {
      return false;
    }

    const newPage =
      this.pagination.currentPage +
      (paginatorDirection === PaginatorDirection.Next ? 1 : -1);

    const newPagination = {
      ...this.pagination,
      currentPage: newPage,
    };

    this.pagination = newPagination;
    return true;
  }

  getVisibleData() {
    if (this.pagination.pageSize === null) {
      return this.getSortedData();
    } else {
      return this.getSortedData().slice(
        this.pagination.currentPage * this.pagination.pageSize,
        (this.pagination.currentPage + 1) * this.pagination.pageSize
      );
    }
  }

  getPaginationMetadata() {
    const metadata: PaginationMetadata = {
      pageSize: this.pagination.pageSize,
      totalItems: this.data.length,
      hasPrev: false,
      hasNext: false,
      startIndex: 0,
      endIndex: this.data.length,
    };

    if (!this.pagination.pageSize) {
      return metadata;
    }

    const lastPage = this.getLastPageIndex(
      metadata.totalItems,
      this.pagination.pageSize
    );

    metadata.hasPrev = this.pagination.currentPage > 0;
    metadata.hasNext = this.pagination.currentPage < lastPage;

    metadata.startIndex =
      1 + this.pagination.currentPage * this.pagination.pageSize;

    metadata.endIndex = Math.min(
      metadata.startIndex - 1 + this.pagination.pageSize,
      metadata.totalItems
    );

    return metadata;
  }

  private getSortedData() {
    const sortProperty = this.sort.property;

    if (!sortProperty) {
      return this.data;
    } else {
      const sortedData = [...this.data].sort((a, b) => {
        const av = (a as any)[sortProperty];
        const bv = (b as any)[sortProperty];
        
        if (typeof av === 'string') {
          return av.localeCompare(bv);
        }
        else if (typeof bv === 'string') {
          return bv.localeCompare(av) * -1;
        }

        return av > bv ? 1 : av < bv ? -1 : 0;
      });

      if (this.sort.direction === Direction.Descending) {
        sortedData.reverse();
      }

      return sortedData;
    }
  }

  private getLastPageIndex(totalItems: number, pageSize: number) {
    return Math.ceil(totalItems / pageSize) - 1;
  }
}
