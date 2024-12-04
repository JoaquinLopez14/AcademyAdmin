import { HashRouter as Router, Route, Routes} from "react-router-dom"
import TablePoints from "./components/TablePoints"
import Home from "./components/Home"
import PointsAdmin from "./components/PointsAdmin"


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

