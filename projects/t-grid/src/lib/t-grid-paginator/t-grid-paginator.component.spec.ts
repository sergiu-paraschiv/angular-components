import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TGridPaginatorComponent } from './t-grid-paginator.component';
import { PaginatorDirection } from '../t-grid/t-grid.service';

describe('t-grid-paginator', () => {
  let component: TGridPaginatorComponent;
  let fixture: ComponentFixture<TGridPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridPaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TGridPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render prev/next buttons', () => {
    fixture.detectChanges();

    const prevButtonElement: HTMLElement =
      fixture.nativeElement.querySelector('button.prev');
    expect(prevButtonElement).toBeTruthy();

    const nextButtonElement: HTMLElement =
      fixture.nativeElement.querySelector('button.next');
    expect(nextButtonElement).toBeTruthy();
  });

  it('should render page size select', () => {
    fixture.detectChanges();

    const pageSizeElement: HTMLElement =
      fixture.nativeElement.querySelector('select.page-size');
    expect(pageSizeElement).toBeTruthy();
  });

  it('should render page information', () => {
    component.startIndex = 3;
    component.endIndex = 2;
    component.totalItems = 1;
    fixture.detectChanges();

    const pageInfoElement: HTMLElement =
      fixture.nativeElement.querySelector('.page-info');
    expect(pageInfoElement).toBeTruthy();
    expect(pageInfoElement.textContent).toBe('3 - 2 of 1');
  });

  it('should render disabled prev/next buttons', () => {
    component.hasPrev = false;
    component.hasNext = false;
    fixture.detectChanges();

    const prevButtonElement: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.prev');
    expect(prevButtonElement.disabled).toBeTrue();

    const nextButtonElement: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.next');
    expect(nextButtonElement.disabled).toBeTrue();
  });

  it('should bind selected page size option', waitForAsync(async () => {
    component.pageSize = 10;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const pageSizeSelectedElement: HTMLSelectElement =
        fixture.nativeElement.querySelector('select.page-size');
      expect(pageSizeSelectedElement.value).toBe('10');

      const pageSizeSelectedOptionElement: HTMLOptionElement =
        fixture.nativeElement.querySelector('select.page-size option:checked');
      expect(pageSizeSelectedOptionElement.value).toBe('10');
    });
  }));

  it('should call onPageSizeChange on page size change', () => {
    spyOn(component, 'onPageSizeChange');

    const pageSizeSelectedElement: HTMLSelectElement =
      fixture.nativeElement.querySelector('select.page-size');

    pageSizeSelectedElement.value = pageSizeSelectedElement.options[2].value;
    pageSizeSelectedElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.onPageSizeChange).toHaveBeenCalledOnceWith('50');
  });

  it('should call onPrevClick on prev click', () => {
    spyOn(component, 'onPrevClick');

    const prevButtonElement: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.prev');

    prevButtonElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.onPrevClick).toHaveBeenCalledOnceWith();
  });

  it('should call onNextClick on next click', () => {
    spyOn(component, 'onNextClick');

    const nextButtonElement: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.next');

    nextButtonElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.onNextClick).toHaveBeenCalledOnceWith();
  });

  it('should dispatch pageSizeChange events', () => {
    spyOn(component.pageSizeChange, 'next');
    fixture.detectChanges();

    component.onPageSizeChange('10');

    expect(component.pageSizeChange.next).toHaveBeenCalledOnceWith(10);
  });

  it('should dispatch paginatorClick events', () => {
    const spy = spyOn(component.paginatorClick, 'next');
    fixture.detectChanges();

    component.onPrevClick();
    component.onNextClick();

    expect(spy.calls.all()[0].args).toEqual([PaginatorDirection.Prev]);
    expect(spy.calls.all()[1].args).toEqual([PaginatorDirection.Next]);
  });
});
