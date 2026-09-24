import { Route, Routes } from "react-router";
import "./App.scss";
import HomePage from "./pages/home/home.page";
import LoginPage from "./pages/login/login.page";

function app() {
  return (
    <div className="app">
      <Routes>
        <Route Component={HomePage} path="/" />
        <Route Component={LoginPage} path="login" />
      </Routes>
    </div>
  );
}

export default app;
