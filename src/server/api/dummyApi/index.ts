import express from 'express';

const router = express.Router();

// server for dummy API route
router.get('/test', (req, res: express.Response) => {
	res.send('Success');
});

export default router;
