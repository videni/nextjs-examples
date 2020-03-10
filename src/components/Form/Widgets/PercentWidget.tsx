import React from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';

const PercentWidget = (props: WidgetProps) => {
  const {
    id,
    required,
    readonly,
    disabled,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
  } = props;

  const _onChange = ({
    target: { value }
  }: React.FocusEvent<HTMLInputElement>): void => {
    onChange( value);
  };

  const _onBlur = ({
    target: { value }
  }: React.FocusEvent<HTMLInputElement>): void => onBlur(id, value);

  const _onFocus = ({
    target: { value }
  }: React.FocusEvent<HTMLInputElement>): void => onFocus(id, value);

  return (
    <FormControl
    fullWidth={true}
    //error={!!rawErrors}
    required={required}
  >
    <TextField
      id={id}
      step="1"
      min="0"
      max="100"
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
      endAdornment={
        <InputAdornment position="end">%</InputAdornment>
      }
    />
  </FormControl>
  );
};

export default PercentWidget;
