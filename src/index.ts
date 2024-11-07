import app from './app';
import https from 'https';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { config } from "./config/config";

const httpsOptions: https.ServerOptions = {
    key: fs.readFileSync(path.resolve(__dirname, config.CERT_KEY)),
    cert: fs.readFileSync(path.resolve(__dirname, config.CERT_CERT)),
};

const port = config.PORT;
https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});