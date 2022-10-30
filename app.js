const APIController = (function () {
  const clientId = "YOUR_CLIENT_ID";
  const clientSecret = "YOUR_CLIENT_SECRET";

  // Private methods
  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  const _getReleases = async (token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/browse/new-releases?limit=20`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.albums.items;
  };

  const _getPlaylist = async (token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/browse/featured-playlists?limit=20`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.playlists.items;
  };

  const _getTracks = async (token, albumId) => {
    const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.tracks.items;
  };

  return {
    getToken() {
      return _getToken();
    },

    getReleases(token) {
      return _getReleases(token);
    },
    getPlaylist(token) {
      return _getPlaylist(token);
    },
    getTracks(token, albumId) {
      return _getTracks(token, albumId);
    },
  };
})();

// UI Module
const UIController = (function () {
  // object to hold references to html selectors
  const DOMElements = {
    selectRelease: "#select_release",
    selectPlaylist: "#select_playlist",
    buttonSubmit: "#btn_submit",
    divSongDetail: "#song-detail",
    hftoken: "#hidden_token",
    divSongList: ".song-list",
  };

  //   public methods
  return {
    // method to get input fields
    inputField() {
      return {
        release: document.querySelector(DOMElements.selectRelease),
        playlist: document.querySelector(DOMElements.selectPlaylist),
        tracks: document.querySelector(DOMElements.divSongList),
        buttonSubmit: document.querySelector(DOMElements.buttonSubmit),
        songDetail: document.querySelector(DOMElements.divSongDetail),
      };
    },

    // need method to create select options
    createRelease(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document
        .querySelector(DOMElements.selectRelease)
        .insertAdjacentHTML("beforeend", html);
    },

    createPlaylist(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document
        .querySelector(DOMElements.selectPlaylist)
        .insertAdjacentHTML("beforeend", html);
    },

    // method to create song list
    createTrack(id, name) {
      const html = `<li class="list-group-item" id="${id}">${name}</li>`;
      document
        .querySelector(DOMElements.divSongList)
        .insertAdjacentHTML("beforeend", html);
    },

    // method to create song detail
    createTrackDetail(img, title, artist) {
      const html = `
            <div>
              <img src="${img}" alt="" />
              <h4>${title}</h4>
              <p>${artist}</p>
            </div>
        `;
      detailDiv.insertAdjacentHTML("beforeend", html);
    },
    resetTrackDetail() {
      this.inputField().songDetail.innerHTML = "";
    },
    resetTracks() {
      this.inputField().songs.innerHTML = "";
      this.inputField().songDetail.innerHTML = "";
    },
    resetPlaylist() {
      this.inputField().playlist.innerHTML = "";
      this.resetTracks();
    },
  };
})();
