import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPageComponent } from './list-page.component';
import { By } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Product } from '../../interfaces/Products';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ButtonComponent } from '../../components/button/button.component';
import { InputSearchDebouncedComponent } from '../../components/input-search-debounced/input-search-debounced.component';
import { DropdownMenuComponent } from '../../components/dropdown-menu/dropdown-menu.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MockProductService } from '../../../helpers/classes/MockProductService';



describe('ListPageComponent', () => {
  let component: ListPageComponent;
  let fixture: ComponentFixture<ListPageComponent>;
  let mockProductService: MockProductService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockProductService = new MockProductService();
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        ListPageComponent,
        ButtonComponent,
        InputSearchDebouncedComponent,
        DropdownMenuComponent,
        DialogComponent
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a getProducts cuando el valor de búsqueda esté vacío', () => {
    spyOn(component, 'getProducts'); // Espía en el método getProducts
    component.searchDebounced('');
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('debería mostrar el formulario de búsqueda y el botón de agregar', () => {
    const searchInput = fixture.debugElement.query(By.css('app-input-search-debounced'));
    const addButton = fixture.debugElement.query(By.css('app-button[labelButton="Agregar"]'));
    expect(searchInput).toBeTruthy();
    expect(addButton).toBeTruthy();
  });

  it('debería generar el menú desplegable para un producto', () => {
    const mockProduct = { id: '1', name: 'Producto 1', description: 'Descripción 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };

    const menuItems = component.getMenuItems(mockProduct);
    expect(menuItems).toContain(jasmine.objectContaining({ label: 'Editar' }));
    expect(menuItems).toContain(jasmine.objectContaining({ label: 'Eliminar' }));
  });

  it('debería alternar la visibilidad del modal', () => {
    component.toogleModal();
    expect(component.visible).toBeTrue();

    component.toogleModal();
    expect(component.visible).toBeFalse();
  });

  

  it('debería actualizar displayedProducts correctamente', () => {
    const mockProducts = [
      { id: '1', name: 'Producto 1', description: 'Descripción 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Producto 2', description: 'Descripción 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
    ];
    component.listProducts.set(mockProducts);
    component.itemsPerPage = 2;

    component.updateDisplayedProducts();

    expect(component.displayedProducts()).toEqual(mockProducts.slice(0, component.itemsPerPage));
  });

  it('debería actualizar itemsPerPage y llamar a updateDisplayedProducts cuando cambie el número de registros por página', () => {
    const mockValue = '10';
    const mockEvent = { target: { value: mockValue } } as unknown as Event;

    // Espía en el método updateDisplayedProducts
    spyOn(component, 'updateDisplayedProducts');

    // Llamar al método onRecordsPerPageChange
    component.onRecordsPerPageChange(mockEvent);

    // Verificar que itemsPerPage se actualice correctamente
    expect(component.itemsPerPage).toBe(+mockValue);

    // Verificar que updateDisplayedProducts sea llamado
    expect(component.updateDisplayedProducts).toHaveBeenCalled();
  });

  it('debería navegar a la página de agregar producto', () => {
    component.goToAddProduct();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('products/save');
  });


  it('debería devolver el menú correcto con las acciones adecuadas para el producto', () => {
    const mockProduct = { id: '1', name: 'Producto 1', description: 'Descripción 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };

    const menuItems = component.getMenuItems(mockProduct);

    expect(menuItems).toEqual([
      {
        label: 'Editar',
        action: jasmine.any(Function) // La acción debería ser una función
      },
      {
        label: 'Eliminar',
        action: jasmine.any(Function) // La acción debería ser una función
      }
    ]);

    const editAction = menuItems.find(item => item.label === 'Editar')?.action;
    if (editAction) {
      spyOn(component, 'goToEditProduct'); // Espía en el método goToEditProduct
      editAction(); // Ejecuta la acción
      expect(component.goToEditProduct).toHaveBeenCalledWith(mockProduct);
    }

    // Verificar que la acción de 'Eliminar' llama a confirmDeleteProject
    const deleteAction = menuItems.find(item => item.label === 'Eliminar')?.action;
    if (deleteAction) {
      spyOn(component, 'confirmDeleteProject');
      deleteAction(); // Ejecuta la acción
      expect(component.confirmDeleteProject).toHaveBeenCalledWith(mockProduct);
    }
  });


  it('debería cambiar el producto y navegar a la página de edición', () => {
    const mockProduct = { id: '1', name: 'Producto 1', description: 'Descripción 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };

    component.goToEditProduct(mockProduct);

    expect(mockProductService.changeProduct).toHaveBeenCalledWith(mockProduct);

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('products/edit');
  });

  it('debería configurar el producto seleccionado y el mensaje de confirmación, y mostrar el modal', () => {
    const mockProduct = { id: '1', name: 'Producto 1', description: 'Descripción 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };

    component.confirmDeleteProject(mockProduct);

    expect(component.productSelected).toEqual(mockProduct);

    expect(component.messageDelete).toBe(`¿Estás seguro de eliminar el producto ${mockProduct.name}?`);

    expect(component.visible).toBeTrue();
  });

  it('debería eliminar el producto y actualizar la lista', () => {
    const mockProduct = { id: '1', name: 'Producto 1', description: 'Descripción 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };
    component.productSelected = mockProduct;

    component.deleteProduct();
    expect(mockProductService.delete).toHaveBeenCalledWith(mockProduct.id);
    expect(mockProductService.get).toHaveBeenCalled();
    expect(component.visible).toEqual(true);
  });
});
