const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';
    // Connect to database
    this.connectDB();
    // Middlewares
    this.middlewares();
    // Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS for content requests from any origin
    this.app.use(cors());

    // Parse and read body, server running and debugging
    this.app.use(express.json());

    // Public directory for content to be displayed
    this.app.use(express.static('public'));
  }

  routes() {
    /*this.app.use(this.usersPath, require('../routes/user.routes'));*/
  }

  // Method to start the server effective
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port', this.port);
    });
  }
}

module.exports = Server;
