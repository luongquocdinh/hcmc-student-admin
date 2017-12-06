let express = require('express');
let path = require('path');
let fs = require('fs');
let router = express.Router();

let admin = require("firebase-admin");
let serviceAccount = require("./../hcmc-student.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hcmc-student-1e6c6.firebaseio.com"
});

const icon = 'http://res.cloudinary.com/hwjtqthls/image/upload/v1508400422/icon_pqj2y6.png'

const TOPIC = "news";

router.get('/notifications', (req, res) => {
    return res.render('notifications/index.ejs', {
        req: req
    });
})

router.post('/notifications/push', (req, res) => {
    let title = req.body.title
    let content = req.body.content

    var payload = {
        notification: {
            title: title,
            body: content,
            icon: icon
        }
    };
    
    admin.messaging().sendToTopic(TOPIC, payload)
        .then(function (response) {
            console.log("Successfully sent message:", response);
            return res.redirect('/notifications');
        })
        .catch(function (error) {
            return res.render('pages_event/index.ejs');
            console.log("Error sending message:", error);
        });
})

module.exports = router;