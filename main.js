const express = require('express');
const upload = require('express-fileupload');
const cookiePaser = require('cookie-parser');
const limiter = require('express-rate-limit');
const jsonwebtoken = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { name } = require('ejs');
require('dotenv').config()
const app = express();
app.use(express.json());
app.use(upload());
app.use(cookiePaser());
// app.use(limiter({
//     windowMs: 5000,//15 * 60 * 1000, // 15 minutes
//     max: 5 ,// limit each IP to 100 requests per windowMs
//     message:{
//         code : 429,
//         message: 'Too many requests'
//     }
// }));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
const registerLimit = limiter({
    windowMs: 5000,//15 * 60 * 1000, // 15 minutes
    max: 5,// limit each IP to 100 requests per windowMs
    message: {
        code: 429,
        message: 'Too many requests'
    }
})
app.post('/', registerLimit, (req, res) => {
    if (req.files) {
        const file = req.files.file;
        const filename = file.name;
        file.mv('./uploads/' + filename, function (err) {
            if (err) {
                res.send(err)
            } else {
                res.send("file uploaded");
            }
        })
    }
})
//ppwuxqlwmojcufvb

app.get('/set-cookie', function (req, res) {
    // res.setHeader('Set-Cookie', 'name=value');
    res.cookie('name', "application", {
        //maxAge:2000 //2 second  maxmium time cookie as been deleted
        // expires:new Date("3 june 2023")
        httpOnly: true, //cannot access by client side this cookie
        secure: true,
        //domain: "http://localhost:4000"
        //sameSite: true
    })
    res.send('Set Cookie');
})
app.get('/get-cookie', function (req, res) {
    res.send(req.cookies.name);
})
app.get('/del-cookie', function (req, res) {
    res.clearCookie('name');
    res.send('Del Cookie');
});

app.post('/login', async function (req, res) {
    const username = req.body.username;
    const user = { name: username }
    let accesstoken = await jsonwebtoken.sign(user, process.env.ACCESS_TOKEN);
    res.json({ accesstoken: accesstoken });
});


const posts = {
    name: "appu1",
    title: "post 1",
}

// const authenticated = (req, res,next) => {
//     const authHeader = req.headers['authorization'] ;
//     const token = authHeader && authHeader.split('')[1];
//     if(!token) return res.sendStatus(401);
//     jsonwebtoken.verify(token,process.env.ACCESS_TOKEN,(err, user)=>{
//         if(err){
//             return res.sendStatus(403);
//         }

//         req.user = user;
//         next();
//     })
// }

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    let s =authHeader
    console.log('authent',s)
   
    if (!token) return res.sendStatus(401)

    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        console.log(err);

        if (err) { return res.sendStatus(403) }

        req.user = user;
        next();
    })
}

app.get("/posts", authenticateToken, (req, res) => {
    console.log(req.user.name);
    res.status(200).json({
        status: 'success',
        message: 'Logged In User Information.',
        data: {
          user: {
              username: req.user.name,
          },
        },
      });
    //res.json(posts.filter(post => { post.name === req.user.name }));
    //res.send(posts.filter)
})
app.get("/check/:token", function (req, res) {
    let token = req.params.token;
    try {
        let result = jsonwebtoken.verify(token, "nefnjrgnngkgni3n3nn3kgnk3nn3nk",
            // {
            //     expiresIn:"1m"
            // }
        );
        if (result) {
            res.json({ message: "valid" });
        } else {
            res.status(500).json({ message: "something invalid" })
        }
    } catch (e) {
        res.status(401).json({ message: "invalid" });
    }

});
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)


sslServer.listen(port, process.env.HOST, () => {
    console.log(`Server is running on port ${port}`);
})