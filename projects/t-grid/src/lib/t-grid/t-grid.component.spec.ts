import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs';
import { Component, Input, booleanAttribute } from '@angular/core';
import { NgIf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGridComponent } from './t-grid.component';
import { TGridService, Direction } from './t-grid.service';
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
  testData: any[] | Observable<any[]> = [];

  enableSorting = true;
  includeFifthColumn = false;
  fifthColumnName = 'fifth';

  pushThirdRow() {
    if (!isObservable(this.testData)) {
      this.testData.push({ foo: 5, bar: 4 });
    }
  }
}

describe('t-grid', () => {
  let hostComponent: TestHostComponent;
  let component: TGridComponent<any>;
  let fixture: ComponentFixture<TestHostComponent>;
  let tGridServiceStub: Partial<TGridService<any>>;

  beforeEach(async () => {
    tGridServiceStub = {
      data: [],
      pagination: { pageSize: 0, currentPage: 0 },
      sort: { property: undefined, direction: Direction.Ascending },
      onPageSizeChange: () => undefined,
      onColumnSort: (columnName: string) => {
        if (tGridServiceStub.disableSort) {
          return false;
        }

        if (columnName === 'bar-field') {
          tGridServiceStub.sort = {
            property: 'bar',
            direction: Direction.Ascending,
          };
          return true;
        }

        return false;
      },
      getVisibleData: () => tGridServiceStub.data as any[],
      getPaginationMetadata: () => ({
        totalItems: 0,
        pageSize: 0,
        hasPrev: false,
        hasNext: false,
        startIndex: 0,
        endIndex: 0,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TGridComponent, MockTColumnComponent],
      providers: [{ provide: TGridService, useValue: tGridServiceStub }],
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
    expect(component.gridService.columnDefintions.length).toBe(4);

    expect(component.gridService.columnDefintions[0].name).toBe('bar-field');
    expect(component.gridService.columnDefintions[0].property).toBe('bar');
    expect(component.gridService.columnDefintions[0].sortable).toBeTrue();

    // allow multiple columns
    expect(component.gridService.columnDefintions[1].name).toBe('foo-field');
    expect(component.gridService.columnDefintions[1].property).toBe('foo');
    expect(component.gridService.columnDefintions[1].sortable).toBeFalse();

    // allow same property to be used in multiple columns
    expect(component.gridService.columnDefintions[2].name).toBe('foo-field-2');
    expect(component.gridService.columnDefintions[2].property).toBe('foo');
    expect(component.gridService.columnDefintions[2].sortable).toBeTrue();

    // allow same property to be used in multiple columns with same name
    expect(component.gridService.columnDefintions[3].name).toBe('bar-field');
    expect(component.gridService.columnDefintions[3].property).toBe('bar');
    expect(component.gridService.columnDefintions[3].sortable).toBeFalse();
  });

  it('should react to column definition changes', () => {
    fixture.detectChanges();
    expect(component.gridService.columnDefintions.length).toBe(4);

    hostComponent.includeFifthColumn = true;
    fixture.detectChanges();
    expect(component.gridService.columnDefintions.length).toBe(5);
    expect(component.gridService.columnDefintions[4].name).toBe('fifth');

    hostComponent.fifthColumnName = 'other-name';
    fixture.detectChanges();
    expect(component.gridService.columnDefintions[4].name).toBe(
      hostComponent.fifthColumnName
    );

    hostComponent.includeFifthColumn = false;
    fixture.detectChanges();
    expect(component.gridService.columnDefintions.length).toBe(4);
  });

  it('should render header', () => {
    fixture.detectChanges();

    const theadColumnElement: HTMLElement =
      fixture.nativeElement.querySelectorAll('thead');
    expect(theadColumnElement).toBeTruthy();
  });

  it('should render body with rows', () => {
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

    component.onColumnClick(component.gridService.columnDefintions[0].name);

    expect(component.sortChange.next).toHaveBeenCalledOnceWith({
      columnName: 'bar-field',
      direction: Direction.Ascending,
    });
  });

  it('should allow disabling sorting', () => {
    spyOn(component.sortChange, 'next');
    hostComponent.enableSorting = false;
    fixture.detectChanges();

    component.onColumnClick(component.gridService.columnDefintions[0].name);

    expect(component.sortChange.next).not.toHaveBeenCalled();
  });

  it('should support Observable data', () => {
    const subject = new BehaviorSubject([]);
    spyOn(subject, 'subscribe');
    component.data = subject;

    expect(subject.subscribe).toHaveBeenCalled();
  });

  it('should react to Observable data change', () => {
    const testData1: any[] = [{ foo: 1 }];
    const testData2: any[] = [{ bar: 2 }];
    const subject = new BehaviorSubject(testData1);
    const spy = spyOn((<any>component).cd, 'markForCheck');

    hostComponent.testData = subject;
    fixture.detectChanges();

    expect(component.gridService.data).toBe(testData1);

    subject.next(testData2);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.gridService.data).toBe(testData2);
  });

  it('should unsubscribe from Observable when destroyed', () => {
    const subject = new BehaviorSubject([]);
    const subscription = new Subscription();
    const subscribeSpy = spyOn(subject, 'subscribe').and.returnValue(
      subscription
    );
    const unsubscribeSpy = spyOn(subscription, 'unsubscribe');

    component.data = subject;
    fixture.detectChanges();

    expect(subscribeSpy).toHaveBeenCalled();

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from Observable when changed', () => {
    const subject1 = new BehaviorSubject([]);
    const subscription1 = new Subscription();
    const subscribeSpy1 = spyOn(subject1, 'subscribe').and.returnValue(
      subscription1
    );
    const unsubscribeSpy1 = spyOn(subscription1, 'unsubscribe');

    const subject2 = new BehaviorSubject([]);
    const subscription2 = new Subscription();
    const subscribeSpy2 = spyOn(subject2, 'subscribe').and.returnValue(
      subscription2
    );

    component.data = subject1;
    fixture.detectChanges();

    expect(subscribeSpy1).toHaveBeenCalled();

    component.data = subject2;
    fixture.detectChanges();

    expect(unsubscribeSpy1).toHaveBeenCalledTimes(1);
    expect(subscribeSpy2).toHaveBeenCalled();
  });

  it('should unsubscribe from Observable when switching to plain data', () => {
    const subject = new BehaviorSubject([]);
    const subscription = new Subscription();
    const subscribeSpy = spyOn(subject, 'subscribe').and.returnValue(
      subscription
    );
    const unsubscribeSpy = spyOn(subscription, 'unsubscribe');

    component.data = subject;
    fixture.detectChanges();

    expect(subscribeSpy).toHaveBeenCalled();

    component.data = [];
    fixture.detectChanges();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });
});
