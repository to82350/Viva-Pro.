const express = require("express"); 
const app = express();
const port = 8000; // react의 기본값은 3000이니까 3000이 아닌 아무 수
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql"); // mysql 모듈 사용
const jwt = require('jsonwebtoken');
const { mysql: cMysql, secretInfo } = require('./config');

const connection = mysql.createConnection({
    host: cMysql.host,
    user: cMysql.user,
    password: cMysql.password,
    database: cMysql.database
});
connection.connect();
 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// // spec: app.get(주소, 콜백함수);
app.get('/', (req, res) => {
    const Uid = req.query.Uid;
    // visitor
    connection.query(`SELECT * from SENTENCE WHERE Uid = "${Uid ? Uid : 'visitor'}" ORDER BY Snumber`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

app.post('/manage/confirm',(req, res) => {
  const {Uid, Snumber, Wid} = req.body.params;
  connection.query(`CALL AcceptReport('${Uid}', ${Snumber}, ${Wid})`, function (error, results, fields) {
    if (error) throw error;
    res.send({
      payload: true
    });
  });
});

app.post('/manage/reject',(req, res) => {
  const {Snumber, Uid} = req.body.params;
  connection.query(`UPDATE REPORT SET Rstate = 1 WHERE Snumber = ${Snumber} AND Uid = "${Uid}"`, function (error, results, fields) {
    if (error) throw error;
    res.send({
      payload: true
    });
  });
});

app.get('/report', (req, res) => {
    connection.query(`SELECT * from REPORT`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

app.get('/origin', (req,res) => {
   connection.query(`SELECT Rdate, Rstate, Uid, Snumber, F_PrintOriginSentence(Uid, Snumber) AS sentence FROM REPORT ORDER BY Rdate`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

app.get('/modify',(req, res) => {
    connection.query(`SELECT Rdate, Rstate, Uid, Snumber, F_PrintReportSentence(Uid, Snumber) AS sentence FROM REPORT ORDER BY Rdate`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

app.get('/history',(req, res) => {

    const Uid = req.query.Uid;

    connection.query(`SELECT Sdate, Uid, Snumber, F_PrintOriginSentence(Uid, Snumber) AS sentence FROM SENTENCE WHERE Uid = "${Uid ? Uid : 'visitor'}"`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

app.get('/detailList',(req,res) => {
    console.log('areqrequrqeureuqu',req.query);
    connection.query(`SELECT * from WORD WHERE Snumber = ${req.query.id} AND Uid = "${req.query.Uid || 'visitor'}"`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

app.post('/insert', (req, res) => {
    // console.log(req.body.params);
    const { Uid, Snumber, Wid, Wspos, Wepos, Wform, Wtag } = req.body.params;
    connection.query(`INSERT INTO REPORT VALUES(${Wspos}, ${Wepos}, '${Wtag}', NOW(), '${Uid || 'visitor'}', ${Snumber}, ${Wid}, 0)`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

app.post('/register', (req,res) => {
    console.log(req.body);
    const {email: Uid, password: Upassword, name: Uname} = req.body;
    connection.query(`INSERT INTO USER VALUES('${Uid}', '${Upassword}', '${Uname}')`, function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

// Create a token from a payload
function createToken(payload) {
    const SECRET_KEY = secretInfo.key;
    return jwt.sign(payload, SECRET_KEY);
}

app.post('/login', (req,res) => {

  const {Uid, Upassword} = req.body.params;
  connection.query(`SELECT * FROM USER where Uid = '${Uid}' AND Upassword = '${Upassword}'`, function (error, results, fields) {
      if (error) throw error;

      const checkUser = results.findIndex(user => user.Uid === Uid && user.Upassword === Upassword);
      console.log(checkUser);
      if(checkUser === -1) {
        const message = 'Incorrect email or password';
        res.json({message});
        return;
      }
      const access_token = createToken({email: Uid, password: Upassword});
      console.log('Access Token:' + access_token);

      res.status(200).json({Uid, access_token});
      });
});

// app.get('/getUser', (req,res) => {
//     connection.query(`SELECT * FROM USER`, function (error, results, fields) {
//       if (error) throw error;
//       res.send(results);
//     });
// });

app.listen(port, () => {
    console.log('Run Auth API Viva Pro. Server');
});

// const fs = require('fs');
// const jsonServer = require('json-server');
// const jwt = require('jsonwebtoken');

// const server = jsonServer.create();
// const router = jsonServer.router('./db.json');
// const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

// // console.log('userdb>>>>>>>>', userdb.accessToken);

// server.use(bodyParser.urlencoded({extended: true}));
// server.use(bodyParser.json());
// server.use(jsonServer.defaults());

// const SECRET_KEY = '123456789';

// const expiresIn = '1h';

// // Create a token from a payload
// function createToken(payload) {
//     return jwt.sign(payload, SECRET_KEY, {expiresIn});
// }

// // Verify the token
// function verifyToken(token) {
//     return jwt.verify(token, SECRET_KEY, (err, decode) => (decode !== undefined ? decode : err));
// }

// // Check if the user exists in database
// function isAuthenticated({email, password}) {
//     return (
//         userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
//     );
// }

// // Register New User
// server.post('/auth/register', (req, res) => {
//     console.log('register endpoint called; request body:');
//     console.log(req.body);
//     const {email, password, name} = req.body;

//     if (isAuthenticated({email, password})) {
//         const status = 401;
//         const message = 'Email and Password already exist';
//         res.status(status).json({status, message});
//         return;
//     }

//     fs.readFile('./users.json', (err, data) => {
//         if (err) {
//             const status = 401;
//             const message = err;
//             res.status(status).json({status, message});
//             return;
//         }

//         // Get current users data
//         let parsedData = JSON.parse(data.toString());

//         // Get the id of last user
//         let last_item_id = parsedData.users[parsedData.users.length - 1].id;

//         //Add new user
//         parsedData.users.push({
//             id: last_item_id + 1,
//             email,
//             password,
//             name,
//         }); //add some data

//         fs.writeFile('./users.json', JSON.stringify(parsedData), (err, result) => {
//             // WRITE
//             if (err) {
//                 const status = 401;
//                 const message = err;
//                 res.status(status).json({status, message});
//                 return;
//             }
//         });
//         res.status(200).json({payload: true});
//     });
// });

// // Login to one of the users from ./users.json
// server.post('/auth/login', (req, res) => {
//     console.log('login endpoint called; request body:');
//     console.log(req.body);
//     const {email, password} = req.body;
//     if (isAuthenticated({email, password}) === false) {
//         const status = 401;
//         const message = 'Incorrect email or password';
//         res.status(status).json({status, message});
//         return;
//     }
//     const access_token = createToken({email, password});
//     console.log('Access Token:' + access_token);
//     res.status(200).json({access_token});
// });

// server.use(/^(?!\/auth|\/posts|\/categories|\/token).*$/, (req, res, next) => {
//     if (
//         req.headers.authorization === undefined ||
//         req.headers.authorization.split(' ')[0] !== 'Bearer'
//     ) {
//         const status = 401;
//         const message = 'Error in authorization format';
//         res.status(status).json({status, message});
//         return;
//     }
//     try {
//         let verifyTokenResult;
//         verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

//         if (verifyTokenResult instanceof Error) {
//             const status = 401;
//             const message = 'Access token not provided';
//             res.status(status).json({status, message});
//             return;
//         }
//         next();
//     } catch (err) {
//         const status = 401;
//         const message = 'Error access_token is revoked';
//         res.status(status).json({status, message});
//     }
// });

// server.use(router);

// server.listen(port, () => {
//     console.log('Run Auth API Server');
// });
