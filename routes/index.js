const express = require('express')
const router = express.Router()
const meter = require('../models/meter')
const ejs = require('ejs')
const pdf = require("html-pdf");
const path = require("path");
const fs =require('fs')
const ini = require('ini')
const authen = require('../models/authen');


router.get('/',(req, res) => {
  if (meter.curUser.Login === "true"){
    res.render('index')   
  }else{
    res.render('./authen/login')

  }

  
})

router.get('/info/online',(req, res) => {

    meter.getMeter(function(err,meters) {
      res.render('info/online', { meters})
    })  

         
})

router.get('/info/kwhUsed',(req, res) => {
  let dev = req.query.dev
  let kwhDate = req.query.kwhDate  
   
    meter.Usage(dev, kwhDate, function(err, mdl)  {  
      res.render('info/kwhUsed', { dev, kwhDate , mdl})
   } )  
})

router.get('/info/about',(req, res) => {
  res.render('info/about')
})

router.get('/public/js',(req, res) => {

  let dev = req.query.dev
  let kwhDate = req.query.date

  kwhDate = kwhDate.substring((kwhDate.length-4),kwhDate.length)

  meter.Usage(dev, kwhDate, function(err, mdl){                          
      ejs.renderFile(path.join(__dirname, "../views/template.ejs"), {
          mdl, dev }, (err, data) => {
                          if (err) {
                              res.send(err);
                          } else {
                            let options = {
                                  "height": "11.25in",
                                  "width": "8.5in",
                                  "header": {
                                      "height": "20mm",
                                  },
                                  "footer": {
                                      "height": "20mm",
                                  },
 
                              };
                              pdf.create(data, options).toFile("report.pdf", function (err, data) {
                                  if (err) {
                                      res.send(err);
                                  } else{

                                       fs.readFile('report.pdf',function(error,data){
                                              if(error){
                                                      res.json({'status':'error',msg:err});
                                              }else{
                                                      res.writeHead(200, {"Content-Type": "application/pdf"  });
                                                      res.write(data);
                                                      res.end();       
                                               }
                                       });
                                    }
                              });
                          }
      })

  })

})


router.get('/authen/login',(req, res) => {
  res.render('./authen/login')
})

router.get('/authen/logout',(req, res) => {
  meter.curUser.Login = "false"
  res.redirect('./login')
})




router.get('/authen/register',(req, res) => {
  res.render('./authen/register')
})

router.post('/register',(req,res) =>{

   meter.Register(req.body.username, req.body.password);
   res.redirect('/');


})

router.post('/login',(req,res) =>{

  meter.Login(req.body.username, req.body.password);
   res.redirect('/');


})






module.exports = router

