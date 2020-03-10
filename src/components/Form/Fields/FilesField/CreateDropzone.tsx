import React from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

export interface CreateDropzoneProps {
  multiple: boolean;
  disabled: boolean;
  className: string;
  accept: string | number | boolean | object | any[] | null;
  onDrop: (acceptedFiles: File[]) => void;
  children: React.ReactNode
}

const CreateDropzone: React.FC<CreateDropzoneProps> = (props) => {
  const {
    multiple,
    children,
    accept,
    disabled,
    className,
    onDrop,
  } = props;

  const {getRootProps, getInputProps} = useDropzone({
    accept,
    onDrop
  } as DropzoneOptions);

  return (
    <div {...getRootProps({
      className,
      disabled,
      multiple
      })}
      >
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default CreateDropzone;
