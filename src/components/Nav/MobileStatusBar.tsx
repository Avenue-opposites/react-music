import { Icon } from '@iconify-icon/react'
import Drawer from '../Drawer/Drawer'
import { useToggle } from 'react-use'
// import Avatar from '../Avatar/Avatar'
// import s from '~/store'

interface MobileStatusBarProps {
  children: React.ReactNode
}

const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  children
}) => {
  const [isOpen, toggleIsOpen] = useToggle(false)

  return (
    <div
      className="
        relative
        h-14 flex justify-between items-center
        lg:hidden
      "
    >
      <div className="
          h-full w-14
          inline-flex items-center justify-center
        "
      >
        <Icon
          onClick={() => toggleIsOpen(true)}
          className="text-3xl text-gray-700"
          icon="ph:list-fill"
        />
      </div>
      {children}
      <div className="
          h-full w-14
          inline-flex items-center justify-center
        "
      >
        <Icon
          className="text-3xl text-gray-700"
          icon="streamline:computer-voice-mail-mic-audio-mike-music-microphone"
        />
      </div>
      <Drawer 
        open={isOpen} 
        onClose={() => toggleIsOpen(false)} 
        direction="left"
        isShowBackdrop
        className="p-4 bg-gray-100 h-full"
      >
        <div className="space-y-4">
          <div>
            {/* <Avatar src={} /> */}
          </div>
          <section></section>
        </div>
      </Drawer>
    </div>
  )
}

export default MobileStatusBar