import { 
  UseFormRegister, 
  FieldErrors, 
  FieldValues 
} from 'react-hook-form'
import clsx from 'clsx'
import { InputHTMLAttributes } from 'react'

export interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  errorClassName?: string;
  disabledClassName?: string;
  autoComplete?: 'off' | 'no';
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}

const BaseInput: React.FC<InputBaseProps> = (props) => {
  const {
    name,
    type = 'text',
    required = false,
    disabled = false,
    autoComplete = 'off',
    register,
    className,
    errorClassName = '',
    disabledClassName = '',
    placeholder,
    errors
  } = props

  

  return (
    <input 
      {...getOnEvent(props)}
      className={clsx(
        className, 
        errors[name] && errorClassName,
        disabled && disabledClassName
      )}
      type={type}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={placeholder}
      {...register(name, { required })}
    />
  )
}
 
export default BaseInput

type PropsEvent<T extends string = string> = {
  [key in `on${Capitalize<T>}`]: (event: Event) => void;
};

// eslint-disable-next-line
function getOnEvent(props: Record<string, any>) {
  const events:PropsEvent = {}

  for (const [key, value] of Object.entries(props)) {
    if(key.startsWith('on')) {
      events[key as `on${Capitalize<string>}`] = value
    }
  }

  return events
}