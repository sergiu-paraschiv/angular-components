import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGridHeaderComponent } from './t-grid-header.component';
import { Direction } from '../t-grid/t-grid.service';

describe('t-grid-header', () => {
  let component: TGridHeaderComponent;
  let fixture: ComponentFixture<TGridHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TGridHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: false },
    ];
    fixture.detectChanges();

    const columnElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('[data-test-id^="column-"]');
    expect(columnElements.length).toBe(1);
    expect(columnElements[0].textContent?.trim()).toBe('name');
  });

  it('should render sortable columns', () => {
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: true },
    ];
    fixture.detectChanges();

    const columnElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll(
        '[data-test-id^="column-sortable-"]'
      );
    expect(columnElements.length).toBe(1);
    expect(columnElements[0].textContent?.trim()).toBe('name');
  });

  it('should handle header clicks', () => {
    spyOn(component, 'onColumnClick');
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: true },
    ];
    fixture.detectChanges();

    const nameSortableActionElement: HTMLElement =
      fixture.nativeElement.querySelector(
        '[data-test-id="column-sortable-name"]'
      );
    nameSortableActionElement.dispatchEvent(new MouseEvent('click'));
    expect(component.onColumnClick).toHaveBeenCalledOnceWith(
      component.columns[0]
    );
  });

  it('should dispatch columnClick events', () => {
    spyOn(component.columnClick, 'next');
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: true },
    ];
    fixture.detectChanges();

    component.onColumnClick(component.columns[0]);

    expect(component.columnClick.next).toHaveBeenCalledOnceWith(
      component.columns[0].name
    );
  });

  it('should not dispatch columnClick events if sorting is disabled', () => {
    spyOn(component.columnClick, 'next');
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: true },
    ];
    component.disableSort = true;
    fixture.detectChanges();

    component.onColumnClick(component.columns[0]);

    expect(component.columnClick.next).not.toHaveBeenCalled();
  });

  it('should generate sortable column state', () => {
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: true },
    ];
    fixture.detectChanges();

    const columnState1 = component.getColumnSortState(component.columns[0]);
    expect(columnState1.sortingOn).toBeFalse();
    expect(columnState1.ascending).toBeFalse();
    expect(columnState1.descending).toBeFalse();

    component.sort = { property: 'property', direction: Direction.Ascending };
    fixture.detectChanges();

    const columnState2 = component.getColumnSortState(component.columns[0]);
    expect(columnState2.sortingOn).toBeTrue();
    expect(columnState2.ascending).toBeTrue();
    expect(columnState2.descending).toBeFalse();

    component.sort = { property: 'property', direction: Direction.Descending };
    fixture.detectChanges();

    const columnState3 = component.getColumnSortState(component.columns[0]);
    expect(columnState3.sortingOn).toBeTrue();
    expect(columnState3.ascending).toBeFalse();
    expect(columnState3.descending).toBeTrue();

    component.sort = {
      property: 'some-other-property',
      direction: Direction.Descending,
    };
    fixture.detectChanges();

    const columnState4 = component.getColumnSortState(component.columns[0]);
    expect(columnState4.sortingOn).toBeFalse();
    expect(columnState4.ascending).toBeFalse();
    expect(columnState4.descending).toBeFalse();
  });

  it('should react to column definition changes', () => {
    component.columns = [{ name: 'name', property: 'property' }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-test-id="column-0"]').textContent).toBe('name');

    fixture.componentRef.setInput('columns', [{ name: 'other name', property: 'property' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-test-id="column-0"]').textContent).toBe('other name');
  });
});
