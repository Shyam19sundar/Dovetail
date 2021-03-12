import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Leftbar from './components/Leftbar';
import Header from './components/Header';
import Chat from "./components/Chat";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-content">
          <Leftbar />
          <Switch>
            <Route path='/chats'>
              <Chat />
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
