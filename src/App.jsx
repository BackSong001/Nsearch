import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResultList from './pages/ResultList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<ResultList />} />
    </Routes>
  )
}

export default App
