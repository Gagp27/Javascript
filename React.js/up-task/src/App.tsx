import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from "./pages/public/Login";
import Register from './pages/public/Register';
import Confirm from "./pages/public/Confirm";
import Recover from './pages/public/Recover';
import ResetPass from "./pages/public/ResetPass";
import Dashboard from "./pages/private/Dashboard";
import Create from "./pages/private/Create";
import Profile from "./pages/private/Profile";
import { AuthProvider } from "./context/AuthProvider";
import {ProjectProvider} from "./context/ProjectProvider";
import ChangePass from "./pages/private/ChangePass";
import Tasks from "./pages/private/Tasks";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path='/' element={ <Login /> } />
            <Route path='/register' element={ <Register /> } />
            <Route path='/confirm/:token/:userId' element={ <Confirm /> } />
            <Route path='/recover-account' element={ <Recover /> } />
            <Route path='/recover-account/:token/:userId' element={ <ResetPass /> } />

            <Route path='/projects' element={ <Dashboard page={'index'} /> } />
            <Route path='/projects/new' element={ <Create page={'create'} /> } />
            <Route path='/profile' element={ <Profile page={'profile'} /> } />
            <Route path='change-password' element={ <ChangePass page={'change'} /> } />

            <Route path='projects/:slug' element={ <Tasks /> } />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
