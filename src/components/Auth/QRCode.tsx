import React, { Fragment, useMemo } from 'react'
import { Icon } from '@iconify-icon/react'
import { FadeLoader } from 'react-spinners'
import { State } from '~/types/QRCode'
import clsx from 'clsx'

interface QRCodeProps {
  stateCode: State;
  src: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

const state = {
  [State.Expired]: {
    classes: 'text-yellow-500',
    text: '二维码已过期',
    icon: 'ic:baseline-error-outline',
  },
  [State.WaitScan]: {
    classes: '',
    text: '等待扫描',
    icon: 'ic:round-qr-code-scanner',
  },
  [State.WaitConfirm]: {
    classes: '',
    text: '等待确认',
    icon: 'ic:round-qr-code-scanner',
  },
  [State.Success]: {
    classes: 'text-green-500',
    text: '扫描成功',
    icon: 'line-md:circle-to-confirm-circle-transition',
  },
  default: {
    classes: 'text-red-500',
    text: '扫描失败',
    icon: 'ic:baseline-error-outline',
  },
}

const QRCode: React.FC<QRCodeProps> = ({
  stateCode,
  src,
  isLoading,
  onRefresh,
}) => {
  const status = useMemo(() => ({
    classes: state[stateCode].classes,
    text: state[stateCode].text,
    icon: state[stateCode].icon,
  }), [stateCode])

  const isExpired = useMemo(() => stateCode === State.Expired, [stateCode])

  return (
    <div 
      className="
        flex flex-col gap-8 items-center bg-white
        justify-center w-96 h-96 rounded-md
      "
    >
      {
        isLoading 
        ? (
          <FadeLoader 
            height={5}
            loading={isLoading}
            radius={10}
            width={10}
            color="#0ea5e9" 
          />
        )
        : (
          <Fragment>
            <div className="relative">
              <img src={src} alt="QRCode" />
              <div 
                onClick={onRefresh}
                className={clsx(`
                  absolute top-0 left-0 transition-opacity
                  w-full h-full bg-white bg-opacity-75
                  flex flex-col items-center justify-center
                  `,
                  isExpired 
                  ? 'opacity-100 pointer-events-auto cursor-pointer' 
                  : 'opacity-0 pointer-events-none'
                )} 
              >
                <Icon className="text-2xl" icon="tabler:refresh" />
                <span className="text-sm">点击刷新二维码</span>
              </div>
            </div>
            <p className={clsx(
              'text-xl flex items-center',
              status.classes
            )}>
              <Icon className="text-2xl" icon={status.icon} />
              {status.text}
            </p>
          </Fragment>
        )
      }
    </div>
  )
}
 
export default QRCode