import { Component, Input, booleanAttribute } from '@angular/core';
import { NgIf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Direction, TGridComponent } from './t-grid.component';
import { TColumnBase } from './t-column-base';

@Component({
  selector: 't-column',
  standalone: true,
  template: ``,
  providers: [{ provide: TColumnBase, useExisting: MockTColumnComponent }],
})
class MockTColumnComponent extends TColumnBase {
  @Input({ required: true }) override name = '';
  @Input({ required: true }) override property = '';
  @Input({ transform: booleanAttribute }) override sortable = false;

  public avoidCollisionMockTarget1() {}
}

@Component({
  standalone: true,
  imports: [TGridComponent, MockTColumnComponent, NgIf],
  template: `
    <t-grid [data]="testData" [sortable]="enableSorting">
      <t-column
        name="bar-field"
        [property]="'bar'"
        [sortable]="true"
      ></t-column>
      <t-column name="foo-field" property="foo"></t-column>
      <t-column name="foo-field-2" property="foo" [sortable]="true"></t-column>
      <t-column
        name="bar-field"
        [property]="'bar'"
        [sortable]="false"
      ></t-column>

      <t-column
        *ngIf="includeFifthColumn"
        name="{{ fifthColumnName }}"
        [property]="'fifth'"
      ></t-column>
    </t-grid>
  `,
})
class TestHostComponent {
  testData: any[] = [];

  enableSorting = true;
  includeFifthColumn = false;
  fifthColumnName = 'fifth';

  pushThirdRow() {
    this.testData.push({ foo: 5, bar: 4 });
  }
}

