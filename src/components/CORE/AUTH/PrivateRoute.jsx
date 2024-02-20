// This will prevent non-authenticated users from accessing this route
import { enqueueSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { memo } from "react"
const PrivateRoute = memo(function PrivateRoute({ children }) {

  const { token } = useSelector((state) => state.auth)  
  if (token !== null) {
    return children
  } else {
    enqueueSnackbar('You need to Login to access this Page',{variant:'info'})
    return <Navigate to='/login' />
  }
})

export default PrivateRoute
