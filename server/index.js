const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/user');
const mongoose = require('mongoose');
const config = require('./config/key');
//const user = require('./models/user');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(cookieParser());


mongoose.connect(config.mongoURI,
{
    useNewUrlParser:true, useUnifiedTopology: true, userCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected....')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/api/hello', (req, res) => {
  res.send('Hello Worasdld!')
})

app.post('/api/users/register', (req, res) =>
{
  //회원 가입 정보 클라이언트에서 가져와 데이터베이스에 삽입

  const user = new User(req.body);
 // console.log(this);

  user.save((err, userInfo) =>
  {
   //console.log(this);
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) =>
{
  //요청된 이메일을 데이터베이스 안에서 찾는다
  User.findOne({email: req.body.email}, (err, user) =>
  {
    if(!user) 
    {
      return res.json({
        loginSuccess: false,
        message: "이메일이 없습니다"
      })
    }
    //console.log(user);
     //요청된 이메일이 데이터베이스에 있다면 비밀번호 확인

    user.comparePassword(req.body.password, (err, isMatch) =>
    {

      if(err) res.json({
        loginSuccess: false,
        err: err
      })
      if(!isMatch) res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다"
      })
    })

    //비밀번호 맞다면 유저토큰 생성

    user.generateToken((err, user) =>
    {
      if(err) return res.status(400).send(err);

      //토큰을 저장한다 -> 쿠키, 로컬스토리지 등
      res.cookie('x_auth', user.token)
      .status(200)
      .json({loginSuccess: true, userID: user._id});

      //console.log("ok");

    })
  })
})
app.get('/api/users/test', (req, res) =>
{
  var a = User.test(req);
 //console.log(User);
  res.json({ message: a});
})

app.get('/api/users/auth', auth, (req, res) =>
{

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role ===0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role
  })
})

app.get('/api/users/logout', auth, (req, res) =>
{
  console.log(req);
  User.findOneAndUpdate({ _id: req.user._id}, { token: "" }, (err, user) =>
  {
    if(err) return res.json({ success: false, err});
    return res.status(200).send({ success:true });
  })
})





app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})