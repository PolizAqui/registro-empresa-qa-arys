const express =require('express')
const cors = require('cors')
const _var = require('./global/_var.js')
const app = express(); 

/******** ROUTES *******/

const router = require('./routes/auth.routes.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/******** SERVER *******/

app.listen(_var.PORT, (err) => {
    if (err) throw err
    console.log(`Servidor Ejecutandose en: http://locahost:${_var.PORT}`);
}) 

//Exports

app.use(router)