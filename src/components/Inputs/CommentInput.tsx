import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import Button from '../Button/Button'
import Avatar from '../Avatar/Avatar'
import { useStore } from '~/store'

type Form = { 
  comment: string;
} | FieldValues

export type SendHandler =  (message: string) => void

interface CommentInputProps {
  onSend: SendHandler;
  placeholder?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSend,
  placeholder
}) => {
  const user = useStore(state => state.user)
  const { 
    register, 
    handleSubmit, 
  } = useForm<Form>()

  const onSubmit: SubmitHandler<Form> = (data) => {
    onSend(data.comment.trim())
  }

  return (
    <form className="flex h-24 justify-between gap-x-4 items-center" onSubmit={handleSubmit(onSubmit)}>
      <Avatar src={user.avatarUrl} alt={user.nickname} />
      <textarea 
        className="
          peer
          w-full resize-none rounded px-4 py-2
          outline-sky-500 outline-2 bg-slate-200 hover:bg-white
          hover:outline transition-all h-10 focus:h-16
        " 
        placeholder={placeholder} 
        {...register('comment', { required: true })} 
        onKeyDown={(e) => e.stopPropagation()}
      />
      <Button type="submit" className="w-16 h-10 peer-focus:h-16 transition-all" variant="primary">发布</Button>
    </form>
  )
}

export default CommentInput