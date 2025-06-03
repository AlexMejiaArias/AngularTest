import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  isValidField(field: string, form: FormGroup): boolean | null {
    return form.controls[field].errors && form.controls[field].touched
  }

  getFieldError(field: string, form: FormGroup): string | null {

    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {

        case 'invalidDate':
          return "La fecha debe ser mayor o igual a la fecha actual";

        case 'required':
          return "Este campo es requerido ";

        case 'maxlength':
          return `Numero máximo de caracteres permitidos ${errors['maxlength'].requiredLength}`

        case 'minlength':
          return `Numero mínimo de caracteres permitidos ${errors['minlength'].requiredLength}`

      }
    }

    return null

  }
}
