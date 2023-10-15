import { Icon, IconifyIcon } from '@iconify-icon/react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'error' | 'custom'
type Round = 'none' | 'small' | 'medium' | 'large' | 'full'

interface ButtonProps {
  className?: string,
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  disabled?: boolean;
  icon?: IconifyIcon | string;
  children?: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  roundType?: Round;
  fontSize?: string | number;
}

const classes: Record<Variant, string> = {
  primary: 'bg-sky-500 hover:bg-sky-600 text-white',
  secondary: 'bg-gray-300 hover:bg-gray-400 text-white',
  error: 'bg-red-500 hover:bg-red-600 text-white',
  custom: ''
}

const round: Record<Round, string> = {
  small: 'rounded-sm',
  medium: 'rounded-md',
  large: 'rounded-lg',
  none: 'rounded-none',
  full: 'rounded-full'
}

const Button: React.FC<ButtonProps> = ({
  className,
  type = 'button',
  variant = 'primary',
  disabled = false,
  icon,
  children,
  onClick,
  fullWidth = false,
  roundType = 'medium',
  fontSize
}) => {
  return (
    <button 
      style={{ fontSize }}
      className={clsx(
        className,
        `text-sm p-2 transition-all
         inline-flex items-center 
         justify-center gap-x-0.5
        `,
        classes[variant],
        round[roundType], 
        disabled && 'disabled',
        fullWidth && 'w-full'
      )}
      type={type} 
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon style={{ fontSize }} icon={icon} />}
      {children}
    </button>
  )
}
 
export default Button