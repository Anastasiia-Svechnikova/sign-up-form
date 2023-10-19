import { FormConfigItemModel } from '../models/form-config-item.model';
import { Validators } from '@angular/forms';
import { lowerAndUpperCasePattern } from './lower-upper-case-pattern';

export const formConfig: FormConfigItemModel[] = [
  {
    name: 'firstName',
    label: 'First Name',
    validators: [Validators.required],
    errorMessages: {
      required: 'First name is required',
    },
    type: 'text',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    validators: [Validators.required],
    errorMessages: {
      required: 'Last name is required',
    },
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email',
    validators: [Validators.required, Validators.email],
    asyncValidators: [],
    errorMessages: {
      email: 'Invalid email',
      required: 'Email is required',
      'email-in-use': 'This email is already in use',
    },
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    validators: [
      Validators.required,
      Validators.pattern(lowerAndUpperCasePattern),
      Validators.minLength(8),
    ],
    errorMessages: {
      required: 'Password is required',
      pattern: 'Password must contain lower and upper case letters',
      minLength: 'Password must be at least 8 symbols',
      name: 'Password cannot contain first or last name',
    },
    type: 'password',
  },
  {
    name: 'repeatPassword',
    label: 'Repeat Password',
    validators: [
      Validators.required,
    ],
    errorMessages: {
      required: 'Repeat Password ',
      match: 'Password do not match',
    },
    type: 'password',
  },
];
