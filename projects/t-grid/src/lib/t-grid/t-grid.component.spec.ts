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
    const spy = spyOn((<any>component).cd, 'markForCheck');

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

    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should render header', () => {
    fixture.detectChanges();

    const headerElement: HTMLElement =
      fixture.nativeElement.querySelectorAll('[data-test-id="header"]');
    expect(headerElement).toBeTruthy();
  });

  it('should render rows', () => {
    hostComponent.testData = [
      { foo: 1, bar: 0 },
      { foo: 3, bar: 2 },
    ];
    fixture.detectChanges();

    const rowElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('[data-test-id^="row-"]');
    expect(rowElements.length).toBe(2);
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

    expect(spy).toHaveBeenCalledTimes(3);
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

  it('should react to data changes only when reference is changed, because of OnPush strategy', () => {
    hostComponent.testData = [
      { foo: 1, bar: 0 },
    ];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[data-test-id^="row-"]').length).toBe(1);

    hostComponent.testData.push({ foo: 3, bar: 2 });
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelectorAll('[data-test-id^="row-"]').length).toBe(1);
  });
});
