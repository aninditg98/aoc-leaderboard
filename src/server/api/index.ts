import express from 'express';
import dummyApi from './dummyApi';

const apiRouter = express.Router();

// server healthcheck route
apiRouter.get('/healthcheck', (req, res: express.Response) => {
	res.send('OK');
});

apiRouter.use('/dummyApi', dummyApi);

export default apiRouter;
