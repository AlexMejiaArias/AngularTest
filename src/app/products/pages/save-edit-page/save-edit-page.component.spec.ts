import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveEditPageComponent } from './save-edit-page.component';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Product } from '../../interfaces/Products';
import { ProductService } from '../../services/product.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../../../helpers/validation.service';
import { Router } from '@angular/router';
import { MockProductService } from '../../../helpers/classes/MockProductService';


class MockRouter {
  url: string = '';
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}



describe('SaveEditPageComponent', () => {
  let component: SaveEditPageComponent;
  let fixture: ComponentFixture<SaveEditPageComponent>;
  let mockProductService: MockProductService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SaveEditPageComponent, // Import the standalone component
      ],
      providers: [
        FormBuilder,
        ValidationService,
        { provide: ProductService, useClass: MockProductService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SaveEditPageComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as unknown as MockProductService;
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('ngOnInit debería establecer labelButton como "Editar" y llamar a getProductToEdit si la URL contiene "edit"', () => {
    spyOn(component, 'getProductToEdit').and.callThrough();

    mockRouter.url = '/edit';
    component.ngOnInit();
    expect(component.labelButton).toBe('Editar');
    expect(component.getProductToEdit).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('debería limpiar el formulario correctamente cuando la URL contiene "edit"', () => {
    mockRouter.url = '/edit';
    component.cleanProjectForm();
    fixture.detectChanges();

    // Verifica que solo los campos name, description y logo están vacíos
    expect(component.projectForm.get('name')?.value).toBe('');
    expect(component.projectForm.get('description')?.value).toBe('');
    expect(component.projectForm.get('logo')?.value).toBe('');

    // Verifica que date_release y date_revision están establecidos con valores correctos
    expect(component.projectForm.get('date_release')?.value).toBe(component.today);
    expect(component.projectForm.get('date_revision')?.value).toBe(component.addOneYear(new Date()));

    // Verifica que el campo id está intacto y no ha sido alterado (si es necesario)
    expect(component.projectForm.get('id')?.value).toBe('');
  });

  it('debería limpiar el formulario completamente cuando la URL no contiene "edit"', () => {
    mockRouter.url = '/create';
    component.cleanProjectForm();
    fixture.detectChanges();

    // Verifica que todos los campos del formulario están vacíos
    expect(component.projectForm.get('id')?.value).toBe(null);
    expect(component.projectForm.get('name')?.value).toBe(null);
    expect(component.projectForm.get('description')?.value).toBe(null);
    expect(component.projectForm.get('logo')?.value).toBe(null);


    // Verifica que los campos id y date_revision están correctamente resetados
    expect(component.projectForm.get('date_release')?.value).toEqual(component.today);
    expect(component.projectForm.get('date_revision')?.value).toEqual(component.addOneYear(new Date()));
  });

  it('deberia inicialar el formulario con los valores por defecto', () => {
    expect(component.projectForm.get('id')?.value).toBe('');
    expect(component.projectForm.get('name')?.value).toBe('');
    expect(component.projectForm.get('description')?.value).toBe('');
    expect(component.projectForm.get('logo')?.value).toBe('');
    expect(component.projectForm.get('date_release')?.value).toBeNull();
    expect(component.projectForm.get('date_revision')?.value).toBeNull();
  });

  it('deberia validar campo id y mostar mensaje de invalido', () => {
    const idControl = component.projectForm.get('id');
    idControl?.setValue('');
    idControl?.markAsTouched();
    fixture.detectChanges();
    const errorMsg = fixture.debugElement.query(By.css('.messageValidation')).nativeElement;
    expect(errorMsg.textContent).toContain('Este campo es requerido');
  });

  it('deberia actualizar el formulario de proct cuando es edit', () => {
    const testProduct: Product = {
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2024-01-01')
    };

    mockProductService.changeProduct(testProduct);
    fixture.detectChanges();

    component.getProductToEdit();
    fixture.detectChanges();

    expect(component.projectForm.get('id')?.value).toBe(testProduct.id);
    expect(component.projectForm.get('name')?.value).toBe(testProduct.name);
    expect(component.projectForm.get('description')?.value).toBe(testProduct.description);
    expect(component.projectForm.get('logo')?.value).toBe(testProduct.logo);
    expect(component.projectForm.get('date_release')?.value).toBe('2024-01-01');
    expect(component.projectForm.get('date_revision')?.value).toBe('2024-01-01');
    expect(component.projectForm.get('id')?.disabled).toBeTrue();
  });

  it('should handle response from verify method correctly', () => {
    const testId = 'test-id';
    const mockResponse = false;
    mockProductService.verify.and.returnValue(of(mockResponse));

    component.validateId(testId);
    fixture.whenStable().then(() => {
      expect(component.idUnique).toBe(mockResponse);
    });
  });


  it('Deberia llamar editProject si la url tiene edit', () => {
    spyOn(component as any, 'editProject');
    mockRouter.url = '/edit';

    component.projectForm.setValue({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    component.saveEditProject();

    const product: Product = component.projectForm.getRawValue();
    expect((component as any).editProject).toHaveBeenCalledWith(product);
  });


  it('deberia llamar saveProject si la url no contiene edit', () => {
    spyOn(component as any, 'saveProject'); // Espía el método saveProject
    mockRouter.url = '/create'; // Simula que estamos en una página de creación

    // Configura el formulario con valores de prueba
    component.projectForm.setValue({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    component.saveEditProject();

    // Verifica que saveProject ha sido llamado
    const product: Product = component.projectForm.getRawValue();
    expect((component as any).saveProject).toHaveBeenCalledWith(product);
  });

});