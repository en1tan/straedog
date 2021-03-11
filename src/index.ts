import * as dotenv from 'dotenv';
import StraeDog from "./bot";


dotenv.config();

const botServer = new StraeDog();

botServer.startBot();
