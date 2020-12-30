import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';
import api from './api';

const app = express();
// Set various headers for protection
app.use(helmet());
app.use(bodyParser.json());
// Allow cross-domain requests
app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use('/api', api);

if (process.env.NODE_ENV === 'production') {
	// Serve production assets
	app.use(express.static(path.resolve(__dirname, '../../dist')));
	app.get('/*', (_req, res) => {
		res.sendFile(path.resolve(__dirname, '../../dist', 'generated.html'));
	});
}

const PORT = process.env.PORT || 3030;
app.listen(PORT);

module.exports = app;
