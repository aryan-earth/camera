import React from "react";
import Webcam from "react-webcam";
async function App() {
  const videoConstraints = {
    facingMode: "user"
  };

  return (
    <div className="App">
      <h1>Camera App</h1>
      <Webcam videoConstraints={videoConstraints} />
    </div>
  )
}

export default App
