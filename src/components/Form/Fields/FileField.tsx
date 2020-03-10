import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FieldProps } from 'react-jsonschema-form';
import { getUiOptions } from 'react-jsonschema-form/lib/utils';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { withStyles, Theme } from '@material-ui/core/styles';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';

const img = {
  width: '128px',
  height: '128px'
};

const styles = (theme: Theme) => ({
  upload: {
    width: '128px',
    height: '128px',
  },
});


const useStyles = makeStyles(styles);

export interface FileFieldProps extends FieldProps {
  formData: {
    file: string | File
  }
}

const PreviewButton = withStyles((theme: Theme) => ({
  root: {
    padding: '0px',
    borderRadius: '0px',
    width: '40px',
    height: '40px',
    margin: '0 auto',
  },
}))(IconButton);


function FileField(props: FileFieldProps) {
  const {
    disabled,
    formData,
    onChange,
    uiSchema,
  } = props;

  const { widget = "file", ...options } = getUiOptions(uiSchema);

  const {
    showPreviewIcon,
    accept,
    imageStyle
  } = options;

  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const { file } = formData || {'file': null};

  useEffect(() => () => {
    if (file instanceof File) {
      URL.revokeObjectURL(file.preview);
    }
  }, [file]);

  const onDrop = (acceptedFiles: File[]) => {
    const files = acceptedFiles.map( file => Object.assign(file, {
      preview: URL.createObjectURL(file),
    }));

    const newFile = { file: files[0] || file };

    onChange(newFile);
  };

  const handlePreview = async (file: File|string) => {
    //single image will have default link.
    setPreviewImage(file.preview || file);
    setPreviewVisible(true);
  };

  let content;
  if (file) {
    content = (
      <Box display="flex" justifyContent="center">
        <img
          src={file.preview || file}
          alt=""
          style={ imageStyle || img}
        />
      </Box>
    );
  } else {
    content =
    <Box border={1}
      borderColor="grey.500"
      ml={2}
    >
      <CloudUploadIcon />
    </Box>
  }

  const {getRootProps, getInputProps} = useDropzone({
    accept,
    onDrop
  } as DropzoneOptions);

  const classes = useStyles();

  return (
    <>
      <Dialog open={previewVisible}
        onClose={() => setPreviewVisible(false)}
      >
          <img alt="" style={{ width: '100%' }} src={previewImage} />
      </Dialog>
      <Box display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <div {...getRootProps({
          className: classes.upload,
          disabled,
          multiple: false
        })}
          >
          <input {...getInputProps()} />
          {content}
        </div>
        { file &&
          showPreviewIcon &&
          <PreviewButton onClick={e => handlePreview(file)}>
            <VisibilityIcon />
          </PreviewButton>
        }
      </Box>
    </>
  );
}

export default FileField;
