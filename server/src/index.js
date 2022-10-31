const express = require('express');
const app = express();
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/mongo-adapter');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;
const HOST = process.env.host || 'localhost';
const SOCKET_PORT = 8080;

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.i0iwscx.mongodb.net/?retryWrites=true&w=majority`;
const DB = 'chat';
const USERS_COLLECTION = 'users';
const GROUPS_COLLECTION = 'groups';
const MESSAGES_COLLECTION = 'messages';
const collections = [USERS_COLLECTION, GROUPS_COLLECTION, MESSAGES_COLLECTION];
const originURLs = [
    'http://localhost:3000',
    // 'http://chat-yuliya-d98.herokuapp.com',
    'https://chat-yuliya-d98.herokuapp.com',
    'https://yuliya-d98.github.io',
];
const corsOptions = {
    credentials: true,
    origin: originURLs,
};
const oneYear = 365 * 86400e3;
const cookiesOptions = {
    maxAge: oneYear,
    secure: false,
    // sameSite: 'none',
    httpOnly: true,
};
const numOfUserPics = 20;
const numOfGroupPics = 5;

// middlewares:
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // It parses incoming JSON requests and puts the parsed data in req.body.
app.use(cors(corsOptions));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        cookie: cookiesOptions,
        resave: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            dbName: 'sessions',
            ttl: oneYear,
        }),
    })
);
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
const mongoClient = new MongoClient(MONGO_URL, {
    useUnifiedTopology: true,
});

const createUser = async (userId, usersCollection) => {
    const users = await usersCollection.find();
    const usersArray = await users.toArray();
    // console.log('all users  = ', usersArray);
    console.log('all users length in createUser = ', usersArray.length);
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
    console.log('user created!');
};

const createGroup = async (groupName, groupsCollection, usersCollection) => {
    const groups = await groupsCollection.find();
    const groupsArray = await groups.toArray();
    const users = await usersCollection.find();
    const memberIds = await users.toArray();
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
        lastMsgId: null,
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

    groupsCollection.deleteMany();
    usersCollection.deleteMany();

    const commonGroup = await groupsCollection.findOne({ groupName: 'Common group' });
    if (!commonGroup) {
        await createGroup('Common group', groupsCollection, usersCollection);
        await createGroup('Common group 2', groupsCollection, usersCollection);
    }

    console.log('main function started');

    // socket.io
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('send message', (newMsg, dateStr, chatId, authorId) => {
            const date = Date.parse(dateStr);
            console.log(newMsg, date, chatId, authorId);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    // HTTP requests to http://localhost:5000/
    app.get('/user-info', async (req, res) => {
        // req.query.id
        try {
            console.log('get request started');
            const userId = req.cookies['userId'] || req.sessionID;
            let userInfo = await usersCollection.findOne({ userId: userId });
            if (!userInfo) {
                await createUser(userId, usersCollection);
                userInfo = await usersCollection.findOne({ userId: userId });
            }
            return res.status(200).json(userInfo);
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    });
    app.get('/groups-info', async (req, res) => {
        try {
            const groups = await groupsCollection.find({});
            const groupsArray = await groups.toArray();
            return res.status(200).json(groupsArray);
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    });

    app.post('/chat', (req, res) => {
        try {
            const chatId = req.query.id;

            return res.status(200).json(chatId);
        } catch (e) {
            return res.status(500).json('error', e);
        }
    });

    const adapterOptions = {
        // heartbeatInterval: 15000,
    };

    // io.adapter(createAdapter(usersCollection, adapterOptions));
    // io.adapter(createAdapter(groupsCollection, adapterOptions));
    // io.adapter(createAdapter(messagesCollection, adapterOptions));
};

main();

io.listen(SOCKET_PORT);
server.listen(PORT, () => {
    console.log('server started on port ', PORT);
});
