import React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
import Grid from '@material-ui/core/Grid';

const BirthdayTemplate = (props: ObjectFieldTemplateProps) => {
  const {
    TitleField,
    title,
    properties,
    required,
    uiSchema,
    idSchema
  } = props;

  return (
    <>
       <Grid
        container={true}
        spacing={2}
        alignItems='center'
        style={{ marginBottom: '10px' }}
       >
        <Grid container={true} spacing={2}>
          {properties.map((element: any, index: number) => (
            <Grid
              item={true}
              xs={4}
              key={index}
            >
              {element.content}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default BirthdayTemplate;
