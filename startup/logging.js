import { handleExceptions, transports, add } from 'winston';

import 'express-async-errors';

export default function() {
  handleExceptions(
    new transports.Console({ colorize: true, prettyPrint: true }),
    new transports.File({ filename: 'uncaughtExceptions.log' }));
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  
  add(transports.File, { filename: 'azurevm-logfile.log' });

}