import * as Avatar from '@radix-ui/react-avatar'
import Search from '../Search/Search'
import Settings from '../User/Settings'
import { Fragment } from 'react'
import { useToggle } from 'react-use'
import { User } from '~/store/user'

interface DesktopStatusBarProps {
  user: User
}

const DesktopStatusBar: React.FC<DesktopStatusBarProps> = ({
  user
}) => {
  const [isOpen, toggle] = useToggle(false)

  return (
    <Fragment>
      <Settings user={user} open={isOpen} onClose={() => toggle(false)} />
      <div
        className="
        hidden lg:flex ml-64 py-2 px-4 
        flex-row-reverse items-center gap-x-4
      "
      >
        <Avatar.Root
          onClick={() => toggle(true)}
          className="
          inline-block w-12 h-12 
          ring-sky-500 ring-2 
          ring-offset-base-100 ring-offset-2
          rounded-full overflow-hidden 
          cursor-pointer
        "
        >
          <Avatar.Image
            className="object-cover"
            src={user.avatar}
            alt="avatar"
          />
        </Avatar.Root>
        <Search />
      </div>
    </Fragment>
  )
}

export default DesktopStatusBar