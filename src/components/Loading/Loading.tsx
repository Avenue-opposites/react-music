import clsx from 'clsx'
import { HTMLAttributes } from 'react'
import { ClipLoader } from 'react-spinners'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  size: number;
}

const Loading: React.FC<LoadingProps> = ({
  className,
  isLoading,
  size,
  ...otherProps
}) => {
  return (
    <div style={{ fontSize: size }} className={clsx(className ,'justify-center items-center gap-x-1', isLoading ? 'flex' : 'hidden')} {...otherProps}>
      <ClipLoader className="text-sky-500" size={size} />
      加载中......
    </div>
  )
}
 
export default Loading