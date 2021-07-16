const Mysql = require('mysql2');
const con = require('./meter');
const bcrypt = require ('bcrypt');

const saltRounds = 10;


// function Register (email,password){

//     // salt is random number
//     // generate hash
//     bcrypt.hash(password, saltRounds, function(err, hash) {
//         // Store hash in database here
//         console.log(hash)
        
//         var sqlCmd = "INSERT INTO users (Email, Password) VALUES (" + email+ "," + hash +")";
//          con.query(sqlCmd , (err, result)=>{
//                 if (err){ 
//                     }
//                 else {console.log("error register")
//                   console.log('registered');           
//                  } 
//             }
//         ) 

//     });
  

//}

//
//module.exports = {Register}



