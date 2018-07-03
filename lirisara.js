require('dotenv').config();

var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./keys");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var yourThing = process.argv;
var movieName = "";
var song = "";

var searchSongs = function (song) {
  
    spotify.search(
        { type: "track", query: song }, function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log("Artist(s): " + songs[i].artists[0].name);
                console.log("Song name: " + songs[i].name);
                console.log("Preview link: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
            }
        });
};

// var searchTweets = function () {
//     var params = { screen_name: 'nodejs' };
//     client.get('statuses/user_timeline', params, function (error, tweets, response) {
//         if (!error) {
//             for (var i = 0; i < tweets.length; i++)
//                 console.log(tweets);
//         }
//     });
// };

var searchMovie = function (movieName) {

    var queryUrl =
        "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movData = JSON.parse(body);
            console.log("Title: " + movData.Title);
            console.log("Year: " + movData.Year);
            console.log("IMDB Rating: " + movData.imdbRating);
            console.log("Rotten Tomatoes Score: " + movData.Ratings[1].Value);
            console.log("Country: " + movData.Country);
            console.log("Language: " + movData.Language);
            console.log("Plot: " + movData.Plot);
            console.log("Actors: " + movData.Actors);
        }
    });
};
//Cases to choose from
var commands = function (dostuff, yourThing) {
    switch (dostuff) {
        case "my-tweets":
            searchTweets();
            break;
        case "spotify-this-song":
            searchSongs(yourThing);
            break;
        case "movie-this":
            searchMovie(yourThing);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Sorry human, I didn't get that. Please select from: my-tweets, spotify-this-song, movie-this or do-what-it-says");
    }
};
// Takes in command line arguments and runs the proper function
var dostuff = function (argOne, argTwo) {
    commands(argOne, argTwo);
};

dostuff(process.argv[2], process.argv[3]);