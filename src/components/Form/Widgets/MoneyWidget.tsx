import React, { useState } from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import FormControl from '@material-ui/core/FormControl';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

const MoneyWidget = (props: WidgetProps) => {
  const {
    id,
    required,
    readonly,
    disabled,
    label,
    value: defaultValue = null,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema
  } = props;

  const {
    currencySymbol = '￥',
  } = options as {
    currencySymbol?: string;
    currency?: string;
    grouping?: boolean;
  };

  const [value, setValue] = useState(defaultValue);

  const _onChange = (event: React.FocusEvent<HTMLInputElement>, value: any): void => {

    setValue(value);
    onChange(value);
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
      <CurrencyTextField
        id={id}
        label={label || schema.title}
        autoFocus={autofocus}
        variant="outlined"
        required={required}
        disabled={disabled || readonly}
        onBlur={_onBlur}
        onFocus={_onFocus}
        InputProps={{
          ...options
        }}
        value={value}
        currencySymbol={currencySymbol}
        minimumValue="0"
        outputFormat="number"
        decimalCharacter="."
        digitGroupSeparator=","
        onChange={_onChange}
      />
    </FormControl>
  );
};

export default MoneyWidget;
