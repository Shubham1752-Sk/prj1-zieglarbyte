// This will prevent authenticated users from accessing this route
import { enqueueSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { memo } from "react"

const OpenRoute = memo(function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  
  if (token === null ) {
    return children
  } else {
    enqueueSnackbar('You are Already logged In',{variant:'error'})
    return (<Navigate to="/dashboard/my-profile" />)
  }
})

export default OpenRoute
