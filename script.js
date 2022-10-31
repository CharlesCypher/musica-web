let track_art = document.querySelector(".track-art");
let mobile_track_art = document.querySelector(".mobile-player-track-art");
let track_name = document.querySelector(".track-name");
let mobile_track_name = document.querySelector(".mobile-player-track-name");
let track_artist = document.querySelector(".track-artist");
let mobile_track_artist = document.querySelector(".mobile-player-track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let volume_btn = document.querySelector(".volume-icon");

let seek_slider = document.querySelector(".seek-slider");
let volume_slider = document.querySelector(".volume-slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// Specify globally used values
let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create the audio element for the player
let curr_track = document.createElement("audio");

// Define the list of tracks that have to be played
let track_list = [
  {
    name: "Organise",
    artist: "Asake",
    image: "./album-cover/Asakee-1024x1024.png",
    path: "music/Asake_-_Organise.mp3",
  },
  {
    name: "In my mind",
    artist: "BNXN fka Buju",
    image: "./album-cover/in-my-mind-artwork.png",
    path: "music/Bnxn-In-My-Mind-(TrendyBeatz.com).mp3",
  },

  // {
  //   name: "Shipping Lanes",
  //   artist: "Chad Crouch",
  //   image: "album-cover/Rectangle 19.png",
  //   path: "Shipping_Lanes.mp3",
  // },
];

function loadTrack(track_index) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();

  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  // Update details of the track
  track_art.style.backgroundImage =
    "url(" + track_list[track_index].image + ")";
  mobile_track_art.src = track_list[track_index].image;
  // track_art.src = track_list[track_index].image;
  track_name.textContent = track_list[track_index].name;
  mobile_track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  mobile_track_artist.textContent = track_list[track_index].artist;
  // now_playing.textContent =
  //    "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  // Set an interval of 1000 milliseconds
  // for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);

  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);

  // Apply a random background color
  // random_bg_color();
}

// Function to reset all values to their default
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  // Switch between playing and pausing
  // depending on the current state
  if (!isPlaying) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack() {
  // Play the loaded track
  curr_track.play();
  isPlaying = true;

  // Replace icon with the pause icon
  playpause_btn.innerHTML = '<i class="fa-solid fa-pause btn"></i>';
}

function pauseTrack() {
  // Pause the loaded track
  curr_track.pause();
  isPlaying = false;

  // Replace icon with the play icon
  playpause_btn.innerHTML = '<i class="fa-solid fa-play btn"></i>';
}

function nextTrack() {
  // Go back to the first track if the
  // current one is the last in the track list
  if (track_index < track_list.length - 1) track_index += 1;
  else track_index = 0;

  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  // Go back to the last track if the
  // current one is the first in the track list
  if (track_index > 0) track_index -= 1;
  else track_index = track_list.length - 1;

  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  let seekto = curr_track.duration * (seek_slider.value / 100);

  // Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}

function setVolume() {
  // Set the volume according to the
  // percentage of the volume slider set
  if (volume_slider.value == 0) {
    volume_btn.innerHTML = '<i class="fa-solid fa-volume-mute btn"></i>';
    // mute the track
    curr_track.muted = true;
  } else if (volume_slider.value > 0 && volume_slider.value <= 50) {
    volume_btn.innerHTML = '<i class="fa-solid fa-volume-low btn"></i>';
    // unmute the track
    curr_track.muted = false;
  } else if (volume_slider.value > 50 && volume_slider.value <= 100) {
    volume_btn.innerHTML = '<i class="fa-solid fa-volume-high btn"></i>';
    // unmute the track
    curr_track.muted = false;
  }
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    // Add a zero to the single digit time values
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

// Load the first track in the tracklist
loadTrack(track_index);

// console.log(fetch("https://reqres.in/api/users"));

function random_bg_color() {
  // Get a random number between 64 to 256
  // (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";
  // Set the background to the new color
  document.body.style.background = bgColor;
}

// Hamburger menu
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".hamburger-links");
const links = document.querySelectorAll(".hamburger-links-list li");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  // navLinks.classList.toggle("open");s
  links.forEach((link) => {
    link.classList.toggle("fade");
  });
});

const mobilePlayerToggleBtn = document.getElementById(
  "mobile-player-toggle-btn"
);
const musicPlayerContainer = document.querySelector(".music-player-container");
const mobilePlayerDetails = document.querySelector(".mobile-player-details");
const mobilePlayerUpperElement = document.querySelector(
  ".mobile-player-upper-element"
);

mobilePlayerToggleBtn.addEventListener("click", () => {
  mobilePlayerDetails.classList.toggle("expand-player");
  mobilePlayerUpperElement.classList.toggle("clear");
  musicPlayerContainer.classList.toggle("player-default");
});
