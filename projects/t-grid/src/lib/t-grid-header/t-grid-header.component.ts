import { Component, Input } from '@angular/core';
import { TGridColumnDefinition } from '../t-grid-row/t-grid-row.component';

@Component({
  selector: '[t-grid-header]',
  standalone: true,
  imports: [],
  templateUrl: './t-grid-header.component.html'
})
export class TGridHeaderComponent {
  @Input({required: true}) columns: TGridColumnDefinition[] = [];
}
