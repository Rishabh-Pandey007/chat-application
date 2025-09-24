const corsOptions = {
    origin:[
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
        process.env.CLIENT_URL
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
};

const CHATTU_TOKEN = 'chattu-token';

export { corsOptions, CHATTU_TOKEN};