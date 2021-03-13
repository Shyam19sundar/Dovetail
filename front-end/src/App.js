import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Leftbar from './components/Leftbar';
import Header from './components/Header';
import Chat from "./components/Chat";
import Login from "./components/Login";
import React, { useState } from 'react'
import SignUp from "./components/SignUp";
import Verify from "./components/Verify";
import Form from "./components/Form";
import Room from "./components/Room";


function App() {
  const [path, setPath] = useState(window.location.pathname)

  return (
    <Router>
      <Route path="/login" exact>
        <Login setPath={setPath} />
      </Route>
      <Route path="/signup" exact>
        <SignUp />
      </Route>
      <Route path="/form" exact>
        <Form setPath={setPath} />
      </Route>
      <Route path="/verify" exact>
        <Verify />
      </Route>
      {((path !== "/login") && (path !== "/signup") && (path !== "/form")) ?
        <div className="app">
          <Header />
          <div className="app-content">
            <Leftbar />
            <Switch>
              <Route path='/chats' exact>
                <Chat />
              </Route>
              <Route path='/rooms'>
                <Room />
              </Route>
              <Route path='/' exact>
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
        : null}
    </Router>
  );
}

export default App;
