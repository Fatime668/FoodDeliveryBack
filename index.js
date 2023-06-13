const express = require('express');
const { default: mongoose } = require('mongoose');
const { db } = require('./config/db');
const bcrypt = require('bcrypt')
const jwt= require("jsonwebtoken")
const app = express()
const router= require("./routes/userRoutes")
const User = require('./models/user');

app.use(express.json())
db.connect();
let privateKey = "gojira"
const saltRounds = 10;
// let expireDate = 300


app.use((req, res, next) => {


    // token a gelmek isterse de next diyorum. Çünkü public page
    if (req.url === "/token" || req.url === '/api/users/register'||req.url === '/api/users/login') {
        next();
    }
    else {
        if (req.headers.authorization) {
            //Bearer şkmgkmgeqklqgeklqklfwqkşwqmşlfqwmşlfqw
            let data = req.headers.authorization.split(' ');

            if (data.length == 2 && data[0] == "Bearer") {

                let token = data[1]

                try {
                    jwt.verify(token, privateKey)
                    next();
                } catch (error) {
                    res.status(401).json({ "message": "token error" })
                }

            }
            else {
                res.status(401).json({ "message": "token error" })

            }

        }
        else {
            res.status(401).json({ "message": "token error" })
        }
    }


})

app.use('/api/users',router)


//token generate edeceğim login ucunu acıyorum

app.post('/token', (req, res) => {


    User.findOne({ email: req.body.email })
        .then(data => {
            bcrypt.compare(req.body.password, data.password, function (err, result) {

                if (result) {
                    let token = jwt.sign({ email: req.body.email }, privateKey, {
                        algorithm: 'HS256',
                        expiresIn: expireDate,
                        issuer: 'iron maiden ın tokenı'
                    })
                    res.json({ "token": token })
                }
                else {
                    res.status(401).json({ "message": "Access denied" })

                }

            });

        })

})




app.listen(3001,()=>{
    console.log("Server is running ...");
})