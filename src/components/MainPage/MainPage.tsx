import React, { CSSProperties } from 'react';

const headerStyle: CSSProperties = {
	color: '#4793e0',
	textAlign: 'center',
	margin: '25px 0 25px 0',
	textShadow: '-1px 0 #22242638, 0 1px #22242638, 1px 0 #22242638, 0 -1px #22242638',
};

const MainPage: React.FunctionComponent = () => {
	return (
		<div>
			<h1 style={headerStyle}>React Starter</h1>
		</div>
	);
};

export default MainPage;
