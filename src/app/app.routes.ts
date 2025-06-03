import { Routes } from '@angular/router';
import { LayoutProductsComponent } from './products/pages/layout-products/layout-products.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutProductsComponent,
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) }
        ]
    }
];
