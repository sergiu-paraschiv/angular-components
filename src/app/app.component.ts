import { Component } from '@angular/core';
import { TGridComponent, TColumnComponent } from 't-grid';
import { TProgressComponent } from 't-progress';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TGridComponent, TColumnComponent, TProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  demoData = [
    {'foo': 0, 'bar': 1000},
    {'foo': 2, 'bar': 44},
    {'foo': 3, 'bar': 33},
    {'foo': 4, 'bar': 'ana are mere'},
  ]
}
