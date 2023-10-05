import clsx from 'clsx'
import BaseInput, { InputBaseProps } from './BaseInput'

interface InputProps extends InputBaseProps {
  label: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    name,
    fullWidth,
  } = props

  return (
    <div className={clsx('inline-flex flex-col', fullWidth && 'w-full', label && 'gap-y-2')}>
      {
        label &&
        <label
          className="
          block text-sm 
          font-medium text-gray-900
        "
          htmlFor={name}
        >
          {label}
        </label>
      }
      <BaseInput
        {...props}
        className="
          w-full h-8 p-1.5 rounded-sm
          border-none outline-none
          ring-1 ring-gray-300
          focus:ring-2 focus:ring-sky-500
        "
        errorClassName="ring-red-500 animate-shake"
        autoComplete="no"
      />
    </div>
  )
}

export default Input