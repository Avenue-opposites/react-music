import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { MobileNavItemProps } from './MobileNavItem'
import clsx from 'clsx'

interface DesktopNavItemProps extends MobileNavItemProps {}

const DesktopNavItem: React.FC<DesktopNavItemProps> = ({
  icon,
  href,
  children
}) => {

  return (
    <NavLink
      className={({ isActive }) => clsx(
        `p-2 rounded-md hover:bg-gray-200 
        transition-colors
        flex items-center gap-x-2`,
        isActive ? 'text-sky-500 bg-gray-200' : 'text-gray-700'
      )}
      to={href}
    >
      <Icon className="text-2xl" icon={icon} />
      <span>{children}</span>
    </NavLink>
  )
}
 
export default DesktopNavItem