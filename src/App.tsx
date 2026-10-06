import { Route, Routes, useLocation } from "react-router";
import "./App.scss";
import HomePage from "./pages/home/home.page";
import LoginPage from "./pages/login/login.page";
import Navbar from "./components/navbar/navbar";
import CreateAbsence from "./pages/create-absence/create-absence.page";
import ConfirmerRetourPage from "./pages/confirmer-retour/confirmer-retour.page";
import { useAuth } from "./hooks/useAuth";

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";
  useAuth();

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      <Routes>
        <Route Component={HomePage} path="/" />
        <Route Component={LoginPage} path="login" />
        <Route Component={CreateAbsence} path="/marquer-absence" />
        <Route
          Component={ConfirmerRetourPage}
          path="/absences/:id/confirmer-retour"
        />
      </Routes>
    </div>
  );
}

export default App;
