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
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: false },
    ];
    fixture.detectChanges();

    const theadColumnElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('th');
    expect(theadColumnElements.length).toBe(1);
    expect(theadColumnElements[0].textContent?.trim()).toBe('name');
  });

  it('should render buttons for sortable columns', () => {
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: true },
    ];
    fixture.detectChanges();

    const theadColumnElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('th button');
    expect(theadColumnElements.length).toBe(1);
    expect(theadColumnElements[0].textContent?.trim()).toBe('name');
  });

  it('should handle header clicks', () => {
    spyOn(component, 'onColumnClick');
    component.sort = { property: undefined, direction: Direction.Ascending };
    component.columns = [
      { name: 'name', property: 'property', sortable: true },
    ];
    fixture.detectChanges();

    const theadColumnButtonElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('th button');

    theadColumnButtonElements[0].dispatchEvent(new MouseEvent('click'));
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

  it('should generate sortable column state usable for [class] mapping', () => {
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
});
