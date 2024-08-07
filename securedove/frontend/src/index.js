import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import Register from "./Register";
import Messages from "./Messages";
import LogoPage from "./LogoPage";
import InvitationPage from './InvitationPage';
import "./App.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div className="App">
        <header className="App-header">        
          <Switch>
            {/* Route for logo page */}
            <Route exact path="/">
              <LogoPage />
            </Route>
            
            <Route path="/login">
              <App />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/messages">
              <Messages />
            </Route>
            <Route path="/invitation">
              <InvitationPage/>
            </Route>
          </Switch>
        </header>
      </div>
    </Router>
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
