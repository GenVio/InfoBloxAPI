// Antonio Luevano - 2018
//
import express from "express";
import { urlencoded } from "body-parser";
import morgan from "morgan";
import { readFileSync } from "fs";
import { createServer } from "https";
import extend from "extend";

const mojosecret = JSON.parse(readFileSync('conf/config.json')).mojosecret;
const allowedips = JSON.parse(readFileSync('conf/config.json')).allowedips;

process.env['NODE_TLS_REJECT_UNAUTHORIZED']='0';

const app = express();
app.use(morgan('combined'));
app.use(urlencoded({extended:true}));
app.use(function (req,res,next) {
  if(allowedips===undefined) next();
  else {
    console.log(req.ip);
    console.log(allowedips.indexOf(req.ip));
    if(allowedips.indexOf(req.ip)>=0) next();
    else res.status(401).send('not authorized').end();
  }
});

import _dhcp from './lib/dhcp.js';
const dhcp = new _dhcp();
import _dns from './lib/dns.js';
const dns = new _dns();

app.route('/features')
  .get(function (req,res) {
    res.send('["dhcp","dns"]').end();
  });

app.route('/version')
  .get(function(req,res) {
    res.send('{"version":"1.17.0","modules":{"dns":"1.17.0","dhcp":"1.17.0"}}').end();
  });

app.route('/dhcp')
  .get(dhcp.dhcp);

app.route('/dhcp/:network/unused_ip')
  .get(dhcp.unused_ip);

app.route('/dhcp/:network/:ip')
  .get(dhcp.reservation_info);

app.route('/dhcp/:network/mac/:mac')
  .get(dhcp.search_mac)
  .delete(dhcp.delete_reservation);

app.route('/dhcp/:network/ip/:ip')
  .get(dhcp.search_ip)

app.route('/dhcp/:network')
  .post(dhcp.create_reservation);

app.route('/dns')
  .post(dns.create);

app.route('/dns/:value')
  .delete(dns.delete);

app.route('/dns/:value/A')
  .delete(dns.deleteA);

app.route('/'+mojosecret+'/auto/:networkname/:value')
  .put(dns.autocreate)
  .delete(dns.deleteA);

console.log("starting up....");
try {
 // var privateKey  = readFileSync('conf/ssl.key', 'utf8');
 // var certificate = readFileSync('conf/ssl.pem', 'utf8');
 // var credentials = {key: privateKey, cert: certificate};
  var httpsServer = createServer(credentials, app);
  httpsServer.listen(8443);
  app.listen(8080,'localhost'); // for internal com
  console.log("Listening on 8443");
} catch (e) {
  console.log("SSL startup failed "+e);
  console.log("Listening on 8080");
  app.listen(8080);
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("node NOT exiting...");
});
