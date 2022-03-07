import dotenv from "dotenv";
import elasticsearch from "elasticsearch";
dotenv.config();

const client = new elasticsearch.Client({
    host: process.env.ES_HOST,
    log: process.env.ES_LOG
});

export default client;