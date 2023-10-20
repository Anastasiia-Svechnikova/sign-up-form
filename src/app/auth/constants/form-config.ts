import { Validators } from '@angular/forms';

import { FormConfigItemModel } from '../models/form-config-item.model';
import { lowerAndUpperCasePattern } from './lower-upper-case-pattern';
import { FormFieldName } from '../models/form-fields.model';

export const formConfig: FormConfigItemModel[] = [
  {
    name: FormFieldName.firstName,
    label: 'First Name',
    validators: [Validators.required],
    errorMessages: {
      required: 'Enter your first name, please',
    },
    type: 'text',
  },
  {
    name: FormFieldName.lastName,
    label: 'Last Name',
    validators: [Validators.required],
    errorMessages: {
      required: 'Enter your last name, please',
    },
    type: 'text',
  },
  {
    name: FormFieldName.email,
    label: 'Email',
    validators: [Validators.required, Validators.email],
    asyncValidators: [],
    errorMessages: {
      email: 'Invalid email',
      required: 'Email is required',
      emailInUse: 'This email is already in use',
    },
    type: 'email',
  },
  {
    name: FormFieldName.password,
    label: 'Password',
    validators: [
      Validators.required,
      Validators.pattern(lowerAndUpperCasePattern),
      Validators.minLength(8),
    ],
    errorMessages: {
      required: 'Password is required',
    },
    type: 'password',
  },
  {
    name: FormFieldName.confirmPassword,
    label: 'Confirm Password',
    validators: [Validators.required],
    errorMessages: {
      required: 'Confirm password, please',
      passwordMismatch: 'Passwords do not match',
    },
    type: 'password',
  },
];
