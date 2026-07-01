import { Hono, type Context } from 'hono';
import { app as users } from '../modules/user/user.service.js';

const main = new Hono();

main.route("/api", users);


export default main;