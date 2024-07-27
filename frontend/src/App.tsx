import './App.css'

import {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { User } from './components/User';
import { Admin } from './components/Admin';
import { HomePage } from './components/HomePage';
import { Login } from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  console.log(isAuthenticated);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/auth/', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setIsAuthenticated(true);
          const responseAsJson = await response.json();
          localStorage.setItem("token", responseAsJson.token);
        } else {
          console.log("error");
          throw new Error('Authentication failed');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchToken();
  }, []);

  if (!isAuthenticated) {
    return <Login />
  }

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
