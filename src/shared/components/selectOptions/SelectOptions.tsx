import { Select, MenuItem, FormControl, InputLabel, SelectProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type SelectOptionsProps = SelectProps & {
  label?: string;
  children: ReactNode;
};

export const SelectOptions: FC<SelectOptionsProps> = ({ value, children, name, label, ...rest }) => {
  return (
    <FormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        name={name}
        id={name}
        label={label}
        {...rest}
      >
        {children}
      </Select>
    </FormControl>
  );
};
