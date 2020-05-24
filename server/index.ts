import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

app.use(bodyParser.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.get('/healthcheck', (req, res: express.Response) => {
  res.send('OK');
});

if (process.env.NODE_ENV === 'production') {
  // Serve production assets
  app.use(express.static('build'));

  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3030;
app.listen(PORT);

module.exports = app;
