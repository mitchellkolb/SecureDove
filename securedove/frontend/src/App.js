import './App.css';
import Login from './Login';
import Register from './Register';
import Messages from './Messages';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">        
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/messages">
              <Messages />
            </Route>
            
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
