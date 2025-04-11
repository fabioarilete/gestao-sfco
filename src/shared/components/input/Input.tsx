import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

type InputProps = TextFieldProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', name = '', ...props }, ref) => {
    return (
      <TextField
        fullWidth
        type={type}
        name={name}
        label={label}
        inputRef={ref}
        {...props}
      />
    );
  }
);
