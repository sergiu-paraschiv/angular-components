import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type IconType = 'arrow'
type IconOrientation = 'left' | 'right' | 'up' | 'down'


// All SVG viewBoxes need to be `0 0 24 24`
const MAGIC_ICON_SIZE = 24;

@Component({
  selector: 't-icon',
  standalone: true,
  imports: [],
  templateUrl: './t-icon.component.html',
  styleUrl: './t-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TIconComponent {
  @Input({ required: true }) type!: IconType;
  @Input() orientation: IconOrientation = 'up';

  get transform() {
    const halfPoint = Math.trunc(MAGIC_ICON_SIZE / 2);

    // default orientation is up
    let rotation = 0;
    if (this.orientation === 'down') {
      rotation = 180;
    }
    else if (this.orientation === 'left') {
      rotation = 90;
    }
    else if (this.orientation === 'right') {
      rotation = -90;
    }

    return `rotate(${rotation} ${halfPoint} ${halfPoint})`;
  }
}
