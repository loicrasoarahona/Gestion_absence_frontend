import { Route, Routes } from "react-router";
import "./App.scss";
import HomePage from "./pages/home/home.page";

function app() {
  return (
    <div className="app">
      <Routes>
        <Route Component={HomePage} path="/" />
      </Routes>
    </div>
  );
}

export default app;
