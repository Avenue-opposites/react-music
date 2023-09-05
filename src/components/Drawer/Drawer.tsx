import { Transition, Dialog } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'

type Direction = 'left' | 'right' | 'top' | 'bottom'


interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  direction?: Direction;
  zIndex?: number;
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
}) => {
  return (
    <Transition.Root show={open}>
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
            enter="ease-out duration-300"
            enterFrom={classes[direction].from}
            enterTo={classes[direction].to}
            leave="ease-in duration-200"
            leaveTo={classes[direction].from}
            as={Fragment}
          >
            <div className={clsx('fixed bg-white',classes[direction].classes)}>
              {children}
            </div>
          </Transition.Child>
        </Dialog.Panel>
      </Dialog>
    </Transition.Root>
  )
}

export default Drawer