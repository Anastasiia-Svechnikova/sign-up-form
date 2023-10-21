import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SignUpComponent } from './sign-up.component';
import { SignUpService } from '../../services/sign-up.service';
import { SignUpModel } from '../../models/sign-up.model';
import { snackbarConfig } from '../../constants/snackbar-config';
import { FormFieldName } from '../../models/form-fields.model';
import { DashboardComponent } from '../../../dashboard/components/dashboard/dashboard.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let signUpService: SignUpService;
  const snackbar = jasmine.createSpyObj('MatSnackBar', ['open']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const mockSignUpData: SignUpModel = {
    firstName: 'John',
    lastName: 'Snow',
    email: 'snow@mail',
    password: 'MockPassword',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent },
        ]),
        HttpClientModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackbar },
        { provide: Router, useValue: router },
      ],
    });

    signUpService = TestBed.inject(SignUpService);

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.signUpForm).toBeTruthy();
    expect(component.signUpForm.get(FormFieldName.firstName)).toBeTruthy();
    expect(component.signUpForm.get(FormFieldName.lastName)).toBeTruthy();
    expect(component.signUpForm.get(FormFieldName.email)).toBeTruthy();
    expect(component.signUpForm.get(FormFieldName.password)).toBeTruthy();
    expect(
      component.signUpForm.get(FormFieldName.confirmPassword),
    ).toBeTruthy();
    expect(component.signUpForm.value).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('should render the form', () => {
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form')).toBeTruthy();
  });

  it('should render inputs with proper types', () => {
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;

    const firstNameInput: HTMLInputElement | null = compiled.querySelector(
      `input[name="${FormFieldName.firstName}"]`,
    );
    expect(firstNameInput).toBeTruthy();
    expect(firstNameInput?.type).toBe('text');

    const lastNameInput: HTMLInputElement | null = compiled.querySelector(
      `input[name="${FormFieldName.lastName}"]`,
    );
    expect(lastNameInput).toBeTruthy();
    expect(lastNameInput?.type).toBe('text');

    const emailInput: HTMLInputElement | null = compiled.querySelector(
      `input[name="${FormFieldName.email}"]`,
    );
    expect(emailInput).toBeTruthy();
    expect(emailInput?.type).toBe('email');

    const passwordInput: HTMLInputElement | null = compiled.querySelector(
      `input[name="${FormFieldName.password}"]`,
    );
    expect(passwordInput).toBeTruthy();
    expect(passwordInput?.type).toBe('password');

    const confirmPasswordInput: HTMLInputElement | null =
      compiled.querySelector(`input[name="${FormFieldName.confirmPassword}"]`);
    expect(confirmPasswordInput).toBeTruthy();
    expect(confirmPasswordInput?.type).toBe('password');
  });

  it('should toggle password visibility on toggle button click', () => {
    component.togglePasswordShown();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    const confirmPasswordInput: HTMLInputElement | null =
      compiled.querySelector(`input[name="${FormFieldName.confirmPassword}"]`);
    const passwordInput: HTMLInputElement | null = compiled.querySelector(
      `input[name="${FormFieldName.password}"]`,
    );

    expect(component.isPasswordShown).toBeTrue();
    expect(confirmPasswordInput?.type).toBe('text');
    expect(passwordInput?.type).toBe('text');
  });

  describe('Password hints', () => {
    let compiled: HTMLElement;

    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();

      compiled = fixture.nativeElement as HTMLElement;
      component.signUpForm.controls[FormFieldName.password].setValue(
        'password',
      );
      fixture.detectChanges();
    });

    it('should render three password hints items on password input', () => {
      const passwordHints: HTMLElement | null =
        compiled.querySelector('.password-hints');
      expect(passwordHints).toBeTruthy();
      expect(compiled.querySelectorAll('.hint-item').length).toBe(3);
    });

    it('should remove success class from min length hint when password is less then 8 symbols ', () => {
      component.signUpForm.controls[FormFieldName.password].setValue('two');
      component.signUpForm.controls[FormFieldName.password].markAsTouched();
      fixture.detectChanges();

      const minLengthHint: HTMLElement | null =
        compiled.querySelector('.minlength');
      expect(minLengthHint?.classList).not.toContain('success');
    });

    it('should remove success class from not contains name or last name hint when password contains name or last name', () => {
      component.signUpForm.controls[FormFieldName.firstName].setValue('first');
      component.signUpForm.controls[FormFieldName.password].setValue('first');
      component.signUpForm.controls[FormFieldName.password].markAsTouched();
      component.signUpForm.controls[FormFieldName.firstName].markAsTouched();

      fixture.detectChanges();

      const containsNameHint: HTMLElement | null =
        compiled.querySelector('.containsName');
      expect(containsNameHint?.classList).not.toContain('success');
    });

    it('should remove success class from lower and uppercase letters hint when password contains same case letters', () => {
      component.signUpForm.controls[FormFieldName.password].setValue('lower');
      component.signUpForm.controls[FormFieldName.password].markAsTouched();
      fixture.detectChanges();

      const lowerUpperCaseHint: HTMLElement | null =
        compiled.querySelector('.pattern');
      expect(lowerUpperCaseHint?.classList).not.toContain('success');
    });
  });

  it('should set form invalid if password and confirm password do not match', () => {
    component.signUpForm.patchValue({
      firstName: 'validName',
      lastName: 'validLastName',
      email: 'valid@mail.com',
      password: 'first',
      confirmPassword: 'second',
    });

    fixture.detectChanges();
    expect(component.signUpForm.valid).toBeFalsy();
  });

  it('should show submit button disabled if form is invalid', () => {
    component.signUpForm.patchValue({
      firstName: '',
      lastName: 'validLastName',
      email: 'valid@mail.com',
      password: 'first',
      confirmPassword: 'second',
    });

    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    const submitButton: HTMLButtonElement | null =
      compiled.querySelector('.submit-btn');
    fixture.detectChanges();
    expect(submitButton).toBeTruthy();

    expect(submitButton?.disabled).toBeTruthy();
  });

  it('should submit the form successfully', () => {
    component.signUpForm.patchValue(mockSignUpData);
    spyOn(signUpService, 'signUp').and.returnValue(of(mockSignUpData));

    component.onSubmit();
    expect(signUpService.signUp).toHaveBeenCalledWith(mockSignUpData);
    expect(snackbar.open).toHaveBeenCalledWith('Welcome', 'Ok', snackbarConfig);
  });

  it('should navigate to the dashboard page on successful sign up', fakeAsync(() => {
    component.signUpForm.patchValue(mockSignUpData);
    spyOn(signUpService, 'signUp').and.returnValue(of(true));

    component.onSubmit();
    tick(1000);

    expect(signUpService.signUp).toHaveBeenCalledWith(mockSignUpData);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show snackbar on form submission error', () => {
    component.signUpForm.patchValue(mockSignUpData);
    spyOn(signUpService, 'signUp').and.returnValue(of(false));

    component.onSubmit();

    expect(snackbar.open).toHaveBeenCalledWith(
      'Something went wrong',
      'Ok',
      snackbarConfig,
    );
  });

  it('should get form errors', () => {
    component.signUpForm.controls[FormFieldName.password].markAsTouched();
    const errors = component.getErrors([FormFieldName.password]);
    expect(errors).toEqual({ required: true });
  });
});
