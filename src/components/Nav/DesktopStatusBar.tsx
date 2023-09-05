import * as Avatar from '@radix-ui/react-avatar'
import Search from '../Search/Search'

interface DesktopStatusBarProps {
  user: any
}

const DesktopStatusBar: React.FC<DesktopStatusBarProps> = ({
  user
}) => {
  
  return (
    <div 
      className="
        hidden lg:flex ml-64 py-2 px-4 
        flex-row-reverse items-center gap-x-4
      "
    >
      <Avatar.Root 
        className="
          inline-block w-12 h-12 
          rounded-full overflow-hidden 
        "
      >
        <Avatar.Image 
          className="object-cover" 
          src={user.avatarUrl} 
          alt="avatar" 
        />
      </Avatar.Root>
      <Search />
    </div>
  )
}

export default DesktopStatusBar