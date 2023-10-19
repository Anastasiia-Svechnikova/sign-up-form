import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

export interface FormConfigItemModel {
  label: string;
  type: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  errorMessages?: { [key: string]: string };
  name: string;
}
