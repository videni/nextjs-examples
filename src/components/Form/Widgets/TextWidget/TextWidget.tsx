import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import MuiTextField from '@material-ui/core/TextField';
import { WidgetProps } from 'react-jsonschema-form';
import { withStyles, Theme } from '@material-ui/core';

const TextField = withStyles((theme: Theme) => ({
  root: {
    '& div.MuiInputBase-root': {
      backgroundColor: 'white',
    },
  },
}))(MuiTextField);

const TextWidget = ({
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
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(value === '' ? options.emptyValue : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

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
        variant="outlined"
        required={required}
        disabled={disabled || readonly}
        type="text"
        value={value ? value : ''}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      />
    </FormControl>
  );
};

export default TextWidget;
