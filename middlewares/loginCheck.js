const loginCheck = (req,res,next) => {
    if(!req.session.userId){
        return res.redirect('/login?required=login')
    }
    req.userId = req.session.userId
    next()
}

module.exports = {loginCheck}
