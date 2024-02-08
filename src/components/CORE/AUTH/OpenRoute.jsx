// This will prevent authenticated users from accessing this route
import { enqueueSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  console.log('in the open Route')
  if (token === null ) {
    return children
  } else {
    enqueueSnackbar('You are Already logged In',{varient:'error'})
    return (<Navigate to="/dashboard/my-profile" />)
  }
}

export default OpenRoute
