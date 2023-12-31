import Drawer, { DrawerProps } from '../Drawer/Drawer'
import * as Avatar from '@radix-ui/react-avatar'
import Button from '../Button/Button'
import { logout } from '~/api/login'
import { useNavigate } from 'react-router'

interface SettingsProps extends Omit<DrawerProps, 'direction' | 'children' | 'isShowBackdrop'> {
  user: any;
}

const Settings: React.FC<SettingsProps> = ({
  open,
  onClose,
  user
}) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/login', { replace: true })
  }

  return (
    <Drawer className="p-2 w-56 space-y-4 h-full bg-gray-200" direction="right" open={open} onClose={onClose}>
      <div className="p-2 flex gap-x-2 items-center bg-white rounded-md">
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
        <h3>{user.nickname}</h3>
      </div>
      <Button 
        className="
          bg-white text-red-400 
          hover:bg-red-100 hover:text-red-500
        " 
        variant="custom"
        onClick={handleLogout}
        icon="material-symbols:logout-rounded"
        fullWidth
      >
        退出登录
      </Button>
    </Drawer>
  )
}

export default Settings