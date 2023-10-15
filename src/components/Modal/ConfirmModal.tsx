import Button from '../Button/Button'
import Modal, { ModalProps } from './Modal'

interface ConfirmModalProps extends ModalProps {
  onConfirm: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen = false,
  children,
  onConfirm,
  onClose
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="p-4 flex flex-col justify-between w-[500px] bg-gray-50 rounded-lg">
        {children}
        <div className="flex items-center justify-end gap-x-2">
          <Button className="px-4 py-2" onClick={onConfirm}>确认</Button>
          <Button className="px-4 py-2" variant="secondary" onClick={onClose}>取消</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal