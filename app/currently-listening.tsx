import querystring from "querystring";

const client_id = "b4aa56849ac047fb922fa01a3b9dec0b";
const client_secret = "a865e998ab564792b4394734a5c2ddfc";
const refresh_token =
  "AQACIWHR-qbhkAMGndKmrM_RVlw8VswV5P1BEfy4PwQt2-bgeIRDr65irkHxVFY10DmeeEWBKJsK8U0L2lDy96ypZeoURoZ90lqv3RIqqChhmANHgHkB9MLUxlhRsW_aH64";

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export async function getCurrentlyListening() {
  const { access_token } = await getAccessToken();
  const playingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (playingResponse.status === 204 || playingResponse.status > 400) {
    return {
      currentlyPlaying: {
        isPlaying: false,
      },
    };
  }

  const song = await playingResponse.json();
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  return {
    currentlyPlaying: {
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
      ...song,
    },
  };
}
