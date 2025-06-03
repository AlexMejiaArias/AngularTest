import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../interfaces/Products';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';
import { InputSearchDebouncedComponent } from '../../components/input-search-debounced/input-search-debounced.component';
import { DropdownMenuComponent } from '../../components/dropdown-menu/dropdown-menu.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { SqueletonComponent } from '../../components/squeleton/squeleton.component';
import { catchError, EMPTY } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [
    CommonModule,
    InputSearchDebouncedComponent,
    ButtonComponent,
    DropdownMenuComponent,
    DialogComponent,
    HttpClientModule,
    SqueletonComponent],

  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit {

  private productsService = inject(ProductService);
  private router = inject(Router);
  private toastService = inject(ToastService);


  public listProducts = signal<Product[]>([]);
  public displayedProducts = signal<Product[]>([]);
  public itemsPerPage: number = 5;
  public visible: boolean = false;
  public messageDelete: string = ''
  public productSelected?: Product;
  public isLoading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => this.getProducts(), 1000);
  }

  public getProducts() {
    this.productsService.get().subscribe({
      next: (res) => {
        this.listProducts.set(res);
        this.updateDisplayedProducts();
        this.isLoading = false;
      }
    })
  }

  public searchDebounced(value: string) {
    if (value === '') {
      this.getProducts();
      return;
    }

    this.displayedProducts.set(this.displayedProducts().filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, this.itemsPerPage));
  }

  public updateDisplayedProducts() {
    this.displayedProducts.set(this.listProducts().slice(0, this.itemsPerPage));
  }

  public onRecordsPerPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = +selectElement.value;
    this.updateDisplayedProducts();
  }

  public goToAddProduct() {
    this.router.navigateByUrl('products/save');
  }

  public getMenuItems(product: Product) {
    return [
      {
        label: 'Editar',
        action: () => this.goToEditProduct(product)
      },
      {
        label: 'Eliminar',
        action: () => this.confirmDeleteProject(product)
      }
    ];
  }

  public goToEditProduct(product: Product) {
    this.productsService.changeProduct(product);
    this.router.navigateByUrl('products/edit');
  }

  public confirmDeleteProject(product: Product): void {
    this.productSelected = product;
    console.log(this.productSelected)
    this.messageDelete = `¿Estás seguro de eliminar el producto ${product.name}?`
    this.visible = true
  }

  public deleteProduct(): void {
    this.isLoading = true
    this.productsService.delete(this.productSelected!.id).pipe(catchError(err => {
      this.isLoading = false
      return EMPTY
    })).subscribe(() => {
      this.getProducts()
      this.toogleModal()
    })
  }

  public toogleModal() {
    this.visible = !this.visible
  }

}
