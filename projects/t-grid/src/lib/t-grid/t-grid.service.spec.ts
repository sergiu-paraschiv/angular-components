import { Direction, TGridService } from './t-grid.service';

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
});
