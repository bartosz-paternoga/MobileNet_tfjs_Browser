import React, { Component } from 'react';
import './App.css';
import * as mobilenet from '@tensorflow-models/mobilenet';

class App extends Component {

  componentDidMount() {
   this.main();
  }



  main = () => {

    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let pred = document.getElementById("predictions");
    let model;


    const startCamera = async() => {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      setInterval(() => takeSnapshot(), 1000);
    }

    const takeSnapshot = async() => {
      let context = canvas.getContext("2d"),
        width = video.videoWidth,
        height = video.videoHeight;

      if (width && height) {
        // Setup a canvas with the same dimensions as the video.
        canvas.width = width;
        canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(video, 0, 0, width, height);

        classifyImage();
      }
    }

    const classifyImage = async() => {
      const predictions = await model.classify(canvas);
      displayPredictions(predictions);
    }

    const displayPredictions = async(predictions) => {
      let val = "";
      let prediction;

      for (prediction of predictions) {
        let perc = (prediction.probability * 100).toFixed(2);
        val += `${perc}% | ${prediction.className}\n`;
        console.log(val);
      }
      pred.innerHTML = val;
    }

    const startMeUP = async() => {
      model = await mobilenet.load();
      await startCamera();
    }
    startMeUP();
  }



  render() {
    return (
      <div>
      <div className="App">
        <header className="App-header">
          <p>
            This app is using MobileNet model with tfjs to predict objects from vide feed
          </p>
         
        </header>
      </div>
        <br/>      

        <div >
          <div id="x">
            <video id="video">Video stream not available.</video>
            <pre id="predictions"></pre>
            <canvas id="canvas" ></canvas>
          </div>
         </div>
        </div>   

    );
  }
}

export default App;

