const { User } = require('../models/user');


let auth = (req, res, next) =>

{
    //인증 처리

    //클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //토큰을 복호화 한후 해당 토큰과 일치하는 유저 정보를 불러옴
    User.findByToken(token, (err, user) =>
    {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true});

        req.token = token;

        //req에 유저 정보가 담겨있다
        req.user = user;
        next();
    })

    //유저가 있으면 인증 ok

    //유저가 없으면 인증 no
    
}

module.exports = { auth };