import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Leftbar from './components/Leftbar';
import Header from './components/Header';
import Chat from "./components/Chat";
import Login from "./components/Login";
import React, { useState, useEffect } from 'react'
import $ from "jquery"
import SignUp from "./components/SignUp";
import Verify from "./components/Verify";
import Room from "./components/Room";

function App() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    if (path === "/login" && path === "/signup")
      $('.app').hide()
  }, [])
  return (
    <Router>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/signup" exact>
        <SignUp />
      </Route>
      <Route path="/verify" exact>
        <Verify />
      </Route>
      <div className="app">
        <Header />
        <div className="app-content">
          <Leftbar />
          <Switch>
            <Route path='/chats' exact>
              <Chat />
            </Route>
            <Route path='/rooms' exact>
              <Room />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
