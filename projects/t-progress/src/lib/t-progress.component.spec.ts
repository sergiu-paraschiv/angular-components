import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TProgressComponent } from './t-progress.component';

describe('TProgressComponent', () => {
  let component: TProgressComponent;
  let fixture: ComponentFixture<TProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
