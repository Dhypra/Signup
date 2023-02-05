const express = require("express");
const bodyParser = require("body-parser");
const https = require('node:https');
const app = express();
app.use(express.static("public"));
const { request } = require("http");
app.use(bodyParser.urlencoded({ extended: true }))
const mailchimp = require("@mailchimp/mailchimp_marketing");

//get
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

//post
app.post("/", (req, res) => {
    const listId = "72f23950b5";
    mailchimp.setConfig({
        apiKey: "fa9af785d587c9fa568c70303c65f192-us14",
        server: "us14",
    });

    const subscribingUser = {
        firstName: req.body.name,
        lastName: req.body.password,
        email: req.body.email
    };

    const data = {
        members: [{
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        }]
    };
    const jsonData=JSON.stringify(data);
    
    const url = "https://us14.api.mailchimp.com/3.0/lists/72f23950b5";
    const options = {
        method: "POST",
        auth: "Dhika:fa9af785d587c9fa568c70303c65f192-us14"
    }

    const request = https.request(url, options, (response) => {
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });
     
   request.write(jsonData);
   request.end();
    });

    app.post("/failure",(req,res)=>{
        res.redirect("/")
    })

    app.listen(3000, function () {
        console.log("Server is running on port 3000");
    });

    // $("#fail").click(()=>{
    //   alert("asd")
    // })