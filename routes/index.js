var express = require("express");
var router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index.hbs");
});

router.get("/artist-search", function (req, res, next) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // data.body.artists.items.forEach((item) => console.log(item.images[0].url));
      let artists = data.body.artists.items;
      res.render("artist-search-results.hbs", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

router.get("/albums/:id", function (req, res, next) {
  console.log(req.params.id);
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((albumsInformation) => {
      let albums = albumsInformation.body.items;
      console.log("Album information", albums);
      // albums.forEach((album) => console.log("album name: ", album.name));
      res.render("albums.hbs", { albums });
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/tracks/:id", function (req, res, next) {
  console.log(req.params.id);
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((tracksInformation) => {
      let tracks = tracksInformation.body.items;
      // console.log("track information", tracks);
      // tracks.forEach((album) => console.log("album name: ", album.name));
      res.render("tracks.hbs", { tracks });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;