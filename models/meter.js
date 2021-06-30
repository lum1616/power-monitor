const { Router } = require('express');
const express = require('express');
const Mysql = require('mysql2');
const  route  = require('../routes');
const  mt  = require('../routes');
const path = require("path");
const fs = require('fs')
const ini = require('ini')




//let meter = { date : "date", time : "time", kwh : "kwh", devName : "devName", }
//let meters = []

var con = Mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "powermeter",
    password: "1234"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql");
  });
 

function Usage (dev, kwhDate,  callback)
{
    let aDate = kwhDate.split("-") 
    let m =[]
  
    for (let i = 1; i < 13; i++) {
        var sqlCmd = "SELECT * FROM data WHERE devName ='" + dev + "' AND year='" +
                    aDate[0] + "' AND month='" + i + "' limit 1 ;"
    
        con.query(sqlCmd , (err, result)=>{
                if (err){ 
                    callback(err,null)}
                else {
                       if (result.length > 0 ){                                                                     
                        m.push({ date : result[0].date.toLocaleDateString("en-GB", { 
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",}) ,
                            
                            kwh : result[0].kwh})
                       }

                       if (result.length > 0 && i===12){
                            callback(null,m)}   
                           
                     } 
                }
        )  
    }                 
}

function getMeter (callback)
{
  
  //const meter = { name : "", amp : "", volt : "", pf : "", kwh : "" }
  
  const meters = []
  var totMeter = 0

  const config = ini.parse(fs.readFileSync('C:/PowerMon/config.ini', 'utf-8'));
  const dev = Object.keys(config.Device);
  var devA = (dev.map(f => config.Device[f]))
  totMeter = parseInt(devA[0]) 
  // let cnt = 0

    for ( let i=0; i<totMeter; i++) {

      
      var msb = 'MSB' + (i+1).toString()

      fs.promises.readFile('C:/PowerMon/log/'+ msb +'.txt', 'utf-8')
        .then(function (file)
            {
              var meter = { name : "", amp : "", volt : "", pf : "", kwh : "" }
              //cnt++
              const lines = file.split('\n')
              var col = lines[0].split(',') 
              meter.name = 'MSB' + (i+1).toString()        
              meter.amp = col[0]
              meter.volt = col[1]
              meter.pf= col[2]
              meter.kwh = col[3]
              meters.push(meter)   
            
              if (i === (totMeter-1)){
                //console.log('callback normal')    
                callback( null, meters )
              }         
                       
        
            })

          
    }
    



    
                      

}



// module.exports = {Usage,meter,meters}
 module.exports = {Usage, getMeter}
