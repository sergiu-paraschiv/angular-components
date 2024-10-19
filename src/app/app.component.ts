import { Component } from '@angular/core';
import { TGridComponent } from 't-grid';
import { TProgressComponent } from 't-progress';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TGridComponent, TProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-components';
}
