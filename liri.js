//  read and set any environment variables with the dotenv package
require("dotenv").config();

//  Need code to import keys.js and store it in a variable
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");

//  Access keys info
var spotify = new Spotify(keys.spotify);

//  Store node command line
var command = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

const spotifyThis = function() {
  var songTitle = userSearch
  if (userSearch.length == 0) {
    songTitle = "the sign";
  }

  spotify.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  // console.log(JSON.stringify(data, null, 2));
  console.log(`\nAtrist: ${data.tracks.items[0].artists[0].name}\nAlbum: ${data.tracks.items[0].album.name}\nSong Name: ${songTitle}\nSpotify Link: ${data.tracks.items[0].album.artists[0].external_urls.spotify}`)
  });
}

switch (command) {
  case "spotify-this-song":
    spotifyThis();
}