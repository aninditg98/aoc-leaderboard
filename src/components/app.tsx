import React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DemoContainer } from './Demo';

const App: React.FunctionComponent = () => {
	return (
		<Switch>
			<Route exact path="/demo" component={DemoContainer} />
			{/* Redirect insures we always have something sensible to render */}
			<Redirect to="/demo" />
		</Switch>
	);
};

export default hot(module)(App);
