import { InputHTMLAttributes, FC, ReactNode } from 'react';

type InputProps = InputHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  children: ReactNode;
};

export const SelectOptions: FC<InputProps> = ({ value, children, name, label, ...rest }) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: '12px' }} htmlFor={name}>
        {label}
      </label>
      <select
        style={{ width: '100%', height: '45px' }}
        {...rest}
        name={name}
        id={name}
        value={value || ''}
      >
        <option>Selecione uma opção</option>
        {children}
      </select>
    </div>
  );
};
