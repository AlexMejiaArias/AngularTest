import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-products',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './layout-products.component.html',
  styleUrl: './layout-products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProductsComponent { }
