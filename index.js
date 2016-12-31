var gcm = require('node-gcm');
var express = require('express');
var bodyParser = require('body-parser');
var firebase = require("firebase");

//Constants
const FRIENDSHIP_REQUEST = "friendshipRequest";
const FRIENDSHIP_ACCEPTED = "friendshipAccepted";
const NOTIFICATIONS_TYPE_NEW_MOVIE = "newMovie";
const NOTIFICATION_TYPE = "notificationType";
const NOTIFICATION_CONTACT_USERNAME = "contactUsername";


//INIT FIRBASE DATABASE: 
  var config = {
    apiKey: "AIzaSyDHSHJ2jYFbGuZWZyICowF7kB-nOHvNSmU",
    authDomain: "pinguin-db.firebaseapp.com",
    databaseURL: "https://pinguin-db.firebaseio.com",
    storageBucket: "gs://pinguin-db.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();


//INIT EXPRESS : 
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
app.listen(port);


//INIT GCM : 
var sender = new gcm.Sender('AIzaSyD8ruTyxlKgfRzySjNm-NuzJ4hXGePjvg0');



// EXPRESS ROUTES

//Send a friendship request
app.post('/:id1/users/:id2', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    console.log(req.body);
    console.log(req.body.username);

    getUserToken(req.params.id2, FRIENDSHIP_REQUEST, req.body.username);

    res.send("ok");
});


//Accept a friendship
app.put('/:id1/users/:id2', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    getUserToken(req.params.id2, FRIENDSHIP_ACCEPTED, req.body.username);

    res.send("ok");
});

//Send a friendship request
app.post('/:userId/movies/:movieId', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    var body = JSON.parse(req.body);
    var username = body.username;
	var title = body.title;
	var members = body.members;
	console.log("iciiiiiii");
	console.log("members : " + members);
	for(var i = 0; i < members.length;i++){
		console.log("i : " + members[i]);
		getUserToken(members[i], NOTIFICATIONS_TYPE_NEW_MOVIE, req.body.username);
	}
    //getUserToken(req.params.id2, FRIENDSHIP_REQUEST, req.body.username);

    res.send("ok");
});

 
 function sendNotification(gcmToken, notificationType, contactUsername) {

 	var message = new gcm.Message({
	    
	});

	message.addData(NOTIFICATION_TYPE,notificationType);
	message.addData(NOTIFICATION_CONTACT_USERNAME,contactUsername);

	// Set up the sender with you API key, prepare your recipients' registration tokens. 
	var regTokens = [gcmToken];
	 
	sender.send(message, { registrationTokens: regTokens }, function (err, response) {
	    if(err) console.error("error  : " + err);
	    else 	console.log(response);

	});

}

function getUserToken(userId, notificationType, contactUsername) {
	console.log("dans getUserToken");
	console.log(userId);
	return firebase.database().ref('/indexes/gcmToken/' + userId).once('value').then(function(snapshot) {
		var gcmToken = snapshot.val();
		console.log("trouvé le gcm token : " + gcmToken);
	  	sendNotification(gcmToken, notificationType, contactUsername);

	});
}







