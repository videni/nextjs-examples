import React from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import FormControl from '@material-ui/core/FormControl';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DateTimePicker } from "@material-ui/pickers";
import DateUtils from '@date-io/luxon';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

const DATE_FORMAT = 'yyyy-LL-dd HH:mm:ss';

const DateTimeWidget = (props: WidgetProps) => {
  const {
    required,
    readonly,
    disabled,
    value = null,
    label,
    onChange,
    options,
  } = props;


  const {
    disablePast = false,
    showTodayButton = true,
    dateFormat = DATE_FORMAT,
    dateViews = ["date" , "year" , "month" , "hours"],
  } = options;

  const _onChange = (date: MaterialUiPickersDate): void => {
    onChange( date ? date.toFormat(dateFormat): null);
  };

  return (
    <FormControl
    fullWidth={true}
    //error={!!rawErrors}
    required={required}
  >
    <MuiPickersUtilsProvider utils={DateUtils}>
      <DateTimePicker
        value={value}
        disabled={disabled}
        readOnly={readonly}
        disablePast={disablePast}
        onChange={_onChange}
        label={label || schema.title}
        showTodayButton={showTodayButton}
        inputVariant='outlined'
        dateViews={dateViews}
        autoOk
      />
    </MuiPickersUtilsProvider>
  </FormControl>
  );
};

export default DateTimeWidget;
