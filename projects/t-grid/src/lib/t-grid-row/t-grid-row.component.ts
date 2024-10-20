import { Component, Input } from '@angular/core';

export interface TGridRowData {
  [key: string]: any
}

export interface TGridColumnDefinition {
  name: string;
  property: string;
  sortable?: boolean;
}

@Component({
  selector: '[t-grid-row]',
  standalone: true,
  imports: [],
  templateUrl: './t-grid-row.component.html',
})
export class TGridRowComponent {
  @Input({required: true}) data: TGridRowData = {};
  @Input({required: true}) columns: TGridColumnDefinition[] = [];
}