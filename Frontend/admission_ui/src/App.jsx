
import { Route, Routes } from 'react-router-dom'
import AddCourse from './pages/addCourse'
import AddBatch from './pages/AddBatches'
import RegisterStudent from './pages/StudentRegister'
import RegistrationForm from './pages/RegToCourse'


function App() {
  

  return (
    <Routes>
            <Route path="/addCourse" element={<AddCourse/>}/>
            <Route path="/addBatches" element={<AddBatch/>}/>
            <Route path="/registerStudent" element={<RegisterStudent/>}/>
            <Route path="/regToCourse" element={<RegistrationForm/>}/>

    
    </Routes>
  )
}

export default App
