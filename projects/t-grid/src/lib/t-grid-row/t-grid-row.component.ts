import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ColumnDefinition, TGridRowData } from '../t-grid/t-grid.service';

@Component({
  selector: '[t-grid-row]',
  standalone: true,
  imports: [],
  templateUrl: './t-grid-row.component.html',
  styleUrl: './t-grid-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TGridRowComponent {
  @Input({ required: true }) data!: TGridRowData;
  @Input({ required: true }) columns!: ColumnDefinition[];
}