describe('t-grid', () => {
  let hostComponent: TestHostComponent;
  let component: TGridComponent<any>;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TGridComponent, MockTColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query column definitions', () => {
    fixture.detectChanges();
    expect(component.columnDefintions.length).toBe(4);

    expect(component.columnDefintions[0].name).toBe('bar-field');
    expect(component.columnDefintions[0].property).toBe('bar');
    expect(component.columnDefintions[0].sortable).toBeTrue();

    // allow multiple columns
    expect(component.columnDefintions[1].name).toBe('foo-field');
    expect(component.columnDefintions[1].property).toBe('foo');
    expect(component.columnDefintions[1].sortable).toBeFalse();

    // allow same property to be used in multiple columns
    expect(component.columnDefintions[2].name).toBe('foo-field-2');
    expect(component.columnDefintions[2].property).toBe('foo');
    expect(component.columnDefintions[2].sortable).toBeTrue();

    // allow same property to be used in multiple columns with same name
    expect(component.columnDefintions[3].name).toBe('bar-field');
    expect(component.columnDefintions[3].property).toBe('bar');
    expect(component.columnDefintions[3].sortable).toBeFalse();
  });

  it('should react to column definition changes', () => {
    fixture.detectChanges();
    expect(component.columnDefintions.length).toBe(4);

    hostComponent.includeFifthColumn = true;
    fixture.detectChanges();
    expect(component.columnDefintions.length).toBe(5);
    expect(component.columnDefintions[4].name).toBe('fifth');

    hostComponent.fifthColumnName = 'other-name';
    fixture.detectChanges();
    expect(component.columnDefintions[4].name).toBe(
      hostComponent.fifthColumnName
    );

    hostComponent.includeFifthColumn = false;
    fixture.detectChanges();
    expect(component.columnDefintions.length).toBe(4);
  });

  it('should render header', () => {
    fixture.detectChanges();

    const theadColumnElement: HTMLElement = fixture.nativeElement.querySelectorAll('thead');
    expect(theadColumnElement).toBeTruthy();
  });

  it('should render body', () => {
    hostComponent.testData = [
      { foo: 1, bar: 0 },
      { foo: 3, bar: 2 },
    ];
    fixture.detectChanges();

    const tbodyRowElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tbodyRowElements.length).toBe(2);

    const cellElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('tbody tr td');
    expect(cellElements.length).toBe(8);
    expect(cellElements[0].textContent).toBe('0');
    expect(cellElements[1].textContent).toBe('1');
    expect(cellElements[2].textContent).toBe('1');
    expect(cellElements[3].textContent).toBe('0');
    expect(cellElements[4].textContent).toBe('2');
    expect(cellElements[5].textContent).toBe('3');
    expect(cellElements[6].textContent).toBe('3');
    expect(cellElements[7].textContent).toBe('2');
  });

  it('should render empty cells for unknown fields', () => {
    hostComponent.testData = [{ foo: 0 }];
    fixture.detectChanges();

    const cellElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('tbody tr td');
    expect(cellElements.length).toBe(4);
    expect(cellElements[0].textContent).toBe('');
    expect(cellElements[1].textContent).toBe('0');
  });

  it('should render empty cells for fields explicitly set to undefined', () => {
    hostComponent.testData = [{ bar: undefined }];
    fixture.detectChanges();

    const cellElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('tbody tr td');
    expect(cellElements.length).toBe(4);
    expect(cellElements[0].textContent).toBe('');
  });

  it('should react to data changes', () => {
    hostComponent.testData = [{ bar: 1 }];
    fixture.detectChanges();

    const cellElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('tbody tr td');
    expect(cellElements.length).toBe(4);
    expect(cellElements[0].textContent).toBe('1');

    hostComponent.testData = [{ bar: 2 }];
    fixture.detectChanges();

    expect(cellElements[0].textContent).toBe('2');
  });

  it('should react to data changes only when reference is changed, because of OnPush strategy', () => {
    hostComponent.testData = [{ bar: 1 }];
    fixture.detectChanges();

    const cellElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('tbody tr td');
    expect(cellElements.length).toBe(4);
    expect(cellElements[0].textContent).toBe('1');

    hostComponent.testData[0].bar = 2;
    fixture.detectChanges();

    expect(cellElements[0].textContent).toBe('1');
  });

  it('should emit SortChangeEvent', () => {
    spyOn(component.sortChange, 'next');
    fixture.detectChanges();

    component.onColumnClick(component.columnDefintions[0].name);

    expect(component.sortChange.next).toHaveBeenCalledOnceWith({
      property: 'bar',
      direction: Direction.Ascending,
    });
  });

  it('should not emit SortChangeEvent for columns that are not sortable', () => {
    spyOn(component.sortChange, 'next');
    fixture.detectChanges();

    component.onColumnClick(component.columnDefintions[1].name);

    expect(component.sortChange.next).not.toHaveBeenCalled();
  });

  it('should emit SortChangeEvent with changed direction', () => {
    const spy = spyOn(component.sortChange, 'next');
    fixture.detectChanges();

    component.onColumnClick(component.columnDefintions[0].name);
    component.onColumnClick(component.columnDefintions[0].name);

    expect(spy.calls.count()).toEqual(2);
    expect(spy.calls.argsFor(0)).toEqual([{
      property: 'bar',
      direction: Direction.Ascending,
    }]);
    expect(spy.calls.argsFor(1)).toEqual([{
      property: 'bar',
      direction: Direction.Descending,
    }]);
  });

  it('should emit SortChangeEvent with ascending direction when field changes', () => {
    const spy = spyOn(component.sortChange, 'next');
    fixture.detectChanges();

    component.onColumnClick(component.columnDefintions[0].name);
    component.onColumnClick(component.columnDefintions[2].name);
    component.onColumnClick(component.columnDefintions[0].name);

    expect(spy.calls.count()).toEqual(3);
    expect(spy.calls.argsFor(0)).toEqual([{
      property: 'bar',
      direction: Direction.Ascending,
    }]);
    expect(spy.calls.argsFor(1)).toEqual([{
      property: 'foo',
      direction: Direction.Ascending,
    }]);
    expect(spy.calls.argsFor(2)).toEqual([{
      property: 'bar',
      direction: Direction.Ascending,
    }]);
  });

  it('should allow disabling sorting', () => {
    spyOn(component.sortChange, 'next');
    hostComponent.enableSorting = false;
    fixture.detectChanges();

    component.onColumnClick(component.columnDefintions[0].name);

    expect(component.sortChange.next).not.toHaveBeenCalled();
  });
});
