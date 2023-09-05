import { Icon } from '@iconify-icon/react'

interface MobileStatusBarProps {
  children: React.ReactNode
}

const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  children
}) => {
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
    </div>
  )
}

export default MobileStatusBar