import { Route, Routes, useLocation } from "react-router";
import "./App.scss";
import HomePage from "./pages/home/home.page";
import LoginPage from "./pages/login/login.page";
import Navbar from "./components/navbar/navbar";

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      <Routes>
        <Route Component={HomePage} path="/" />
        <Route Component={LoginPage} path="login" />
      </Routes>
    </div>
  );
}

export default App;
