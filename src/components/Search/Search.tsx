import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import Button from '../Button/Button'
import BaseInput from '../Inputs/BaseInput'

type Form = {
  search: string
} | FieldValues

const Search = () => {
  const { 
    register, 
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<Form>()

  const onSearch: SubmitHandler<Form> = (data) => {
    console.log(data.search)
  }

  return (
    <form 
      className="
        w-2/3 h-2/3 text-sm
        flex items-center gap-x-2
        py-1 pl-4 pr-1 bg-gray-200 rounded-full
        hover:bg-gray-300
        transition-colors
        lg:w-48
      "
      onSubmit={handleSubmit(onSearch)}
    >
      <BaseInput 
        className="
          w-2/3 flex-1
          outline-none bg-transparent
        "
        name="search"
        register={register}
        errors={errors}
      />
      <Button 
        variant="custom"
        className="
          text-gray-700
        " 
        type="submit" 
        icon="ph:magnifying-glass-bold" 
      />
    </form>
  )
}
 
export default Search