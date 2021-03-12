const StraeDog = require('./bot');

require('dotenv').config();

const botServer = new StraeDog();

botServer.startBot();
