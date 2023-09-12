import './App.css';
import app_logo from './securedovelogo.png'
import Login from './Login'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={app_logo} className="App-logo" alt="logo" />
        
        <Login />
        
      </header>
    </div>
  );
}

export default App;
