import React from 'react';
import { withTheme } from 'react-jsonschema-form';
import ObjectFieldTemplateContext from '../ObjectFieldTemplate/ObjectFieldTemplateContext';
import Theme from '../Theme';
import { FormProps, ObjectFieldTemplateProps } from 'react-jsonschema-form';

const Form = withTheme(Theme);

export interface MuiFormProps extends FormProps<any> {
  objectFieldTemplates?: {
    [key: string]: ObjectFieldTemplateProps;
  };
}

const MuiForm = React.forwardRef((props: MuiFormProps, ref: any) => {
  const {
    objectFieldTemplates = {},
    ...rest
  } = props;

  return (
    <ObjectFieldTemplateContext.Provider value={objectFieldTemplates}>
      <Form {...rest}
        ref={ref}
      />
    </ObjectFieldTemplateContext.Provider>
  );
});

export default MuiForm;
