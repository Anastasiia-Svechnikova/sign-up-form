import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';

import { SignUpService } from '../services/sign-up.service';

export class CustomValidators {
  static identical(
    passwordControl: AbstractControl,
    reverse = false,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password1 = passwordControl.value;
      const password2 = control?.value;
      if (reverse) {
        passwordControl.updateValueAndValidity();
      }

      return (password1 === password2 && password2) ||
        reverse || !password2
        ? null
        : { passwordMismatch: true };
    };
  }

  static containsName(form: FormGroup): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const err = {
        containsName: true,
      };
      const candidates: string[] = [form.value.firstName, form.value.lastName];
      return candidates.some(
        (word: string) => word && control.value.indexOf(word) >= 0,
      )
        ? err
        : null;
    };
  }

  static emailInUse(authService: SignUpService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return of(control.value).pipe(
        filter((): boolean => !control.hasError('email')),
        distinctUntilChanged(),
        switchMap(() => {
          return authService.checkEmailInUse(control.value).pipe(
            map((result: boolean) => {
              return result ? { emailInUse: true } : null;
            }),
          );
        }),
      );
    };
  }
}
