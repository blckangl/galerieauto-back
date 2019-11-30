import SampleServer from './server/sampleserver';
import {CONSTANTS} from "./config/constants";

let server;
server = new SampleServer();
server.start(CONSTANTS.PORT);

