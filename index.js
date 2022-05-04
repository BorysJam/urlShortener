const dotenv = require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const shortUrl = require('./models/short')
const { v4: uuidv4 } = require('uuid');

const cookieParser = require('cookie-parser')
const app = express()
const { engine } = require('express-handlebars') 

app.use(express.static('style'))
app.use(cookieParser())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.urlencoded({ extended: false }))

mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_URI}@cluster0.lmvmc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {useNewUrlParser:true, useUnifiedTopology:true }).then(()=>{
    console.log('connected to database')
}).catch(err => console.log(err))



app.get('/', async(req,res)=>{
    if(req.cookies.randomId == undefined){
        const randomId = uuidv4();
        res.cookie('randomId',randomId)
    }
    const shortUrls = await shortUrl.find({session:req.cookies.randomId})
    res.render('index.hbs',{shortUrls:shortUrls})
})

app.get('/:short', async(req,res)=>{
    try{
        const short = await shortUrl.findOne({short: req.params.short})
        short.clicks++
        short.save()
        res.redirect(short.url)
    }
    catch(err){
        res.status(500).json(err)
    }     
})

app.post('/shortUrl', async(req,res)=>{
    try{
        await shortUrl.create({url:req.body.url, session:req.cookies.randomId})
  
        res.redirect('/')
    }catch{(err => console.log(err))}
    
})

app.listen(process.env.PORT || 3000);