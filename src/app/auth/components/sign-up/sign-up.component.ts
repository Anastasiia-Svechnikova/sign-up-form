import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from './sign-up.service';
import { FormConfigItemModel } from '../../models/form-config-item.model';
import { formConfig } from '../../constants/form-config';
import { Subject } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, UntypedFormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  public formConfig: FormConfigItemModel[] = formConfig;
  public signUpForm!: UntypedFormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public constructor(private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.createForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    console.log('submit');
  }

  public getErrors(controlName: (string | number)[]): {
    [key: string]: boolean;
  } {
    const control: AbstractControl | null = this.signUpForm.get(controlName);
    let errors: ValidationErrors | null | undefined;
    if (control?.touched) {
      errors = control.errors;
    }
    return { ...errors };
  }

  private createForm(): void {
    this.signUpForm = new FormGroup({});
    this.formConfig.forEach(({ name, validators, asyncValidators }) => {
      this.signUpForm.addControl(
        name,
        new FormControl('', validators, asyncValidators),
      );
    });
    console.log(this.signUpForm)
  }
}
