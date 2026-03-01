
import { Route, Routes } from 'react-router-dom'
import AddCourse from './pages/addCourse'
import AddBatch from './pages/AddBatches'
import RegisterStudent from './pages/StudentRegister'
import RegistrationForm from './pages/RegToCourse'
import DiscountManager from './pages/Discounts'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import AssignDiscountToBatch from './pages/AssignDiscountToBatch'
import RegistrationsList from './pages/RegistrationsList'


function App() {
  

  return (
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/addCourse" element={<AddCourse/>}/>
            <Route path="/addBatches" element={<AddBatch/>}/>
            <Route path="/registerStudent" element={<RegisterStudent/>}/>
            <Route path="/regToCourse" element={<RegistrationForm/>}/>
           <Route path="/discount" element={<DiscountManager/>}/>
           <Route path="/userLogin" element={<Login />} />
           <Route path="/studentDashboard" element={<StudentDashboard />} />
           <Route path="/assignDiscount" element={<AssignDiscountToBatch />} />
           <Route path="/regList" element={<RegistrationsList />} />

           
    </Routes>
  )
}

export default App
