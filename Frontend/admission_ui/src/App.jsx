
import { Route, Routes } from 'react-router-dom'
import AddCourse from './pages/addCourse'
import AddBatch from './pages/AddBatches'
import RegisterStudent from './pages/StudentRegister'


function App() {
  

  return (
    <Routes>
            <Route path="/addCourse" element={<AddCourse/>}/>
            <Route path="/addBatches" element={<AddBatch/>}/>
            <Route path="/registerStudent" element={<RegisterStudent/>}/>
    
    </Routes>
  )
}

export default App
