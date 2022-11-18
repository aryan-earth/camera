//Important commnets on  26, 59, 61



import React from 'react'
import ReactDOM from 'react-dom/client'
import Webcam from "react-webcam";
const WebcamStreamCapture = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setTimeout(() => {
      document.getElementById("stopCapture").click();
    },[500])     // 500 means 500 miliseconds, change to whatever amount to seconds
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    alert("capturing stopped")
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "mediaTypeMP4"
      });
      console.log(blob)
      const url = URL.createObjectURL(blob);
      console.log(url)
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      // a.click();
      var fd = new FormData();
      fd.append('upl', blob, 'blobby.raw');   // changr upl to your file.get name

      fetch('http://localhost:5000/upload_files',    // change URL to your scan server URL
        {
          method: 'post',
          body: fd
        })
        .then(function (response) {
          console.log('done');
          return response;
        })
        .catch(function (err) {
          console.log(err);
        });

      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);



  return (
    <>
      <Webcam audio={false} ref={webcamRef} />
      {capturing ?
        <div>       
          <p>Capturing footage</p>
           <button style={{display:"none"}} id='stopCapture' onClick={handleStopCaptureClick}>Stop Capture</button>
        </div>
        : (
          <div>
          <button onClick={handleStartCaptureClick}>Start Capture</button>
          </div>
        )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
    </>
  );
};





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WebcamStreamCapture />
  </React.StrictMode>
)
