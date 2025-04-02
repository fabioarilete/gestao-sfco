import { forwardRef, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', name = '', label = '', ...props }, ref) => {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontSize: '12px' }} htmlFor="">
          {label}
        </label>
        <input
          style={{ width: '100%', height: '40px' }}
          type={type}
          name={name}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
