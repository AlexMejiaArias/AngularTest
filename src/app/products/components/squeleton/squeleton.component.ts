import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-squeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './squeleton.component.html',
  styleUrl: './squeleton.component.css'
})
export class SqueletonComponent {
  @Input() visible: boolean = false;
  
}
