// Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyDHSHJ2jYFbGuZWZyICowF7kB-nOHvNSmU",
    authDomain: "pinguin-db.firebaseapp.com",
    databaseURL: "https://pinguin-db.firebaseio.com",
    storageBucket: "pinguin-db.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();