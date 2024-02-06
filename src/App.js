import './index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

// components
import OpenRoute from './components/CORE/AUTH/OpenRoute';
import PrivateRoute from './components/CORE/AUTH/PrivateRoute';
import Signup from './PAGES/Signup';
import Login from './PAGES/Login';
import MyProfile from './components/CORE/DASHBOARD/MyProfile';
import Dashboard from './PAGES/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// functions
import { getUserDetails } from './SERVICES/operations/UserOperations';
import { ACCOUNT_TYPE } from './UTILS/constants';
function App() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {user, token} = useSelector((state)=>state.auth)

  useEffect(()=>{
    if(token){
      // console.log(token)
      dispatch(getUserDetails(token,navigate))
    }
  },[])
  return (
    <div className="App bg-bg-yellow text-text-gray">
      <Routes>
      <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute user={user}>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          element={<Dashboard />}
        >
          <Route path = '/dashboard/my-profile' element={<MyProfile />} />
        </Route>
        
      </Routes>
    </div>
    
  );
}

export default App;
