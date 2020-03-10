import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

import { WidgetProps } from 'react-jsonschema-form';

const UpDownWidget = ({
  id,
  required,
  readonly,
  disabled,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
}: WidgetProps) => {
  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => onChange(value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  if (schema.multipleOf) {
    options.step = schema.multipleOf;
  }

  if (typeof schema.minimum !== 'undefined') {
    options.min = schema.minimum;
  }

  if (typeof schema.maximum !== 'undefined') {
    options.max = schema.maximum;
  }

  return (
    <FormControl
      fullWidth={true}
      //error={!!rawErrors}
      required={required}
    >
      <TextField
        id={id}
        label={label || schema.title}
        autoFocus={autofocus}
        required={required}
        type="number"
        disabled={disabled || readonly}
        name={name}
        value={value ? value : ''}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        inputProps={options}
        variant='outlined'
      />
    </FormControl>
  );
};

export default UpDownWidget;
