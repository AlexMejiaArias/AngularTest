import { AbstractControl, ValidatorFn } from "@angular/forms";

export function dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const inputDate = control.value;
        const today = new Date().toISOString().split('T')[0];
        return inputDate >= today ? null : { 'invalidDate': true };
    }
}


