import React, { useEffect, useState } from 'react';
import CreateDropzone from './CreateDropzone';
import { FieldProps } from 'react-jsonschema-form';
import { getUiOptions } from 'react-jsonschema-form/lib/utils';
import shortid from 'shortid';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const ActionButton = withStyles((theme: Theme) => ({
  root: {
    padding: '0px',
    borderRadius: '0px',
    width: '40px',
    height: '40px',
    margin: '0 auto',
  },
}))(IconButton);

const styles = (theme: Theme) => ({
  upload: {
    width: '128px',
    height: '128px',
  },
});

const useStyles = makeStyles(styles);

function FilesField(props: FieldProps) {
  const {
    disabled,
    formData,
    onChange,
    uiSchema,
  } = props;

  const classes = useStyles();

  const { widget = "files", ...options } = getUiOptions(uiSchema);

  const {
    showPreviewIcon,
    showRemoveIcon,
    accept,
    multiple = false,
  } = options;

  const [files, setFiles] = useState(formData || {});
  const [previewImage, setPreviewImage] = useState(undefined);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    Object.keys(files).forEach(index => {
      const { file } = files[index];
      if (file instanceof File) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }, [files]);

  const handleRemove = (index: string) => {
    const { [index]: removed, ...rest } = files;

    setFiles(rest);
    onChange(rest);
  };

  const onDropByItem = (index: string) => (acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map( file => Object.assign(file, {
      preview: URL.createObjectURL(file),
    }));

    const newFiles = { ...files, [index]: { file: filesWithPreview[0] } };

    setFiles(newFiles);
    onChange(newFiles);
  };

  const handlePreview = async (file: any) => {
    setPreviewImage(file.preview || file);
    setPreviewVisible(true);
  };

  const items = Object.keys(files).filter((file) => (file !==null)).map(index => {
    const { file } = files[index];
    const previewIcon = showPreviewIcon ? (
      <ActionButton onClick={e => handlePreview(file)}>
        <VisibilityIcon />
      </ActionButton>
    ) : null;
    const removeIcon = showRemoveIcon ? (
      <ActionButton onClick={() => handleRemove(index, file)}>
        <DeleteIcon />
      </ActionButton>
    ) : null;

    const actions = (
      <span className="pts-file-widget-list-item-actions">
        {previewIcon}
        {removeIcon}
      </span>
    );

    return (
      <Box
        key={index}
        justifyContent="center"
        flexDirection="column"
        p={1}
      >
        <CreateDropzone multiple={false}
          onDrop={onDropByItem(index)}
          accept={accept}
          disabled={disabled}
        >
          <img
            src={file.preview || file}
            alt=""
            style={{height: '128px', width: '128px'}}
          />
        </CreateDropzone>
        {actions}
      </Box>
    );
  });

  const generateShortId = () => shortid.generate();

  const onDropByAddButton = (acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.reduce( (prev, file) => {
      prev[generateShortId()] = { file: Object.assign(file, {preview: URL.createObjectURL(file) })};

      return prev;
    }, {});

    if (multiple) {
      const newFiles = { ...files, ...filesWithPreview };

      setFiles(newFiles);
      onChange(newFiles);
    } else {
      const keyOfFirst = Object.keys(filesWithPreview).shift();
      if (keyOfFirst){
        const valueOfFirst = filesWithPreview[keyOfFirst];
        const first = {
          keyOfFirst: valueOfFirst,
        };

        setFiles(first);
        onChange(first);
      }
    }
  };

  const addButton = (
    <Box border={1}
      borderColor="grey.500"
      ml={2}
    >
      <CreateDropzone
        multiple={multiple}
        className={classes.upload}
        onDrop={onDropByAddButton}
        accept={accept}
        disabled={disabled}
      >
        <CloudUploadIcon />
      </CreateDropzone>
    </Box>
  );

  return (
    <div>
      <Box display='flex'
        alignItems='center'
      >
        {items}
        {addButton}
      </Box>
      <Dialog
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
      >
        <img alt="" style={{ width: '100%', height: '100%' }} src={previewImage} />
      </Dialog>
    </div>
  );
}

export default FilesField;
