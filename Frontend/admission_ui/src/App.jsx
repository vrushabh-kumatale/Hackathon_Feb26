
// import { Route, Routes } from 'react-router-dom'
// import AddCourse from './pages/addCourse'
// import AddBatch from './pages/AddBatches'
// import DisplayBatches from './pages/DisplayBatches'
// import RegisterStudent from './pages/StudentRegister'
// import RegistrationForm from './pages/RegToCourse'
// import DiscountManager from './pages/Discounts'

// import AdminDashboard from './pages/AdminDashboard'
// import Login from './pages/Login'
// import StudentDashboard from './pages/StudentDashboard'
// import AssignDiscountToBatch from './pages/AssignDiscountToBatch'
// import RegistrationsList from './pages/RegistrationsList'


// function App() {
  

//   return (
//     <Routes>
//            <Route path="/" element={<DisplayBatches />} />
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/addCourse" element={<AddCourse/>}/>
//             <Route path="/addBatches" element={<AddBatch/>}/>
//             <Route path="/registerStudent/:id" element={<RegisterStudent/>}/>
//             <Route path="/registerStudent" element={<RegistrationForm />} />
//            <Route path="/discount" element={<DiscountManager/>}/>
//            <Route path="/studentLogin" element={<Login />} />
//            <Route path="/studentDashboard" element={<StudentDashboard />} />
//            <Route path="/assignDiscount" element={<AssignDiscountToBatch />} />
//            <Route path="/regList" element={<RegistrationsList />} />

           
//     </Routes>
//   )
// }

// export default App

import { Route, Routes, useLocation } from 'react-router-dom'

import AddCourse from './pages/addCourse'
import AddBatch from './pages/AddBatches'
import DisplayBatches from './pages/DisplayBatches'
import RegisterStudent from './pages/StudentRegister'
import RegistrationForm from './pages/RegToCourse'
import DiscountManager from './pages/Discounts'

import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import AssignDiscountToBatch from './pages/AssignDiscountToBatch'
import RegistrationsList from './pages/RegistrationsList'
import AdminLogin from './pages/AdminLogin'

import Navbar from './pages/Navbar'

function App() {

  const token = localStorage.getItem("token");
   const location = useLocation();

  return (
    <>
       {token && location.pathname !== "/studentLogin" && <Navbar />}

      <Routes>

        <Route path="/" element={<DisplayBatches />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/addCourse" element={<AddCourse />} />
        <Route path="/addBatches" element={<AddBatch />} />

        <Route path="/registerStudent/:id" element={<RegisterStudent />} />
        <Route path="/registerStudent" element={<RegistrationForm />} />

        <Route path="/discount" element={<DiscountManager />} />
        <Route path="/studentLogin" element={<Login />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/assignDiscount" element={<AssignDiscountToBatch />} />
        <Route path="/regList" element={<RegistrationsList />} />
        <Route path="/adminLogin" element={<AdminLogin />} />

      </Routes>
    </>
  )
}

export default App
