import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let formBuilder: FormBuilder;
  let form: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService, FormBuilder]
    });

    service = TestBed.inject(ValidationService);
    formBuilder = TestBed.inject(FormBuilder);

    // Configura un formulario de prueba
    form = formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      date: ['', [Validators.required]],
      description: ['', [Validators.minLength(10)]]
    });
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('isValidField', () => {
    it('debería devolver true si el campo tiene errores y ha sido tocado', () => {
      const control = form.get('name');
      control?.setValue('');
      control?.markAsTouched();
      form.updateValueAndValidity();

      const result = service.isValidField('name', form);
      expect(result).toBeTrue();
    });

    it('debería devolver null si el campo no tiene errores', () => {
      const control = form.get('name');
      control?.setValue('ValidName');
      control?.markAsTouched();
      form.updateValueAndValidity();

      const result = service.isValidField('name', form);
      expect(result).toBe(null);
    });

    it('debería devolver false si el campo no ha sido tocado', () => {
      const control = form.get('name');
      control?.setValue('');
      form.updateValueAndValidity();

      const result = service.isValidField('name', form);
      expect(result).toBe(false);
    });

  });

  describe('getFieldError', () => {
    it('debería devolver el mensaje de error para un campo requerido', () => {
      const control = form.get('name');
      control?.setValue('');
      control?.markAsTouched();
      form.updateValueAndValidity();

      const errorMessage = service.getFieldError('name', form);
      expect(errorMessage).toBe('Este campo es requerido ');
    });

    it('debería devolver el mensaje de error para la validación de longitud mínima', () => {
      const control = form.get('description');
      control?.setValue('short');
      control?.markAsTouched();
      form.updateValueAndValidity();

      const errorMessage = service.getFieldError('description', form);
      expect(errorMessage).toBe('Numero mínimo de caracteres permitidos 10');
    });

    it('debería devolver el mensaje de error para la validación de longitud máxima', () => {
      const control = form.get('name');
      control?.setValue('ThisIsAReallyLongName');
      control?.markAsTouched();
      form.updateValueAndValidity();

      const errorMessage = service.getFieldError('name', form);
      expect(errorMessage).toBe('Numero máximo de caracteres permitidos 20');
    });

    it('debería devolver el mensaje de error para una fecha no válida', () => {
      const control = form.get('date');
      control?.setValue('2023-01-01');
      control?.setErrors({ invalidDate: true });
      control?.markAsTouched();
      form.updateValueAndValidity();

      const errorMessage = service.getFieldError('date', form);
      expect(errorMessage).toBe('La fecha debe ser mayor o igual a la fecha actual');
    });

    it('debería devolver null si el campo no existe en el formulario', () => {
      const errorMessage = service.getFieldError('nonexistentField', form);
      expect(errorMessage).toBeNull();
    });
  });
});
