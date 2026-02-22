
import { Route, Routes } from 'react-router-dom'
import AddCourse from './pages/addCourse'
import AddBatch from './pages/AddBatches'


function App() {
  

  return (
    <Routes>
            <Route path="/addCourse" element={<AddCourse/>}/>
            <Route path="/addBatches" element={<AddBatch/>}/>

    
    </Routes>
  )
}

export default App
