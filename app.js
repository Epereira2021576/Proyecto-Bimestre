const Server = require('./models/server');

require('dotenv').config();

const server = new Server();

// Calling the listen() method from the Server class to start the server
server.listen();
