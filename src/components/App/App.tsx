import React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainPage from '../MainPage';

const App: React.FunctionComponent = () => {
	return (
		<Switch>
			<Route exact path="/" component={MainPage} />
			{/* Redirect insures we always have something sensible to render */}
			<Redirect to="/" />
		</Switch>
	);
};

export default hot(module)(App);
