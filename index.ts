import 'reflect-metadata';
import { server } from './src/server';

console.log(`🔭  Launching server! Running in ` + process.env.NODE_ENV + ` environment!`);

server();
