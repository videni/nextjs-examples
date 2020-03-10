import React from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import Rating from '@material-ui/lab/Rating';
import FormControl from '@material-ui/core/FormControl';

const RatingWidget = (props: WidgetProps) => {
  const {
    required,
    readonly,
    disabled,
    value = null,
    label,
    onChange,
    options,
  } = props;


  return (
    <FormControl
    fullWidth={true}
    //error={!!rawErrors}
    label={label || schema.title}
    required={required}
  >
    <Rating
        value={value}
        onChange={(event, value) => {
          onChange(value);
        }}
      />
  </FormControl>
  );
};

export default RatingWidget;
