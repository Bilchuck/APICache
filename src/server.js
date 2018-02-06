import express from 'express';
import bodyParser from 'body-parser';
import registerCacheRoutes from './cacheAPI/routes';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`)
});

registerCacheRoutes(app);
