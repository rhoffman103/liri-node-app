# liri-node-app

LIRI is a command line node app that searches Spotify for songs, Bands in Town for concerts, and OMDB for movies.

## Installation

- Clone repo.
- Download the latest version of Node https://nodejs.org/en/
- Run command 'npm install' in your Terminal

## How to use

- Run command 'node liri.js' for a prompt to run searches
- Or Run command 'node liri.js' with one of LIRI's commands for a quick search.
    * ex. node liri.js movie-this ace ventura

## LIRI's Commands
- 'spotify-this-song' - Prints artist info with a matching song name
- 'movie-this' - Prints movie info from OMDB
- 'concert-this' - Prints an artists upcoming concerts from bands in town
- 'do-what-it-says' - grabs info from a .txt and runs 'spotify-this-song'

## Tech used
- Node.js
- Spotify NPM Package - https://www.npmjs.com/package/spotify
- Moment.js NPM Package - https://www.npmjs.com/package/moment
- Request NPM Package - https://www.npmjs.com/package/request
- Inquirer NPM Package - https://www.npmjs.com/package/inquirer

### Created by  

**Bobby Hoffman**