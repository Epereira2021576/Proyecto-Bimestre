import Server from './configs/server.js';

import { config } from 'dotenv';
config();

const server = new Server();

// Calling the listen() method from the Server class to start the server
server.listen();
