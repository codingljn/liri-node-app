require("dotenv").config();
// Import FS package, NPM packages & API keys
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");
// Start spotify API client
var spotify = new Spotify(keys.spotify);
// Global variables
var userInput = process.argv;
var movieName = "";
var song = "";

//Spotify - syntax elements from NPM API example
var spotifySearch = function (song) {
    for (var i = 3; i < userInput.length; i++) {

        if (i > 3 && i < userInput.length) {
            song = song + "+" + userInput[i];
        }
    }
    if (!song) {
        song = "Mr Brightside";
    }
    spotify.search(
        { type: "track", query: song }, function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log(i+1);//Show number of results
                console.log("Artist(s): " + songs[i].artists[0].name);
                console.log("Song name: " + songs[i].name);
                console.log("Preview link: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
                console.log("-------------------------------------------------------------------");
            }
        }
    );
};
//Twitter - syntax elements from NPM API example
var twitterSearch = function () {
    var client = new Twitter(keys.twitter);
    var params = { screen_name: "JoseLujanJ" };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log("");
                console.log(tweets[i].text);
            }
        }
    });
};
//IMDB - some syntax elements from in-class example on 6/26/18 "evelOneOmdbInteractive.js"
var movieSearch = function (movieName) {

    for (var i = 3; i < userInput.length; i++) {

        if (i > 3 && i < userInput.length) {
            movieName = movieName + "+" + userInput[i];
        }
    }
    if (!movieName) {
        movieName = "Mr Nobody";
    }

    var queryUrl =
        "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movData = JSON.parse(body);
            console.log("Title: " + movData.Title);
            console.log("-------------------------------------------------------------------");
            console.log("Year: " + movData.Year);
            console.log("-------------------------------------------------------------------");
            console.log("IMDB Rating: " + movData.imdbRating);
            console.log("-------------------------------------------------------------------");
            console.log("Rotten Tomatoes Score: " + movData.Ratings[1].Value);
            console.log("-------------------------------------------------------------------");
            console.log("Country: " + movData.Country);
            console.log("-------------------------------------------------------------------");
            console.log("Language: " + movData.Language);
            console.log("-------------------------------------------------------------------");
            console.log("Plot: " + movData.Plot);
            console.log("-------------------------------------------------------------------");
            console.log("Actors: " + movData.Actors);
            console.log("-------------------------------------------------------------------");
        }
    });
};
//Do-What-It-Says protocol based on random.txt file
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);
        var dataArr = data.split(",");
        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};
//Cases to choose from
var pick = function (liriGo, userInput) {
    switch (liriGo) {
        case "my-tweets":
            twitterSearch();
            break;
        case "spotify-this-song":
            spotifySearch(userInput);
            break;
        case "movie-this":
            movieSearch(userInput);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Sorry human, I didn't get that. Please select from: my-tweets, spotify-this-song, movie-this or do-what-it-says");
    }
};
// Takes in command line arguments and runs the proper function
var liriGo = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

liriGo(process.argv[2], process.argv[3]);