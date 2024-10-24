import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGridRowComponent } from './t-grid-row.component';

describe('t-grid-row', () => {
  let component: TGridRowComponent;
  let fixture: ComponentFixture<TGridRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TGridRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render cells', () => {
    component.columns = [
      { name: 'bar', property: 'bar' },
      { name: 'foo', property: 'foo' },
      { name: 'foo', property: 'foo' },
      { name: 'bar', property: 'bar' },
    ];
    component.data = { foo: 1, bar: 0 };
    fixture.detectChanges();

    const cellElements: HTMLElement[] = fixture.nativeElement.querySelectorAll(
      '[data-test-id^="cell-"]'
    );
    expect(cellElements.length).toBe(4);
    expect(cellElements[0].textContent).toBe('0');
    expect(cellElements[1].textContent).toBe('1');
    expect(cellElements[2].textContent).toBe('1');
    expect(cellElements[3].textContent).toBe('0');
  });

  it('should react to data changes', () => {
    component.columns = [{ name: 'foo', property: 'foo' }];
    component.data = { foo: 0 };
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector(
      '[data-test-id="cell-0"]'
    );
    expect(cellElement.textContent).toBe('0');

    fixture.componentRef.setInput('data', { foo: 1 });
    fixture.detectChanges();
    expect(cellElement.textContent).toBe('1');
  });

  it('should render empty cells for unknown fields', () => {
    component.columns = [{ name: 'foo', property: 'foo' }, { name: 'bar', property: 'bar' }];
    component.data = { bar: 0 };
    fixture.detectChanges();

    const cellElements: HTMLElement[] = fixture.nativeElement.querySelectorAll(
      '[data-test-id^="cell-"]'
    );
    expect(cellElements[0].textContent).toBe('');
    expect(cellElements[1].textContent).toBe('0');
  });

  it('should render empty cells for undefined field values', () => {
    component.columns = [{ name: 'foo', property: 'foo' }];
    component.data = { foo: undefined };
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector(
      '[data-test-id="cell-0"]'
    );
    expect(cellElement.textContent).toBe('');
  });
});
