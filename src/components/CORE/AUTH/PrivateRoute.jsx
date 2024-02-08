// This will prevent non-authenticated users from accessing this route
import { enqueueSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"

function PrivateRoute({ children }) {

  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  console.log('in the private Route')
  if (token !== null) {
    return children
  } else {
    console.log('in the private Route')
    enqueueSnackbar('You need to Login to access this Page',{variant:'info'})
    return <Navigate to='/login' />
  }
}

export default PrivateRoute
