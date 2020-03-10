import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WidgetProps } from 'react-jsonschema-form';
import { graphql, fetchQuery, useRelayEnvironment } from 'relay-hooks';
import { AutocompleteWidgetQuery } from '@/__generated__/AutocompleteWidgetQuery.graphql';
import debounce from 'lodash/debounce';
import AddIcon from '@material-ui/icons/Add';

const useTransition = React.useTransition;

export interface AutocompleteWidgetProps extends WidgetProps {
  selectedData: object;
  configs: AutocompleteConfig;
}

type EvaluateOption = (result: object) => string;

export interface AutocompleteConfig {
  placeholder: string;
  allowClear?: boolean;
  multiple?: boolean;
  minimumInputLength?: number;
  autocomplete_alias: string;
  option_label: string | EvaluateOption;
  option_value: string | EvaluateOption;
  createNew?: () => void;
  fetch?: (value: any) => any;
  route_name?: string;
  route_parameters?: {
    [name: string]: string;
  };
}

const getOptionValue = (optionValueProperty: any) => (option: any) => {
  let value = '';
  if (typeof optionValueProperty === 'function') {
    value =  optionValueProperty(option);
  } else if(option) {
    value = option[optionValueProperty];
  }

  return value;
};

/**
 * transform select options to string
 */
function transform(optionValueProperty: any, multiple: boolean = false,  selected: any) {
  const getValue = getOptionValue(optionValueProperty);

  if (multiple && Array.isArray(selected)) {
    const results = selected.map((r: any) => {
      return getValue(r);
    });

    return results.join(',');
  }

  return selected ? String(getValue(selected)): selected;
}

const getOptionSelected = (optionValueProperty: any) => (option: any,  currentValue: any) =>  {
  const getValue = getOptionValue(optionValueProperty);
  if(!option || !currentValue) {
    return false;
  }
  return getValue(option) == getValue(currentValue);
}

const getOptionLabel =  (optionLabel: any) =>(option: any) => {
  let label = undefined;
  if (typeof optionLabel === 'function') {
    label =  optionLabel(option);
  } else if(option) {
    label = option[optionLabel];
  }

  return label;
}


const AutocompleteWidget: React.FC<AutocompleteWidgetProps> = props => {
  const enviroment = useRelayEnvironment();
  const [startTransition, isPending] = useTransition();

  const {
    options: autocompleteOptions,
    disabled,
    readonly,
    onChange,
    schema,
    value
 } = props;


 const defaultFetch = async (variables: any) => {
  const { autocomplete } = await fetchQuery<AutocompleteWidgetQuery>(
    enviroment,
    graphql`query AutocompleteWidgetQuery($name: String, $query: String, $page: Int, $perPage: Int, $searchById: Boolean, $_org_id: ID) {
      autocomplete(name: $name, query: $query, page: $page, perPage: $perPage, searchById: $searchById, _org_id: $_org_id) {
        hasMore
        results
      }
    }`,
    variables,
  ).toPromise();

  return autocomplete;
}

 const {
  placeholder,
  allowClear,
  multiple = false,
  minimumInputLength,
  autocomplete_alias: autocompleteAlias,
  option_label: optionLabel = 'label',
  option_value: optionValue = 'id',
  route_parameters: routeParameters,
  route_name: routeName,
  createNew = null,
  fetch = defaultFetch,
} = autocompleteOptions as AutocompleteConfig;

  let { data_selected: dataSelected } = schema;

  const [ options, setOptions ] = useState(() => {
    let defaultOptions: any = [];
    if (dataSelected && !Array.isArray(dataSelected)) {
      defaultOptions = [dataSelected];
    }
    return defaultOptions;
  });

  const onSearch = async (value: any) => {
    const data = await fetch({
      name: autocompleteAlias,
      query: value,
      ...routeParameters
    });

    if (data) {
      const {
        results
      } = data;
      setOptions(results);
    }
  };

  const _onChange = (optionValue: any, multiple: boolean = false) =>  (event: any, value: any): void => {
    onChange(transform(optionValue, multiple, value));
  };

  const selectedOptions = (options||[]).filter(option => {
    if ((multiple ? String(value).split(',') : [value]).some(
        value => option && value && getOptionValue(optionValue)(option) == value,
      )
    ) {
      return true;
    }
    return false;
  });

  return (
    <>
      <Autocomplete
        value={ multiple ? selectedOptions: (selectedOptions.length > 0 ? selectedOptions[0]: null ) }
        multiple={multiple}
        onInputChange={debounce((event: any, value: string) => {
          startTransition(() => {
            onSearch(value);
          })
        }, 400)}
        getOptionSelected={getOptionSelected(optionValue)}
        getOptionLabel={getOptionLabel(optionLabel)}
        filterSelectedOptions={true}
        renderInput={params => (
          <TextField
            {...params}
            label={placeholder || schema.title }
            fullWidth
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  { isPending ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        options={options}
        disabled={disabled || readonly}
        onChange={_onChange(optionValue, multiple)}
      />
    { createNew &&
      <IconButton onClick={() => { createNew();} }>
        <AddIcon />
      </IconButton>
    }
  </>);
}

export default AutocompleteWidget;
