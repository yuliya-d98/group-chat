const express = require('express');
const app = express();
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/mongo-adapter');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const HOST = process.env.host || 'localhost';
const SOCKET_PORT = 8080;

const DB = 'chat';
const USERS_COLLECTION = 'users';
const GROUPS_COLLECTION = 'groups';
const MESSAGES_COLLECTION = 'messages';
const originURLs = [
    'http://localhost:3000',
    // 'http://chat-yuliya-d98.herokuapp.com',
    'https://chat-yuliya-d98.herokuapp.com',
    'https://yuliya-d98.github.io',
];

// middlewares:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // It parses incoming JSON requests and puts the parsed data in req.body.
app.use(
    cors({
        credentials: true,
        origin: originURLs,
    })
);
// source: https://nodejsdev.ru/doc/sessions/
const oneYear = 365 * 86400e3;
const memoryStore = new session.MemoryStore();
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        cookie: { maxAge: oneYear },
        resave: true,
        store: memoryStore,
    })
);

const server = require('http').createServer(app);
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: originURLs,
    },
});

const mongoClient = new MongoClient(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.i0iwscx.mongodb.net/?retryWrites=true&w=majority`,
    {
        useUnifiedTopology: true,
    }
);

// source: https://socket.io/docs/v4/mongo-adapter/#usage-with-a-capped-collection
const getCollection = async (collectionName) => {
    try {
        let col = await mongoClient.db(DB).collection(collectionName);
        if (!col) {
            await mongoClient.db(DB).createCollection(collectionName, {
                capped: true,
                size: 1e6,
            });
            col = await mongoClient.db(DB).collection(collectionName);
        }
        return col;
    } catch (e) {
        console.error(e);
    }
};

const createUser = async (sessionId, usersCollection) => {
    const users = await usersCollection.find();
    const pathToFile = path.resolve(
        __dirname,
        '..',
        'assets',
        'img',
        'user',
        `${(users.length || 0) % 20}.jpg`
    );
    const imgData = fs.readFileSync(pathToFile).toString('base64');
    const username = `Пользователь ${(users.length || 0) + 1}`;
    await usersCollection.insertOne({
        username: username,
        img: imgData,
        sessionId: sessionId || 'example',
    });
};

const createGroup = async (groupName, groupsCollection, usersCollection) => {
    const groups = await groupsCollection.find();
    const users = await usersCollection.find();
    const pathToFile = path.resolve(
        __dirname,
        '..',
        'assets',
        'img',
        'group',
        `${(groups.length || 0) % 5}.jpg`
    );
    const imgData = fs.readFileSync(pathToFile).toString('base64');
    const memberIds = [];
    users.forEach((user) => memberIds.push(user._id));
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

    const usersCollection = await getCollection(USERS_COLLECTION);
    const groupsCollection = await getCollection(GROUPS_COLLECTION);
    const messagesCollection = await getCollection(MESSAGES_COLLECTION);
    io.adapter(createAdapter(usersCollection));
    io.adapter(createAdapter(groupsCollection));
    io.adapter(createAdapter(messagesCollection));

    // groupsCollection.deleteMany();
    // usersCollection.deleteMany();

    const commonGroup = await groupsCollection.findOne({ groupName: 'Common group' });
    if (!commonGroup) {
        await createGroup('Common group', groupsCollection, usersCollection);
        await createGroup('Common group 2', groupsCollection, usersCollection);
    }

    io.listen(SOCKET_PORT);

    await createUser('exampleUser', usersCollection);

    // socket.io
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('newMessage', (newMsg, date, chatId, authorId) => {
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
            if (!req.session.sessionID) {
                // новый пользователь
                const sessionId = req.sessionID;
                req.session.sessionID = sessionId;
                await createUser(sessionId, usersCollection);
            }
            const userInfo = await usersCollection.findOne({ sessionId: req.session.sessionID });
            return res.status(200).json(userInfo);
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    });
    app.get('/groups-info', async (req, res) => {
        try {
            const groups = await groupsCollection.find();
            return res.status(200).json(groups);
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    });

    app.post('/chat', (req, res) => {
        try {
            const chatId = req.query.id;

            return res.status(200).json(req.session);
        } catch (e) {
            return res.status(500).json('error', e);
        }
    });
};

main();

server.listen(PORT, () => {
    console.log('server started on port ', PORT);
});
