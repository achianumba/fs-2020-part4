const http = require('http'); // 0. Import http module
const PORT = require('./utils/config').PORT;

const server = http.createServer(require('./app'));  //pass import app and pass it as a callback

server.listen(PORT, () => {
  // 2. Require and use logger middleware
  require('./utils/logger').info(`Server running on port ${PORT}`);
});