set -x NODE_ENV test

ts-node src/index.ts
wait 
jest