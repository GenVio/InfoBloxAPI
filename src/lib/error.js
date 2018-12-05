import { error } from 'winston';

export default function(err, req, res, next){
  error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug 
  // silly

  res.status(500).send('Something failed.');
}