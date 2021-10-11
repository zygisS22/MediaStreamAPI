const buttons = document.querySelectorAll(".button");
const startButton = document.querySelector("#startAudio");
const startScreenButton = document.querySelector("#startScreen");
const stopButton = document.querySelector("#stopAudio");
const audioList = document.querySelector("#audio-list");
const videoList = document.querySelector("#video-list");

let mediaRecorder = null;
let chunks = [];

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  alert("Your browser does not support recording!");
}

startButton.addEventListener("click", recordAudio);
stopButton.addEventListener("click", stopRecording);
startScreenButton.addEventListener("click", recordSCreen);

function recordAudio() {
  console.log("record audio started");

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      stopButton.disabled = false;
      startButton.disabled = true;
      startScreenButton.disabled = true;

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        console.log("record audio", e.data);
        chunks.push(e.data);
      };
      mediaRecorder.onstop = (e) => {
        console.log("record screen stopped");
        createMediaElement("audio", "audio/mp3", audioList);
      };
      mediaRecorder.onerror = (e) => {
        console.log(e.error);
      };
      mediaRecorder.start(1000);
    })
    .catch((err) => {
      alert(`The following error occurred: ${err}`);
    });
}

function recordSCreen() {
  navigator.mediaDevices
    .getDisplayMedia({
      mediaSource: "screen",
    })
    .then((stream) => {
      stopButton.disabled = false;
      startButton.disabled = true;
      startScreenButton.disabled = true;

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        console.log("record screen", e.data);
        chunks.push(e.data);
      };
      mediaRecorder.onstop = (e) => {
        console.log("record screen stopped");
        createMediaElement("video", chunks[0].type, videoList);
      };
      mediaRecorder.start();
    })
    .catch((err) => {
      alert(`The following error occurred: ${err}`);
    });
}

// stops audio or video
function stopRecording() {
  stopButton.disabled = true;
  startButton.disabled = false;
  startScreenButton.disabled = false;
  mediaRecorder.stop();
}

// creates the html element with the file
function createMediaElement(mediaType, fileType, placeToAdd) {
  const blob = new Blob(chunks, {
    type: fileType,
  });

  const mediaURL = window.URL.createObjectURL(blob);
  console.log("mediaUrl", mediaURL);
  const element = document.createElement(mediaType);
  element.setAttribute("controls", "");
  element.src = mediaURL;
  placeToAdd.insertBefore(element, placeToAdd.firstElementChild);
  mediaRecorder = null;
  chunks = [];

  stopButton.disabled = true;
  startButton.disabled = false;
  startScreenButton.disabled = false;
}
