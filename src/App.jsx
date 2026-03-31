import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  )
}

export default App
