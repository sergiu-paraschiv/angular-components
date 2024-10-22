import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TProgressComponent } from './t-progress.component';

describe('t-progress', () => {
  let component: TProgressComponent;
  let fixture: ComponentFixture<TProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TProgressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept radius >= 50', () => {
    component.radius = 100;
    fixture.detectChanges();
    expect(component.radius).toBe(100);
    
    component.radius = 49;
    fixture.detectChanges();
    expect(component.radius).toBe(50);
  });

  it('should accept 0 <= progress <= 100', () => {
    component.progress = 50;
    fixture.detectChanges();
    expect(component.progress).toBe(50);
    
    component.progress = -1;
    fixture.detectChanges();
    expect(component.progress).toBe(0);
    
    component.progress = 101;
    fixture.detectChanges();
    expect(component.progress).toBe(100);
  });

  it('should accept color', () => {
    component.color = 'foo';
    fixture.detectChanges();
    expect(component.color).toBe('foo');
  });

  it('should emit complete when progress is 100', () => {
    spyOn(component.complete, 'next');
    fixture.detectChanges();

    component.progress = 50;
    fixture.detectChanges();
    
    component.progress = 100;
    fixture.detectChanges();
    
    component.progress = 100;
    fixture.detectChanges();

    expect(component.complete.next).toHaveBeenCalledTimes(2);
  });

  it('should draw a SVG circle', () => {
    component.radius = 100;
    component.progress = 50;
    fixture.detectChanges();

    const svgElement: SVGElement = fixture.nativeElement.querySelector('svg g circle');
    expect(svgElement).toBeTruthy();
  });

  it('should draw SVG with width and height = 2 * radius', () => {
    component.radius = 100;
    component.progress = 50;
    fixture.detectChanges();

    const svgElement: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svgElement.style.width).toBe(component.radius * 2 + 'px');
    expect(svgElement.style.height).toBe(component.radius * 2 + 'px');
  });

  it('should compensate stroke width by scaling', () => {
    component.radius = 50;
    component.progress = 50;
    fixture.detectChanges();
    expect(component.svgStrokeWidth).toBe(5);
    expect(component.svgCircleRadius).toBe(47.5);
    
    component.radius = 100;
    fixture.detectChanges();
    expect(component.svgStrokeWidth).toBe(2.5);
    expect(component.svgCircleRadius).toBe(48.75);
  });

  it('should compute stroke-dasharray', () => {
    component.radius = 50;
    component.progress = 50;
    fixture.detectChanges();

    expect(component.strokeDasharray).toBe('149.2257 298.4513');

    component.progress = 51;
    fixture.detectChanges();

    expect(component.strokeDasharray).toBe('152.2102 298.4513');
  });
});
