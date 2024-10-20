import { Component, Input, booleanAttribute } from '@angular/core';
import { TColumnBase } from '../t-grid/t-column-base';

@Component({
  selector: 't-column',
  standalone: true,
  template: ``,
  providers: [{ provide: TColumnBase, useExisting: TColumnComponent }]
})
export class TColumnComponent extends TColumnBase {
  @Input({required: true}) override name = '';
  @Input({required: true}) override property = '';
  @Input({transform: booleanAttribute}) override sortable = false;
}
