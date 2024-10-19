import { Component, Input, booleanAttribute, Inject } from '@angular/core';
import { ITColumn, T_COLUMN } from '../t-grid/t-column-base';

@Component({
  selector: 't-column',
  standalone: true,
  imports: []
})
export class TColumnComponent implements ITColumn {
  constructor(@Inject(T_COLUMN) private col: ITColumn) {

  }
  @Input({required: true}) name = '';
  @Input({required: true}) property = '';
  @Input({transform: booleanAttribute}) sortable = false;
}
