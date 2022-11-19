const express = require('express');
const app = express();
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/mongo-adapter');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const { mongoose } = require('mongoose');

const PORT = process.env.PORT || 5000;
const HOST = process.env.host || 'localhost';
const SOCKET_PORT = 8080;

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.i0iwscx.mongodb.net/?retryWrites=true&w=majority`;
const DB = 'chat';
const USERS_COLLECTION = 'users';
const GROUPS_COLLECTION = 'groups';
const MESSAGES_COLLECTION = 'messages';
const collections = [USERS_COLLECTION, GROUPS_COLLECTION, MESSAGES_COLLECTION];
const commonGroupsNames = ['Common group', 'Common group 2'];
const corsOptions = {
  credentials: true,
  origin: [
    'http://localhost:3000',
    // 'http://chat-yuliya-d98.herokuapp.com',
    'https://chat-yuliya-d98.herokuapp.com',
    'https://yuliya-d98.github.io',
  ],
};
const oneYear = 365 * 86400e3;
const cookiesOptions = {
  maxAge: oneYear,
  secure: false,
  // sameSite: 'none',
  httpOnly: true,
};
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  cookie: cookiesOptions,
  resave: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    dbName: 'sessions',
    ttl: oneYear,
  }),
});
const numOfUserPics = 20;
const numOfGroupPics = 5;

// middlewares:
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // It parses incoming JSON requests and puts the parsed data in req.body.
app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(function (req, res, next) {
  let userId = req.cookies['userId'];
  if (!userId) {
    userId = req.sessionID;
    res.cookie('userId', userId, cookiesOptions);
  }
  next();
});

const server = require('http').createServer(app);

const io = new Server(server, { cors: corsOptions });
// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

const mongoClient = new MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});

const createUser = async (userId, usersCollection, groupsCollection) => {
  const users = await usersCollection.find();
  const usersArray = await users.toArray();
  const pathToFile = path.resolve(
    __dirname,
    '..',
    'assets',
    'img',
    'user',
    `${(usersArray.length || 0) % numOfUserPics}.jpg`
  );
  const imgData = fs.readFileSync(pathToFile).toString('base64');
  const username = `Пользователь ${(usersArray.length || 0) + 1}`;
  await usersCollection.insertOne({
    username: username,
    img: imgData,
    userId: userId,
  });
  const groups = commonGroupsNames.map((g) => {
    return { groupName: g };
  });
  await groupsCollection.updateMany(
    {
      $or: groups,
    },
    { $push: { groupMembersIds: userId } }
    // { $set: { groupMembersIds: [...groupMembersIds, userId] } }
  );
  // const groupsArray = await groups.toArray();
  console.log('user created!');
};

const createGroup = async (groupName, groupsCollection, usersCollection) => {
  const groups = await groupsCollection.find();
  const groupsArray = await groups.toArray();
  const users = await usersCollection.find();
  const usersArray = await users.toArray();
  const memberIds = usersArray.map((user) => user.userId);
  const pathToFile = path.resolve(
    __dirname,
    '..',
    'assets',
    'img',
    'group',
    `${(groupsArray.length || 0) % numOfGroupPics}.jpg`
  );
  const imgData = fs.readFileSync(pathToFile).toString('base64');
  await groupsCollection.insertOne({
    groupName: groupName,
    groupImg: imgData,
    groupMembersIds: memberIds,
    unseenCount: 0,
    lastMsgInfo: null,
  });
};

const main = async () => {
  await mongoClient.connect();

  const usersCollection = mongoClient.db(DB).collection(USERS_COLLECTION);
  const groupsCollection = mongoClient.db(DB).collection(GROUPS_COLLECTION);
  const messagesCollection = mongoClient.db(DB).collection(MESSAGES_COLLECTION);
  collections.forEach((collection) => {
    const col = mongoClient.db(DB).collection(collection);
    if (!col.isCapped()) {
      mongoClient.db(DB).runCommand({ convertToCapped: collection, size: 100000 });
    }
  });

  // groupsCollection.deleteMany();
  // usersCollection.deleteMany();
  // messagesCollection.deleteMany();

  const commonGroup = await groupsCollection.findOne({ groupName: 'Common group' });
  if (!commonGroup) {
    await createGroup(commonGroupsNames[0], groupsCollection, usersCollection);
    await createGroup(commonGroupsNames[1], groupsCollection, usersCollection);
  }

  // socket.io
  io.on('connection', (socket) => {
    console.log('user connected');
    const user = socket.request.session.userInfo;
    // socket.broadcast.emit('user connected', `User ${user.username} connected`);

    socket.on('send message', async (newMsg, dateStr, chatId, authorId) => {
      const message = {
        text: newMsg,
        date: dateStr,
        author: {
          authorId: user.userId,
          photo: user.img,
          name: user.username,
        },
        groupId: chatId,
      };
      await messagesCollection.insertOne(message);
      const savedMsg = await messagesCollection.findOne(message);
      const objId = new ObjectId(chatId);
      await groupsCollection.updateOne({ _id: objId }, { $set: { lastMsgInfo: savedMsg } });
      socket.emit('get message', chatId, savedMsg);
      socket.emit('update last message', chatId, savedMsg);
      // socket.broadcast.emit('get message', message);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  // HTTP requests to http://localhost:5000/
  app.get('/user-info', async (req, res) => {
    try {
      const userId = req.cookies['userId'] || req.sessionID;
      let userInfo = await usersCollection.findOne({ userId: userId });
      if (!userInfo) {
        await createUser(userId, usersCollection, groupsCollection);
        userInfo = await usersCollection.findOne({ userId: userId });
      }
      req.session.userInfo = userInfo;
      return res.status(200).json(userInfo);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  });
  app.get('/groups-info', async (req, res) => {
    try {
      const userId = req.cookies['userId'] || req.sessionID;
      const groups = await groupsCollection.find({ groupMembersIds: { $in: [userId] } });
      const groupsArray = await groups.toArray();
      return res.status(200).json(groupsArray);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  });
  app.get('/group', async (req, res) => {
    try {
      const chatId = req.query.id;
      const objId = new ObjectId(chatId);
      const group = await groupsCollection.findOne({ _id: objId });
      return res.status(200).json(group);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  });

  app.get('/messages', async (req, res) => {
    try {
      const groupId = req.query.groupId;
      const messages = await messagesCollection
        .find({ groupId: groupId })
        .sort({ date: 1 })
        .limit(100);
      const messagesArray = await messages.toArray();
      return res.status(200).json(messagesArray);
    } catch (e) {
      console.log(e);
      return res.status(500).json('error', e);
    }
  });

  // const adapterOptions = {
  //     heartbeatInterval: 15000,
  // };

  // io.adapter(createAdapter(usersCollection, adapterOptions));
  // io.adapter(createAdapter(groupsCollection, adapterOptions));
  // io.adapter(createAdapter(messagesCollection, adapterOptions));
};

main();

io.listen(SOCKET_PORT);
server.listen(PORT, () => {
  console.log('server started on port ', PORT);
});
