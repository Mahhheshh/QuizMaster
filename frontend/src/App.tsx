import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from './components/User';
import { Admin } from './components/Admin';
import { HomePage } from './components/HomePage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/createQuiz" element={<Admin />} />
          <Route path="/join" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
