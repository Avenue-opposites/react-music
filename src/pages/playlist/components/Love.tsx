import { Icon } from '@iconify-icon/react/dist/iconify.js'
import clsx from 'clsx'

interface LoveProps {
  love?: boolean;
  className?: string;
}

const Love: React.FC<LoveProps> = ({
  love,
  className
}) => {
  return (
    <div className={clsx('text-2xl flex', className)}>
      {
        love
          ? (<Icon className="text-red-500" icon="material-symbols:favorite-rounded" />)
          : (<Icon className="text-gray-500" icon="material-symbols:favorite-outline-rounded" />)
      }
    </div>
  )
}

export default Love

