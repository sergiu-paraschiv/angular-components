import { Component } from '@angular/core';
import { TGridComponent, TColumnComponent, SortChangeEvent, Direction } from 't-grid';
import { TProgressComponent } from 't-progress';

const TEST_DATA = [
  { foo: 0, bar: 1000 },
  { foo: 2, bar: 44 },
  { foo: 3, bar: 33 },
  { foo: 4, bar: 'ana are mere' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TGridComponent, TColumnComponent, TProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  demoData = TEST_DATA;

  onSortChange(sort: SortChangeEvent) {
    const sortProperty = sort.property;

    if (!sortProperty) {
      this.demoData = TEST_DATA;
    } else {
      this.demoData = [...TEST_DATA].sort((a, b) => {
        const av = (a as any)[sortProperty];
        const bv = (b as any)[sortProperty];
        return av > bv ? 1 : av < bv ? -1 : 0;
      });

      if (sort.direction === Direction.Descending) {
        this.demoData.reverse();
      }
    }
  }
}
