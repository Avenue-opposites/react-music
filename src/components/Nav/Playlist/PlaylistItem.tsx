import { Icon } from '@iconify-icon/react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

interface PlaylistItemProps {
  id: number,
  name: string
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  id,
  name
}) => {
  return (
    <li>
      <NavLink to={`/playlist/${id}`} className={({ isActive }) => clsx(
        `px-2 py-1 hover:bg-gray-200 rounded-md
        flex items-center gap-x-1`,
        isActive ? 'text-sky-500 bg-gray-200' : 'text-gray-700'
      )}
      >
        <Icon icon="mingcute:playlist-fill" />
        <span className="text-sm truncate">{name}</span>
      </NavLink>
    </li>
  )
}

export default PlaylistItem