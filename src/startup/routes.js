import { json } from 'express';
import dhcp from '../routes/dhcp';
import dns from '../routes/dns';
import admin from '../routes/admin';
import auth from '../routes/auth';
import config from '../routes/config';
import error from '../routes/error';
import error from '../routes/log';

export default function(app) {
  app.use(json());
  app.use('/api/dhcp', dhcp);
  app.use('/api/dns', dns);
  app.use('/api/admin', admin);
  app.use('/api/auth', auth);
  app.use('/api/config',config);
  app.use(error);
}