//  read and set any environment variables with the dotenv package
require("dotenv").config();

//  Need code to import keys.js and store it in a variable
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");

//  Access keys info
var spotify = new Spotify(keys.spotify);

//  Store node command line
var command = process.argv[2].toLowerCase();
var userSearch = process.argv
  .slice(3)
  .join(" ")
  .toLowerCase();

const spotifyThis = function() {
  var songTitle = userSearch;
  if (userSearch.length == 0) {
    songTitle = "the sign";
  }

  spotify.search({ type: "track", query: songTitle, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    // console.log(JSON.stringify(data, null, 2));
    console.log(
      `\nAtrist: ${data.tracks.items[0].artists[0].name}\nAlbum: ${
        data.tracks.items[0].album.name
      }\nSong Name: ${songTitle}\nSpotify Link: ${
        data.tracks.items[0].album.artists[0].external_urls.spotify
      }`
    );
  });
};

const movieThis = function() {
  var movieName = userSearch.replace(/\s/g, '+').replace(/\./g, '');
  console.log(movieName);
  if (userSearch.length == 0) {
    movieName = "mr+nobody";
  }

  // run a request to the OMDB API with the movie specified
  var queryUrl = `http://www.omdbapi.com/?t="${movieName}&y=&plot=short&apikey=${keys.omdb}`;

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover just the imdbRating
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log(JSON.parse(body).Ratings[0].Source + ": " + JSON.parse(body).Ratings[0].Value);
      console.log(JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value);
      console.log("Produced In: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Cast: " + JSON.parse(body).Actors);
      console.log("Plot: " + JSON.parse(body).Plot);
    }
  });
};

switch (command) {
  case "spotify-this-song":
    spotifyThis();
    break;
  case "movie-this":
    movieThis();
    break;
}
