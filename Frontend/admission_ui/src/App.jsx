
import { Route, Routes } from 'react-router-dom'
import AddCourse from './pages/addCourse'

function App() {
  

  return (
    <Routes>
            <Route path="/addCourse" element={<AddCourse/>}/>

    
    </Routes>
  )
}

export default App
