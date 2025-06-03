import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../../helpers/validation.service';
import { CommonModule } from '@angular/common';
import { dateValidator } from '../../../helpers/custumValidations/validations';
import { catchError, EMPTY } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../interfaces/Products';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../../../shared/services/toast.service';


@Component({
  selector: 'app-save-edit-page',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './save-edit-page.component.html',
  styleUrl: './save-edit-page.component.css'
})

export class SaveEditPageComponent implements OnInit {

  public projectForm: FormGroup;
  public labelButton: string = 'Enviar';
  public idUnique: boolean = false;

  today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private productsService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {

    this.projectForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: [null, [Validators.required, dateValidator()]],
      date_revision: [{ value: null, disabled: true }, Validators.required]
    });



  }

  ngOnInit(): void {
    if (this.router.url.includes('edit')) {
      this.labelButton = 'Editar';
      this.getProductToEdit();
    }
  }


  public getProductToEdit(): void {
    this.productsService.currentProduct.subscribe(product => {
      if (product) {
        this.projectForm.patchValue({
          ...product,
          date_release: product.date_release ? new Date(product.date_release).toISOString().split('T')[0] : null,
          date_revision: product.date_revision ? new Date(product.date_revision).toISOString().split('T')[0] : null
        });
        this.projectForm.get('date_release')?.clearValidators();
        this.projectForm.get('date_release')?.setValidators([Validators.required]);
        this.projectForm.get('date_release')?.updateValueAndValidity();
        this.projectForm.get('id')?.disable();
        this.projectForm.markAllAsTouched();
      }
    });
  }


  public onNewDateRevision(date: Date): void {
    this.projectForm.get('date_release')?.clearValidators();
    this.projectForm.get('date_release')?.setValidators([Validators.required, dateValidator()]);

    this.projectForm.get('date_release')?.updateValueAndValidity();
    this.projectForm.get('date_revision')?.setValue(this.addOneYear(date));

    this.projectForm.updateValueAndValidity();
  }


  public addOneYear(date: Date): String {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate.toISOString().split('T')[0];
  }

  public saveEditProject(): void {
    const product: Product = this.projectForm.getRawValue();
    if (this.router.url.includes('edit')) {
      this.editProject(product);
    } else {
      this.saveProject(product);
    }

  }



  public saveProject(data: Product): void {

    this.productsService.post(data).pipe(
      catchError((err) => {
        this.toastService.error('Error al enviar el producto');
        console.log(err)
        return EMPTY
      })
    )
      .subscribe(res => {
        this.router.navigateByUrl('products');
        this.cleanProjectForm();
      });
  }

  public editProject(data: Product): void {
    this.productsService.put(data).pipe(
      catchError((err) => {
        this.toastService.error('Error al editar el producto');
        return EMPTY
      })
    )
      .subscribe(res => {
        this.router.navigateByUrl('products');
        this.cleanProjectForm();
      });
  }

  public cleanProjectForm(): void {
    if (this.router.url.includes('edit')) {
      this.projectForm.patchValue({
        name: '',
        description: '',
        logo: '',
      });
    } else {
      this.projectForm.reset(); // Resetea todos los campos del formulario
    }

    // Asegúrate de que estas fechas están en el formato correcto
    this.projectForm.patchValue({
      date_release: this.today,
      date_revision: this.addOneYear(new Date())
    });
  }

  public validateId(idProduct: string) {
    if (idProduct === "") {
      this.idUnique = false
      return
    }
    this.productsService.verify(idProduct).subscribe(res => {
      this.idUnique = res
    })
  }

  isValidField(field: string): boolean | null {
    return this.validationService.isValidField(field, this.projectForm)
  }

  getFieldError(field: string): string | null {
    return this.validationService.getFieldError(field, this.projectForm)
  }

}
