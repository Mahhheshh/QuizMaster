import express from "express";
import passport from "passport";
import session from "express-session";

import { IoManager } from './managers/IoManager';
import { UserManager } from './managers/UserManager';
import { authRouter } from "./routes/auth";
import "./googleAuth";

const ioPort = 3001;
const expressPort = 3000;

const io = IoManager.getIo();
io.listen(ioPort);

const userManager = new UserManager();

io.on('connection', (socket) => {
  userManager.addUser(socket);
});

const app = express();

app.use(session({
  secret: 'session-secreate',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);

app.listen(expressPort, () => {
  console.log("starting app on port 3000");
})