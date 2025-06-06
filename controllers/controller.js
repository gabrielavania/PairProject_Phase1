const bcrypt = require('bcryptjs');
const { Op } = require("sequelize")
const { User, Profile, Post, Category, Comment } = require('../models');
const { noPwd } = require('../helpers/helpers');
const  cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');


class Controller {

    static async X(req, res) {
        try {
            res.send("Hello")
        } catch (error) {
            res.send(error)
        }
    }
    //HOME ROUTE
    static async showHome(req, res) {
        try {
            let userLogOn
            userLogOn = req.session.username
            res.render("home", { userLogOn })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    //AUTH ROUTES
    static async showLogin(req, res) {
        try {
            let { logout, required } = req.query
            res.render("loginPage", { logout, required })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async actualLogin(req, res) {
        try {
            let { username, password } = req.body
            let loginCredentials = await User.findOne({
                where: {
                    username
                }
            })
            if (loginCredentials) {
                let validPassword = await bcrypt.compare(password, loginCredentials.password)
                if (validPassword) {
                    //SAVE SESSIONS HERE
                    req.session.userId = loginCredentials.id
                    req.session.username = loginCredentials.username
                    res.redirect("/")
                } else {
                    throw "Invalid Username or Password"
                }
            } else {
                //FAILED LOGIN PERLU NEED TO / REDIRECT
                throw "Invalid Username or Password"
            }
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async logOut(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.log("Cannot logout lmao");
                    console.log(err);
                    throw err
                }
                res.redirect(`/login?logout=success`)
            })
        } catch (error) {
            console.log();
            res.send(error)
        }
    }

    static async showRegister(req, res) {
        try {
            let {errors} = req.query
            if(errors){
                errors = errors.split(",")
            }
            res.render("registerPage",{errors})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async actualRegister(req, res) {
        try {
            let { username, password } = req.body
            await User.create({ username, password })
            res.redirect("/login")
        } catch (error) {
            if (error.name == "SequelizeValidationError" || error.name == 'SequelizeUniqueConstraintError') {
                let msg = error.errors.map(el => el.message)
                msg = msg.join(",")
                res.redirect(`/register?errors=${msg}`)
            }
            console.log(error);
            res.send(error)
        }
    }

    //PROFILE ROUTES

    static async showUserProfile(req, res) {
        try {

            const userId = req.userId
            let data = await Profile.findOne({
                where: { user_id: userId },
                include: User
            }
            )
            if (!data) {
                throw "Profile not found"
            }

            let plainData = data.get({ plain: true })
            plainData.User = noPwd(plainData.User)
            res.render("userProfile", { plainData })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showEditprofile(req, res) {
        try {
            const userId = req.userId
            let data = await Profile.findOne({
                where: {
                    user_id: userId
                },
                include: User
            })

            let plainData = data.get({ plain: true })
            plainData.User = noPwd(plainData.User)
            // console.log(JSON.stringify(plainData,null,2));
            res.render("editProfile", { plainData })
            // res.send(plainData)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async saveEditProfile(req, res) {
        try {
            let userId = req.userId;
            let { name, email, discordId } = req.body;

            let profile = await Profile.findOne({ where: { user_id: userId } });
            
            if (!profile) {
                throw new Error('Profile not found');
            }

            let imageURL = profile.imageURL;

            if(req.file){
                const streamUploader = (req) => {
                    return new Promise ((resolve,reject) => {
                        const stream = cloudinary.uploader.upload_stream((error,result) => {
                            console.log(result + "<<<<<<<<<<<<<<")
                            if (result){
                                resolve(result)
                            } else {
                                reject(result)
                            }
                        });
                        streamifier.createReadStream(req.file.buffer).pipe(stream)
                    })
                }
                const result = await streamUploader(req)
                console.log(result + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                imageURL = result.secure_url
            }

            console.log(imageURL + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

            await profile.update({
                name,
                email,
                discordId,
                imageURL
            });

            res.redirect(`/profile?success=update`);

        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }

    static async userDasboard(req, res) {
        try {
            const { search } = req.query;

            let options = {
                include: [Category],
                order: [['createdAt', 'DESC']]
            };

            if (search) {
                options.where = {
                    title: {
                        [Op.iLike]: `%${search}%`
                    }
                };
            }

            const posts = await Post.findAll(options)
            const category = await Category.findAll()
            // console.log(category)

            // res.send(posts)
            res.render("userDashboard", {posts, search, category})
        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }

    static async getAllPosts(req, res) {
        try {
            const { search } = req.query;

            let options = {
                include: Category,
                order: [['createdAt', 'DESC']]
            };

        if (search) {
            options.where = {
                title: {
                [Op.iLike]: `%${search}%`
                }
            };
        }
            
            const posts = await Post.findAll(options)
            const category = await Category.findAll()
            // console.log(category)
    
            // res.send(posts)
            res.render("posts", {posts, search, category})
        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }

    static async detailPost(req, res) {
        try {
            const { id } = req.params
            const posts = await Post.findByPk(+id)
            const category = await Category.findByPk(+id)

            const comments = await Comment.findAll({
                where: { post_id: id }
            })
            // console.log(posts)

            res.render("detailPost", { posts, comments, category, id })
        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }

    static async showFormAdd(req,res) {
        try {
            const posts = await Post.findAll();

            res.render('addPost', { posts });
        } catch (error) {
            console.log(error);

            res.send(error);
        }
    }

    static async saveFormAdd(req,res) {
        try {
            let { title, body } = req.body;

            await Post.create({ 
                title, 
                body 
            });

            res.redirect('/posts');
        } catch (err) {
            console.log(err);
            res.send(err.message);
        }
    }

    static async showFormAdd(req,res) {
        try {
            const posts = await Post.findAll();

            res.render('addPost', { posts });
        } catch (error) {
            console.log(error);

            res.send(error);
        }
    }

    static async saveFormAdd(req,res) {
        try {
            let { title, body } = req.body;

            await Post.create({ 
                title, 
                body 
            });

            res.redirect('/posts');
        } catch (err) {
            console.log(err);
            res.send(err.message);
        }
    }

    static async addComment(req, res) {
        try {
            const { id } = req.params
            const { comment } = req.body

            await Comment.create({
                include: {
                    model: Category,
                    attributes: ['name'],
                },
                comment,
                post_id: id
            });

            res.redirect(`/post/${id}/comment`);
        } catch (err) {
            console.log(err);
            res.send(err.message);
        }
    }


}

module.exports = Controller