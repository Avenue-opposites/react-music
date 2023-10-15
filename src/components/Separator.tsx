import clsx from 'clsx'
import { HTMLAttributes } from 'react'

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
}

const classes = {
  vertical: 'w-full h-px bg-gray-200',
  horizontal: 'inline-block h-full w-px bg-gray-200'
}

const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className,
  ...otherProps
}) => {
  return (
    <div className={clsx(className, classes[orientation])} {...otherProps} />
  )
}
 
export default Separator