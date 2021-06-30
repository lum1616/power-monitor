const express = require('express')
const router = express.Router()
const meter = require('../models/meter')
const ejs = require('ejs')
const pdf = require("html-pdf");
const path = require("path");
const fs =require('fs')
const ini = require('ini')


router.get('/',(req, res) => {
  res.render('index')
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
      ejs.renderFile(path.join(__dirname, "template.ejs"), {
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
                                                      res.writeHead(200, {"Content-Type": "application/pdf"});
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





module.exports = router

