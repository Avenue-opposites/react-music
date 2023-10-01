import { Transition, TransitionClasses, Dialog } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'

type Direction = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps extends TransitionClasses, React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  direction?: Direction;
}

const classes = {
  left: {
    classes: 'left-0 inset-y-0',
    from: ' -translate-x-full',
    to: 'translate-x-0',
  },
  right: {
    classes: 'right-0 inset-y-0',
    from: 'translate-x-full',
    to: ' translate-x-0',
  },
  top: {
    classes: 'top-0 inset-x-0',
    from: ' -translate-y-full',
    to: 'translate-y-0',
  },
  bottom: {
    classes: 'bottom-0 inset-x-0',
    from: 'translate-y-full',
    to: 'translate-y-0',
  }
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  direction = 'left',
  enter,
  enterFrom,
  enterTo,
  entered,
  leave,
  leaveFrom,
  leaveTo,
  ...otherProps
}) => {

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveTo="opacity-0"
          as={Fragment}
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>
        <Dialog.Panel>
          <Transition.Child
            enter={enter || 'ease-out duration-300'}
            enterFrom={clsx(classes[direction].from, enterFrom)}
            enterTo={clsx(classes[direction].to, enterTo)}
            entered={entered}
            leave={leave || 'ease-in duration-200'}
            leaveFrom={leaveFrom || classes[direction].to}
            leaveTo={clsx(classes[direction].from, leaveTo)}
            as={Fragment}
          >
            <div className={clsx('fixed',classes[direction].classes)}>
              <div {...otherProps}>
                {children}
              </div>
            </div>
          </Transition.Child>
        </Dialog.Panel>
      </Dialog>
    </Transition.Root>
  )
}

export default Drawer