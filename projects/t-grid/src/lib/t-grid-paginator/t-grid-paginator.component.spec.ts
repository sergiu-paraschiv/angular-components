import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGridPaginatorComponent } from './t-grid-paginator.component';

describe('TGridPaginatorComponent', () => {
  let component: TGridPaginatorComponent;
  let fixture: ComponentFixture<TGridPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridPaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TGridPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
