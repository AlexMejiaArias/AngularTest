import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Toast.component.html',
  styleUrl: './Toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit {

  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';

  ngOnInit(): void {
    setTimeout(() => {
      const element = document.getElementById('toast');
      if (element) element.remove();
    }, 1500);
  }
}
