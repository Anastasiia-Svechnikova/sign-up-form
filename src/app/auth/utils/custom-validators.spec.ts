import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { Observable, of } from 'rxjs';
import { SignUpService } from '../services/sign-up.service';

describe('CustomValidators', () => {
  let formGroup: FormGroup;

  let authService: SignUpService;

  beforeEach(() => {
    authService = {
      checkEmailInUse: (email: string) => {
        return of(email === 'inuse@example.com');
      },
    } as SignUpService;

    formGroup = new FormGroup({
      firstName: new FormControl('John'),
      lastName: new FormControl('Snow'),
      password: new FormControl('passworD'),
      confirmPassword: new FormControl('passworD'),
    });
  });

  it('should create', () => {
    expect(CustomValidators).toBeTruthy();
  });

  describe('identical Validator', () => {
    it('should return null for matching passwords', () => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');
      if (passwordControl && confirmPasswordControl) {
        passwordControl?.setValue('password');
        confirmPasswordControl?.setValue('password');
        const validatorFn: ValidatorFn =
          CustomValidators.identical(passwordControl);
        const result: ValidationErrors | null = validatorFn(
          confirmPasswordControl,
        );
        expect(result).toBeNull();
      }
    });

    it('should return a validation error for non-matching passwords', () => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');
      if (passwordControl && confirmPasswordControl) {
        passwordControl.setValue('password1');
        confirmPasswordControl.setValue('password2');
        const validatorFn: ValidatorFn =
          CustomValidators.identical(passwordControl);
        const result: ValidationErrors | null = validatorFn(
          confirmPasswordControl,
        );
        expect(result).toEqual({ passwordMismatch: true });
      }
    });
  });

  describe('containsName Validator', () => {
    it('should return a validation error if control value contains the first name', () => {
      const control = formGroup.get('password');
      if (control) {
        control.setValue('John123');
        const validatorFn: ValidatorFn =
          CustomValidators.containsName(formGroup);
        const result: ValidationErrors | null = validatorFn(control);
        expect(result).toEqual({ containsName: true });
      }
    });

    it('should return a validation error if control value contains the last name', () => {
      const control = formGroup.get('password');
      if (control) {
        control.setValue('Snow456');
        const validatorFn: ValidatorFn =
          CustomValidators.containsName(formGroup);
        const result: ValidationErrors | null = validatorFn(control);
        expect(result).toEqual({ containsName: true });
      }
    });

    it('should return null for a control value without names', () => {
      const control = formGroup.get('password');
      if (control) {
        control.setValue('Password123');
        const validatorFn: ValidatorFn =
          CustomValidators.containsName(formGroup);
        const result: ValidationErrors | null = validatorFn(control);
        expect(result).toBeNull();
      }
    });
  });

  describe('emailInUse Validator', () => {
    it('should return null for an email not in use', (done) => {
      const control = formGroup.get('password');
      const validatorFn: AsyncValidatorFn =
        CustomValidators.emailInUse(authService);
      if (control) {
        control.setValue('notused@example.com');

        (validatorFn(control) as Observable<ValidationErrors | null>).subscribe(
          (result: ValidationErrors | null) => {
            expect(result).toBeNull();
            done();
          },
        );
      }
    });

    it('should return a validation error for an email in use', (done) => {
      const control = formGroup.get('password');
      const validatorFn: AsyncValidatorFn =
        CustomValidators.emailInUse(authService);
      if (control) {
        control.setValue('inuse@example.com');

        (validatorFn(control) as Observable<ValidationErrors | null>).subscribe(
          (result: ValidationErrors | null) => {
            expect(result).toEqual({ emailInUse: true });
            done();
          },
        );
      }
    });
  });
});
