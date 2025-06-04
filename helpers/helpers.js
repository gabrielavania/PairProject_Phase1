const noPwd = (userInstance) =>{
    if(!userInstance) return null
    const user = userInstance.get ? userInstance.get({plain : true}) : {...userInstance}
    delete user.password
    return user
}

module.exports = {
    noPwd
}