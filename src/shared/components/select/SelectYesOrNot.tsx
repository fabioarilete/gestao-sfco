import { InputHTMLAttributes, FC } from 'react';

type InputProps = InputHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export const SelectYesOrNot: FC<InputProps> = ({ name, label, ...rest }) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: '12px' }} htmlFor={name}>
        {label}
      </label>
      <select style={{ width: '100%', height: '40px' }} {...rest} name={name}>
        <option>Selecione uma opção</option>
        <option>SIM</option>
        <option>NÃO</option>
      </select>
    </div>
  );
};
