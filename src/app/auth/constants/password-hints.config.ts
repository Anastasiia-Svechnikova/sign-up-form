export const passwordHintsConfig: { error: string; hint: string }[] = [
  {
    error: 'pattern',
    hint: 'Contains lower and upper case letters',
  },
  {
    error: 'minlength',
    hint: 'At least 8 symbols',
  },
  {
    error: 'containsName',
    hint: 'Must not contain first or last name',
  },
];
