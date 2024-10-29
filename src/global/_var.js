require('dotenv').config();

/******* SERVER ******/

const PORT   =   process.env.PORT

/******* DATABASE ********/

const PG_USER = process.env._USER
const PG_HOST = process.env._HOST
const PG_NAME = process.env._NAME
const PG_PASS = process.env._PASS

/******** KEY ********/

const KEY = process.env.KEY


/******* ROUTER *******/

REGISTER  = process.env.REGISTER


module.exports = {
    //server
    PORT,
    //DATABASE
    PG_HOST,
    PG_NAME,
    PG_PASS,
    PG_USER,
    //KEY
    KEY,
    //Routes
    REGISTER
}