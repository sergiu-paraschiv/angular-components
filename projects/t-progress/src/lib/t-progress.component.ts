import {
  Component,
  Input,
  numberAttribute,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

function minMaxValue(value: number, min?: number, max?: number) {
  let cleanValue = value;

  if (min !== undefined && value < min) {
    cleanValue = min;
  }

  if (max !== undefined && value > max) {
    cleanValue = max;
  }

  return cleanValue;
}

@Component({
  selector: 't-progress',
  standalone: true,
  imports: [],
  templateUrl: './t-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TProgressComponent {
  @Input({ required: true, transform: numberAttribute })
  get radius(): number {
    return this._radius;
  }
  set radius(value: number) {
    this._radius = minMaxValue(value, 50);
  }

  @Input({ required: true, transform: numberAttribute })
  get progress(): number {
    return this._progress;
  }
  set progress(value: number) {
    this._progress = minMaxValue(value, 0, 100);

    if (this._progress === 100) {
      this.complete.next();
    }
  }

  @Input({ required: true }) color!: string;

  private _radius = 0;
  private _progress = 0;

  // Width, in pixels, of the drawn line
  get STROKE_WIDTH() {
    return 5;
  }

  // This number HAS to match the value used in the viewBox (*2) cx, cy, and
  //   the rotation transform origin applied to the circle, found in the component template.
  get MAGIC_SVG_SCALE() {
    return 50;
  }

  // Since we up/downscale the SVG based on the desired displayed radius (in pixels),
  //   the width drawl line is affected too.
  // We can compensate by reducing the SVG stroke width proportionally.
  get svgStrokeWidth() {
    return this.STROKE_WIDTH * (this.MAGIC_SVG_SCALE / this._radius);
  }

  // Line is drawn on the "virtual" circle using the variable stroke we compute
  //   in svgStrokeWidth. Half of it is "inside" the circle and half is "outside".
  // We can compensate for this by adjusting the radius of the drawn circle.
  get svgCircleRadius() {
    return this.MAGIC_SVG_SCALE - this.svgStrokeWidth / 2;
  }

  // This computes the stroke-dasharray value for the SVG circle.
  // The classic circumference (C = 2πr) trigonometric formula is used for the second parameter.
  // The first parameter, stroke length, is computed as a percentage of the circumference
  //   and represents the "slice" of the circle we want to be displayed.
  // The drawn "slice" needs to be rotated 90 degreens counterclockwise because
  //   stroke-dasharray starts at three o'clock. We do that in the template with a SVG transform.
  get strokeDasharray() {
    const circumference = 2 * Math.PI * this.svgCircleRadius;
    const strokeLength = (this._progress / 100) * circumference;
    return `${strokeLength.toFixed(4)} ${circumference.toFixed(4)}`;
  }

  @Output() complete = new EventEmitter<void>();
}
