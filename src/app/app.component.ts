import { Component } from '@angular/core';
import { TGridComponent, TColumnComponent, SortChangeEvent, PaginationChangeEvent } from 't-grid';
import { TProgressComponent } from 't-progress';

const TEST_DATA: any[] = [];
for (let i = 1; i < 5; i++) {
  TEST_DATA.push({ index: i, age: Math.ceil(Math.random() * 70) });
}

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
    console.log('sort', sort);
  }

  onPaginationChange(pagination: PaginationChangeEvent) {
    console.log('pagination', pagination);
  }
}
