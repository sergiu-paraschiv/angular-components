import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TGridComponent, TColumnComponent, SortChangeEvent, PaginationChangeEvent } from 't-grid';
import { TProgressComponent } from 't-progress';


function getRandomData() {
  const data: any[] = [];
  for (let i = 1; i < 100; i++) {
    data.push({ index: i, age: Math.ceil(Math.random() * 70) });
  }
  return data;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TGridComponent, TColumnComponent, TProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  demoData = new BehaviorSubject<any[]>(getRandomData());

  randomizeData() {
    this.demoData.next(getRandomData());
  }

  onSortChange(sort: SortChangeEvent) {
    console.log('sort', sort);
  }

  onPaginationChange(pagination: PaginationChangeEvent) {
    console.log('pagination', pagination);
  }
}
