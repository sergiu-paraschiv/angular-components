import { Component, Input, booleanAttribute, Inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGridComponent } from './t-grid.component';
import { TColumnBase } from './t-column-base';

@Component({
  selector: 't-column',
  standalone: true,
  template: ``,
  providers: [{ provide: TColumnBase, useExisting: MockTColumnComponent }]
})
class MockTColumnComponent extends TColumnBase {
  @Input({required: true}) override name = '';
  @Input({required: true}) override property = '';
  @Input({transform: booleanAttribute}) override sortable = false;

  public avoidCollisionMockTarget1() {}
}

@Component({
  standalone: true,
  imports: [TGridComponent, MockTColumnComponent],
  template: `
<t-grid [data]="testData">
  <t-column name="bar-field" [property]="'bar'" [sortable]="true"></t-column>
  <t-column name="foo-field" property="foo"></t-column>
  <t-column name="foo-field-2" property="foo" [sortable]="true"></t-column>
  <t-column name="bar-field" [property]="'bar'" [sortable]="false"></t-column>
</t-grid>
`,
})
class TestHostComponent {
  @Input({required: true}) testData: any[] = [];
}

describe('TGridComponent', () => {
  let component: TGridComponent<any>;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TGridComponent, MockTColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query column definitions', () => {
    fixture.detectChanges();

    expect(component.columns.length).toBe(4);

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
});
