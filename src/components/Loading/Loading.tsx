import { ClimbingBoxLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div className="
      fixed inset-0 bg-white bg-opacity-75 
      dark:bg-black
      flex justify-center items-center
      "
    >
      <ClimbingBoxLoader color="#0ea5e9" />
    </div>
  )
}
 
export default Loading