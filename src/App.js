import './index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// pages
import Signup from './PAGES/Signup';
import Login from './PAGES/Login';
import Dashboard from './PAGES/Dashboard';
import HomePage from './PAGES/HomePage';
import ViewCourse from './PAGES/ViewCourse';
import VerifyCertificate from './PAGES/VerifyCertificate';

// components
import OpenRoute from './components/CORE/AUTH/OpenRoute';
import PrivateRoute from './components/CORE/AUTH/PrivateRoute';
import MyProfile from './components/CORE/DASHBOARD/MyProfile';
import AddCategory from "./components/CORE/DASHBOARD/AddCategory"
import AddUser from './components/CORE/DASHBOARD/AddUser';
import AddCourse from './components/CORE/DASHBOARD/AddCourse';
import AdminDashboard from './components/CORE/DASHBOARD/AdminDashboard';
import MyCourses from "./components/CORE/DASHBOARD/MyCourses";
import EditCourse from './components/CORE/DASHBOARD/EditCourse';
import EnrolledCourses from "./components/CORE/DASHBOARD/EnrolledCourses"
import Cart from "./components//CORE/DASHBOARD/Cart";
import VideoDetails from './components/CORE/DASHBOARD/ViewCourse/VideoDetails';
import Settings from "./components/CORE/DASHBOARD/Settings";
import Certificate from './components/CORE/DASHBOARD/ViewCourse/Certificate';

// functions
import { getUserDetails } from './SERVICES/operations/UserOperations';
import { ACCOUNT_TYPE } from './UTILS/constants';


function App() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(getUserDetails(token, navigate))
    }
  }, [])
  return (
    <div className="App bg-bg-yellow text-text-gray">
      <Routes>
      <Route path='/' element={<HomePage /> }/>
        <Route
          path="login"
          element={<Login />}
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path='/dashboard/my-profile' element={<MyProfile />} />

          {/* Routes for admin only */}
          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path='dashboard/add-category' element={<AddCategory />} />
              <Route path='dashboard/add-user' element={<AddUser />} />
              <Route path='dashboard/admin' element={<AdminDashboard />} />
            </>
          )}
          {/* Routes for Instructors Only */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
          {/* Routes for students only */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}

        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
              <Route path='/certificate' element={<Certificate/>} />
            </>
          )}
        </Route>
        <Route path='dashboard/settings' element={<Settings />} />
        <Route path='/verify-certificate/:certificateId' element={<VerifyCertificate/>} />
      </Routes>
    </div>

  );
}

export default App;
