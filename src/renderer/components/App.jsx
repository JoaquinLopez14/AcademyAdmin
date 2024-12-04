import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import TablePoints from "./TablePoints"
import Home from "./Home"
import PointsAdmin from "./PointsAdmin"


function App() {

  return (
    <section>
    <Router>
    <Routes>
      <Route path = "/" element={<Home/>}/>
      <Route path = "/Points" element={<TablePoints/>}/>
      <Route path = "/Admin" element={<PointsAdmin/>}/>
    </Routes>
  </Router>
</section>
  )
}

export default App

