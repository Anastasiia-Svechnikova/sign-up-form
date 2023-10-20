import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

import { FormFieldName } from './form-fields.model';

export interface FormConfigItemModel {
  label: string;
  type: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  errorMessages?: { [key: string]: string };
  name: FormFieldName;
}
