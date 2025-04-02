import { InputHTMLAttributes, FC } from 'react';

type InputProps = InputHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export const SelectUnit: FC<InputProps> = ({ name, label, ...rest }) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: '12px' }} htmlFor={name}>
        {label}
      </label>
      <select style={{ width: '100%', height: '45px' }} {...rest} name={name}>
        <option>Selecione uma opção</option>
        <option>UN</option>
        <option>KG</option>
        <option>DZ</option>
        <option>CX</option>
        <option>PCT</option>
        <option>HR</option>
        <option>LT</option>
        <option>FD</option>
        <option>FX</option>
        <option>M2</option>
        <option>M3</option>
      </select>
    </div>
  );
};
