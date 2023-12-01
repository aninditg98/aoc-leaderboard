import React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainPage from './MainPage';
import EntryForm from './EntryForm';
import DayPage from './DayPage';
const App: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path="/" component={MainPage} />
      <Route exact path="/entry_form/" component={EntryForm} />
      <Route exact path="/day/:year/:day" component={DayPage} />
      <Redirect to="/" />
    </Switch>
  );
};

export default hot(module)(App);
