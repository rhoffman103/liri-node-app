//  read and set any environment variables with the dotenv package
require("dotenv").config();

var promptPath = false;

//  Need code to import keys.js and store it in a variable
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var inquirer = require("inquirer");

//  Access keys info
var spotify = new Spotify(keys.spotify);

//  Store node command line
var command = process.argv[2];
var userSearch = process.argv
  .slice(3)
    .join(" ")
      .toLowerCase();

if (command && command.length > 0)  {
    command = command.toLowerCase();
}

const spotifyThis = function(songTitle) {
  if (songTitle.length == 0) {
    songTitle = "the sign";
  }

  spotify.search({ type: "track", query: songTitle, limit: 5 }, function(err, data) {
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
    checkPromptPath();
  });
};

const movieThis = function(movieName) {
  movieName = movieName.replace(/\s/g, '+').replace(/\./g, '');
  console.log(`\nYou searched ${userSearch}`);
  
  if (movieName.length == 0) {
    movieName = "mr+nobody";
  }

  // run a request to the OMDB API with the movie specified
  var queryUrl = `http://www.omdbapi.com/?t="${movieName}&y=&plot=short&apikey=${keys.omdb}`;

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover just the imdbRating
      console.log("\nTitle: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log(JSON.parse(body).Ratings[0].Source + ": " + JSON.parse(body).Ratings[0].Value);
      console.log(JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value);
      console.log("Produced In: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Cast: " + JSON.parse(body).Actors);
      console.log("Plot: " + JSON.parse(body).Plot);
    }
    checkPromptPath();
  });
};

// Search for artist and display upcoming concerts
const concertThis = function(artist) {
  var artist = artist.replace(/\s/g, '+')
    .replace(/\./g, '')
      .replace(/\//g, '%252F')
        .replace(/\?/g, '%253F')
          .replace(/\*/g, '%252A')
            .replace(/\"/g, '%27C');

  console.log(`\nYou searched ${userSearch}`);

  if (artist.length == 0) {
    artist = "august burns red";
  }

  var queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${keys.bandsInTown}`;

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {

      JSON.parse(body).forEach(function(element) {
        console.log(`\nVenue: ${element.venue.name}`);
        console.log(`Location: ${element.venue.city}, ${element.venue.region}`);
        console.log(`Date: ${moment(element.datetime, "YYYY-MM-DD").format("L")}`);  //  2018-08-25T17:00:00
      })
    }
    checkPromptPath();
  });
}

// Read a .txt and search the data in spotify
const doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.split(",");
    spotifyThis(data[1].replace(/\"/g, ''));
  });
};

const checkPromptPath = function() {
  if (promptPath) {
    console.log();
    prompt();
  }
}

const commandLogic = function(com, search) {
  switch (com) {
    case "spotify-this-song":
      spotifyThis(search);
      break;

    case "movie-this":
      movieThis(search);
      break;
      
    case "concert-this":
      concertThis(search);
      break;

      case "do-what-it-says":
        doWhatItSays();
        break;
  }
}

// Need to edit for "do-what-it-says" choice
const prompt = function () {
    return inquirer.prompt([
      {
        type: "list",
        name: "command",
        message: "What is your command?",
        choices: ["spotify-this-song", "movie-this", "concert-this", "do-what-it-says", "exit"]
      },
      {
        type: "input",
        name: "search",
        message: "Enter your search...",
        when: function(answers) {
          if ((answers.command === "do-what-it-says") || (answers.command === "exit")) {
            return false;
          }
          else {
            return true;
          }
          // return (answers.command !== "do-what-it-says") || (answers.command === "exit");
        },
      }
    ]).then(function(user) {
      userSearch = user.search;

      if (user.command == "exit") {
        console.log("\nGoodbye");
      }
      else if (user.command == "do-what-it-says") {
        console.log("\nDoing what it said");
        promptPath = true;
        doWhatItSays();
      }
      else {
        commandLogic(user.command, user.search);
        promptPath = true;
        // console.log(user.command + " " + user.search);
      }
    })
  }
  
if (!command) {
  console.log();
  prompt();
}
// var returnValue = promt();
// returnValue.then();

if (command) {
  commandLogic(command, userSearch);
}