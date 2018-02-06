import express from 'express';
import bodyParser from 'body-parser';
import registerCacheRoutes from './cacheAPI/routes';
import {PORT} from './config';

const app = express();

app.set('PORT', PORT);


app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`)
});

registerCacheRoutes(app);
