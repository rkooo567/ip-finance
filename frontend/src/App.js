import React, { Component } from 'react';
import './App.css';
import InfoInput from './form/infoinput';
import MainComponent from './components/styles';
import Header from './components/header';
import CardPage from './cardpage/cardpage';
import TransactionPage from './components/transactionpage';
import HomePage from './components/homepage';
import Login from './components/login';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Error from "./components/error";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        <Header />
        <Switch style={MainComponent}>
          <Route path="/" component={HomePage} exact/>
          <Route path="/enterprises" component={CardPage} />
          <Route path="/transactions" component={TransactionPage} />
          <Route path="/exchange" component={InfoInput} />
          <Route path="/login" component={Login} />
          <Route path="/civic" render={() => {window.location.href="civic.html"}} />
          <Route component={Error} />
        </Switch>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
