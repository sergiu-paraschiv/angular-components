import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TIconComponent } from './t-icon.component';

describe('TIconComponent', () => {
  let component: TIconComponent;
  let fixture: ComponentFixture<TIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
