import { Direction, PaginatorDirection, TGridService } from './t-grid.service';

describe('TGridService', () => {
  let service: TGridService<any>;
  beforeEach(() => {
    service = new TGridService();
  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

  it('should sort columns', () => {
    service.columnDefintions = [
      { name: 'foo', property: 'foo', sortable: true },
    ];
    expect(service.onColumnSort('foo')).toBeTrue();
    expect(service.sort.property).toBe('foo');
    expect(service.sort.direction).toBe(Direction.Ascending);
  });

  it('should not sort columns if sorting is didabled', () => {
    service.columnDefintions = [
      { name: 'foo', property: 'foo', sortable: true },
    ];
    service.disableSort = true;
    expect(service.onColumnSort('foo')).toBeFalse();
  });

  it('should not sort columns that are unknown', () => {
    service.columnDefintions = [
      { name: 'foo', property: 'foo', sortable: false },
    ];
    expect(service.onColumnSort('bar')).toBeFalse();
  });

  it('should not sort columns that are not sortable', () => {
    service.columnDefintions = [
      { name: 'foo', property: 'foo', sortable: false },
    ];
    expect(service.onColumnSort('foo')).toBeFalse();
  });

  it('should change sorting direction', () => {
    service.columnDefintions = [
      { name: 'foo', property: 'foo', sortable: true },
    ];
    expect(service.onColumnSort('foo')).toBeTrue();
    expect(service.sort.direction).toBe(Direction.Ascending);
    expect(service.onColumnSort('foo')).toBeTrue();
    expect(service.sort.direction).toBe(Direction.Descending);
  });

  it('should reset sorting direction when changing column', () => {
    service.columnDefintions = [
      { name: 'foo', property: 'foo', sortable: true },
      { name: 'bar', property: 'bar', sortable: true },
    ];
    expect(service.onColumnSort('foo')).toBeTrue();
    expect(service.sort.direction).toBe(Direction.Ascending);
    expect(service.onColumnSort('bar')).toBeTrue();
    expect(service.sort.direction).toBe(Direction.Ascending);
    expect(service.onColumnSort('foo')).toBeTrue();
    expect(service.sort.direction).toBe(Direction.Ascending);
  });

  it('should paginate', () => {
    service.data = [{foo: 1}, {foo: 2}, {foo: 3}];
    service.onPageSizeChange(2);

    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeTrue();
    expect(service.pagination.currentPage).toBe(1);

    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeFalse();
    expect(service.pagination.currentPage).toBe(1);

    expect(service.onPaginationPageChange(PaginatorDirection.Prev)).toBeTrue();
    expect(service.pagination.currentPage).toBe(0);
  });

  it('should change page size', () => {
    service.onPageSizeChange(1);
    expect(service.pagination.pageSize).toBe(1);

    service.onPageSizeChange(null);
    expect(service.pagination.pageSize).toBeNull();
  });

  it('should preserve currentPage unless new page size is out of bounds', () => {
    service.data = [{foo: 1}, {foo: 2}, {foo: 3}, {foo: 4}];

    service.onPageSizeChange(2);
    expect(service.pagination.pageSize).toBe(2);
    expect(service.pagination.currentPage).toBe(0);

    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeTrue();
    expect(service.pagination.currentPage).toBe(1);

    service.onPageSizeChange(3);
    expect(service.pagination.currentPage).toBe(1);

    service.onPageSizeChange(4);
    expect(service.pagination.currentPage).toBe(0);
  });

  it('should not paginate if pageSize is null', () => {
    service.data = [{foo: 1}, {foo: 2}, {foo: 3}, {foo: 4}];

    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeFalse();
    expect(service.pagination.currentPage).toBe(0);

    expect(service.onPaginationPageChange(PaginatorDirection.Prev)).toBeFalse();
    expect(service.pagination.currentPage).toBe(0);
  });

  it('should not paginate outside of bounds', () => {
    service.data = [{foo: 1}, {foo: 2}];
    service.onPageSizeChange(1);

    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeTrue();
    expect(service.pagination.currentPage).toBe(1);

    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeFalse();
    expect(service.pagination.currentPage).toBe(1);

    expect(service.onPaginationPageChange(PaginatorDirection.Prev)).toBeTrue();
    expect(service.pagination.currentPage).toBe(0);

    expect(service.onPaginationPageChange(PaginatorDirection.Prev)).toBeFalse();
    expect(service.pagination.currentPage).toBe(0);
  });

  it('should expose paginated data', () => {
    service.data = [{foo: 1}, {foo: 2}];
    service.onPageSizeChange(1);

    expect(service.getVisibleData()).toEqual([{foo: 1}]);
    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeTrue();
    expect(service.getVisibleData()).toEqual([{foo: 2}]);
  });

  it('should expose pagination metadata', () => {
    service.data = [{foo: 1}, {foo: 2}];
    service.onPageSizeChange(1);

    expect(service.getPaginationMetadata().hasNext).toBeTrue();
    expect(service.getPaginationMetadata().hasPrev).toBeFalse();
    expect(service.getPaginationMetadata().startIndex).toBe(1);
    expect(service.getPaginationMetadata().endIndex).toBe(1);
    expect(service.getPaginationMetadata().totalItems).toBe(2);
    expect(service.getPaginationMetadata().pageSize).toBe(1);

    expect(service.onPaginationPageChange(PaginatorDirection.Next)).toBeTrue();

    expect(service.getPaginationMetadata().hasNext).toBeFalse();
    expect(service.getPaginationMetadata().hasPrev).toBeTrue();
    expect(service.getPaginationMetadata().startIndex).toBe(2);
    expect(service.getPaginationMetadata().endIndex).toBe(2);
    expect(service.getPaginationMetadata().totalItems).toBe(2);
    expect(service.getPaginationMetadata().pageSize).toBe(1);
  });

  // TODO: test sorting
});
