import React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainPage from './MainPage';
import EntryForm from './EntryForm';
import DayPage from './DayPage';
import GeneralClassification from './GeneralClassification';

const App: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path="/home/:year" component={MainPage} />
      <Route exact path="/entry_form/:year" component={EntryForm} />
      <Route exact path="/general_classification/:year" component={GeneralClassification} />
      <Route exact path="/day/:year/:day" component={DayPage} />
      <Redirect to="/home/2024" />
    </Switch>
  );
};

export default hot(module)(App);
