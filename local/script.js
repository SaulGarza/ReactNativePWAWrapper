// function getUserMedia(options, successCallback, failureCallback) {
//   var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia || navigator.msGetUserMedia;
//   if (api) {
//     return api.bind(navigator)(options, successCallback, failureCallback);
//   } else {
//     console.log('fallback api')
//     // if(navigator.mediaDevices) {
//     //   console.log('enumerating devices')
//     //   navigator.mediaDevices.enumerateDevices().then(res => {
//     //     console.log('Enumerated Devices', res)

//     //   })
//     // }
//     let webkitApi = navigator.mediaDevices.getUserMedia
//     if(webkitApi) {
//       console.log(webkitApi)
//       return webkitApi.bind(navigator.getUserMedia)(options, successCallback, failureCallback)
//     }
//   }
// }

// function getStream (type) {
//   if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
//     !navigator.mozGetUserMedia && !navigator.msGetUserMedia &&
//     !navigator.mediaDevices.getUserMedia) {
//     alert('User Media API not supported.');
//     return;
//   }

//   var constraints = { audio: true, video: false };
//   constraints[type] = true;
//   console.log('getting user media')
//   getUserMedia(constraints, function (stream) {
//     console.log('got user media')
//     var mediaControl = document.querySelector(type);
    
//     if ('srcObject' in mediaControl) {
//       mediaControl.srcObject = stream;
//       mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
//     } else if (navigator.mozGetUserMedia) {
//       mediaControl.mozSrcObject = stream;
//     }
//   }, function (err) {
//     alert('Error: ' + err);
//   });
// }

async function recordAudio() {
  let stream = null
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    /* Use the Stream */
    console.log('got stream: ', stream)
    let audioControl = document.getElementById('video_stream')
    if('srcObject' in audioControl) {
      audioControl.srcObject = stream
      audioControl.src = (window.URL || window.webkitURL).createObjectURL(stream)
    } else if(navigator.mozGetUserMedia) {
      audioControl.mozSrcObject = stream
    }
  } catch(err) {
    console.log('error:', err)
    /* Handle Stream Error */
  }
}

var recordStartTS = 0;

var recorder = new WzRecorder({
  onRecordingStop: function (blob) {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector('.btnvoice').innerHTML = "mic_off";
    document.querySelector('.btnvoice').style.color = "#FFFFFF";
    //setTimeout(function () { document.querySelector('.btnvoice').innerHTML = "touch_app"; document.getElementById('duration').innerText = ''; }, 2000);
    //document.getElementById('player').src = URL.createObjectURL(blob);
    //recorder.upload('http://audiofingerprintebs-env.6desmgxqvm.us-east-2.elasticbeanstalk.com/recog/', '', processJson)
    recorder.upload('/api/AudioIdentify', '', processJson)
  },
  onRecording: function (milliseconds) {
    if (recordStartTS == 0) { recordStartTS = Date.now() };
    document.querySelector('.btnvoice').innerHTML = "mic";
    document.querySelector('.btnvoice').style.color = "#3F4045";
    document.getElementById('duration').innerText = 'Recording: ' + (milliseconds/1000).toFixed(1) + ' Secs';
    // stop after X Seconds
  },
  visualizer: {
    element: document.getElementById('canvas')
  }
});

document.querySelector('.btnvoice').onclick = recorder.toggleRecording