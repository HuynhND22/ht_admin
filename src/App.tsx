import * as React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "../src/components/layout/index";
import Login from "./pages/login";
import withAuth from './components/HOC/checkAuthentication';
import withAdmin from './components/HOC/checkAuthorization';

function App() {
  return (
    <Router>
        <Routes>

            <Route path="/*"  element={React.createElement(withAuth(Layout))} />
            {/*<Route path="/login" element={<Login/>} />*/}
            <Route path="/login"
                   // element={React.createElement(withAdmin(Login))}
                element={<Login/>}
            />
        </Routes>
    </Router>
  )
}

export default App;
