// This will prevent authenticated users from accessing this route
import { enqueueSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (token === null ) {
    return children
  } else {
    enqueueSnackbar('You are Already logged In')
    return <Navigate to="/dashboard/my-profile" />
  }
}

export default OpenRoute
