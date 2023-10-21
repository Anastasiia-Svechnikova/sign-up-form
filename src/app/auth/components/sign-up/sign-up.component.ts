import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { debounceTime, merge, Subject, takeUntil } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SignUpService } from '../../services/sign-up.service';
import { FormConfigItemModel } from '../../models/form-config-item.model';
import { formConfig } from '../../constants/form-config';
import { FormFieldName } from '../../models/form-fields.model';
import { CustomValidators } from '../../utils/custom-validators';
import { passwordHintsConfig } from '../../constants/password-hints.config';
import { SignUpModel } from '../../models/sign-up.model';
import { snackbarConfig } from '../../constants/snackbar-config';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit, OnDestroy {
  public formConfig: FormConfigItemModel[] = formConfig;
  public passwordHintsConfig: { error: string; hint: string }[] =
    passwordHintsConfig;
  public signUpForm!: UntypedFormGroup;
  public isPasswordShown = false;
  protected readonly FormFieldName = FormFieldName;
  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private signUpService: SignUpService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this.createForm();
    this.subscribeOnNameChanges();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    const { firstName, lastName, email, password } = this.signUpForm.value;
    const signUpData: SignUpModel = {
      firstName,
      lastName,
      email,
      password,
    };
    this.signUpService
      .signUp(signUpData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.snackbar.open('Welcome', 'Ok', snackbarConfig);
          this.router.navigate(['/dashboard']);
        } else {
          this.snackbar.open('Something went wrong', 'Ok', snackbarConfig);
        }
      });
  }

  public togglePasswordShown(): void {
    this.isPasswordShown = !this.isPasswordShown;
  }

  public getErrors(controlName: (FormFieldName | number)[]): null | {
    [key: string]: boolean;
  } {
    const control: AbstractControl | null = this.signUpForm.get(controlName);
    return (controlName[0] === FormFieldName.password && control?.dirty) ||
      control?.touched
      ? control.errors
      : null;
  }

  public createForm(): void {
    this.signUpForm = new FormGroup({});
    this.formConfig.forEach(({ name, validators, asyncValidators }) => {
      this.signUpForm.addControl(
        name,
        new FormControl('', validators, asyncValidators),
      );
    });

    this.addCustomValidators();
  }

  private addCustomValidators(): void {
    this.signUpForm
      .get(FormFieldName.password)
      ?.addValidators([
        CustomValidators.containsName(this.signUpForm),
        CustomValidators.identical(
          this.signUpForm.controls[FormFieldName.confirmPassword],
          true,
        ),
      ]);

    this.signUpForm
      .get(FormFieldName.confirmPassword)
      ?.addValidators(
        CustomValidators.identical(
          this.signUpForm.controls[FormFieldName.password],
        ),
      );

    this.signUpForm.controls[FormFieldName.email]?.addAsyncValidators(
      CustomValidators.emailInUse(this.signUpService),
    );
  }

  private subscribeOnNameChanges(): void {
    merge(
      this.signUpForm.controls[FormFieldName.firstName].valueChanges,
      this.signUpForm.controls[FormFieldName.lastName].valueChanges,
    )
      .pipe(takeUntil(this.destroy$), debounceTime(400))
      .subscribe(() => {
        this.signUpForm.get(FormFieldName.password)?.updateValueAndValidity();
      });
  }
}
