const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/user');
const mongoose = require('mongoose');
const config = require('./config/key');


app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());



mongoose.connect(config.mongoURI,
{
    useNewUrlParser:true, useUnifiedTopology: true, userCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected....')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) =>
{
  //회원 가입 정보 클라이언트에서 가져와 데이터베이스에 삽입

  const user = new User(req.body);

  user.save((err, userInfo) =>
  {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})