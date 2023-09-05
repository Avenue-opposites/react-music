import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { Icon, IconifyIcon } from '@iconify-icon/react'
import { Fragment } from 'react'

export interface MobileNavItemProps {
  children: string;
  href: string;
  icon: IconifyIcon | string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  children,
  href,
  icon,
}) => {
  return (
    <NavLink
      className="flex flex-col items-center justify-between"
      to={href}
    >
      {({ isActive }) => (
        <Fragment>
          <Icon
            className={clsx(
              'text-3xl transition-colors',
              isActive ? 'text-sky-500' : 'text-gray-700'
            )}
            icon={icon}
          />
          <span
            className={clsx(
              'text-xs transition-colors',
              isActive ? 'text-sky-500' : 'text-gray-700'
            )}
          >
            {children}
          </span>
        </Fragment>
      )}
    </NavLink>
  )
}

export default MobileNavItem
