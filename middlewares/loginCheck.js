const loginCheck = (req,res,next) => {
    if(!req.session.userId){
        return res.redirect('/login?required=login')
    }
    next()
}

module.exports = {loginCheck}
