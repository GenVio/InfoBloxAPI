import { Types } from 'mongoose';

export default function(req, res, next) {
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID.');
  
  next();
}