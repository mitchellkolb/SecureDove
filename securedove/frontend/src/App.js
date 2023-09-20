import './App.css';
import Login from './Login';
import { useState } from "react";

import Messages from "./Messages";

function App() {
  const [user, setUser] = useState();

  if (!user) {
    return <Login onLogin={(user) => setUser(user)} />;
  } 
  else {
    return <Messages user={user} />;
  }
}

export default App;
