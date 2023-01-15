import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Recover from "./pages/public/Recover";
import Confirm from "./pages/public/Confirm";
import Reset from "./pages/public/Reset";
import Admin from "./pages/private/Admin";
import Profile from "./pages/private/Profile";
import {AuthProvider} from "./context/AuthProvider";
import {DashboardProvider} from "./context/DashboardProvider";

function App() {
  return (
  <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <Routes>
            <Route path="/" element={ <AuthLayout /> }>
              <Route index element={ <Login /> } />
              <Route path="register" element={ <Register /> } />
              <Route path="confirm/:token" element={ <Confirm /> } />
              <Route path="recover-account" element={ <Recover /> } />
              <Route path="recover-account/:token" element={ <Reset /> } />
            </Route>

            <Route path="admin" element={ <Admin /> } />
            <Route path="profile" element={ <Profile /> } />
          </Routes>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
