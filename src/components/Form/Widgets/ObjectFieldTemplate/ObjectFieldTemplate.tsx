import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import ObjectFieldTemplateContext from './ObjectFieldTemplateContext';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
import { getUiOptions } from 'react-jsonschema-form/lib/utils';

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
});

const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const {
    DescriptionField,
    description,
    TitleField,
    title,
    properties,
    required,
    uiSchema,
    idSchema,
  } = props;

  const classes = useStyles();

  return (
    <ObjectFieldTemplateContext.Consumer>
      {templates => {
        const objectFieldTemplate = uiSchema['ui:template'];
        if (
          objectFieldTemplate &&
          templates.hasOwnProperty(objectFieldTemplate)
        ) {
          const ObjectFieldTemplate = templates[objectFieldTemplate];
          return <ObjectFieldTemplate {...props} />;
        }

        const uiOptions = getUiOptions(uiSchema);

        let { label: displayLabel = true } = uiOptions;

        return (
          <>
            {displayLabel && (uiSchema['ui:title'] || title) && (
              <TitleField
                id={`${idSchema.$id}-title`}
                title={title}
                required={required}
              />
            )}
            {description && (
              <DescriptionField
                id={`${idSchema.$id}-description`}
                description={description}
              />
            )}
            <Grid container={true} spacing={2} className={classes.root}>
              {properties.map((element: any, index: number) => (
                <Grid
                  item={true}
                  xs={12}
                  key={index}
                  style={{ marginBottom: '10px' }}
                >
                  {element.content}
                </Grid>
              ))}
            </Grid>
          </>
        );
      }}
    </ObjectFieldTemplateContext.Consumer>
  );
};

export default ObjectFieldTemplate;
