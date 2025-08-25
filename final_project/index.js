import express from 'express';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { authenticated as customer_routes } from './router/auth_users.js';
import { general as genl_routes }  from './router/general.js';

const PORT =5000;

const app = express();

app.use(express.json());

app.use('/customer', session({
  secret: 'fingerprint_customer',
  resave: true,
  saveUninitialized: true,
}))

app.use("/customer/auth/*", (req, res, next) => {
  //Write the authenication mechanism here
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));
