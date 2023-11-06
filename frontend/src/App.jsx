import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import prevention from "./prevention.json";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0); // Added state for time

  useEffect(() => {
    setResult(null);
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const startTime = new Date(); // Capture start time
    try {
      const response = await axios.get("http://localhost:8000/vulnerability", {
        params: { url },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      const endTime = new Date(); // Capture end time
      const timeDiff = (endTime - startTime) / 1000; // Calculate time difference in seconds
      setTimeTaken(timeDiff); // Update time taken state
    }
  };

  return (
    <div className="body">
      <div className="appStyle">
        <h1>
          <i className="fa-solid fa-skull fa-beat-fade"></i>
          <span className="blink">URL Security Assessment </span>
          <i className="fa-solid fa-skull fa-beat-fade"></i>
        </h1>

        <hr />
        <form className="formStyle" onSubmit={handleSubmit}>
          <div className="inp">
            <input
              className="inputStyle"
              type="text"
              placeholder="Enter URL ....."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="buttonStyle" type="submit" disabled={loading}>
              <img
                src="../images/search-removebg-preview.png"
                alt=""
                srcSet=""
              />
            </button>
          </div>
        </form>
        {loading ? <span className="loader"></span> : null}
        {result && (
          <div className="resultStyle">
            <div className="url">{url}</div>
            <div className="bottom-result">
              <div className="vul">
                <ul>
                  {result.assessment.vulnerabilities.map(
                    (vulnerability, index) => (
                      <li key={index}>
                        {vulnerability}
                        {console.log(vulnerability)}
                        {console.log(typeof vulnerability)}
                      </li>
                    )
                  )}
                </ul>{" "}
              </div>
            </div>
            <div className="time">
              <img
                className="time-sand"
                src="../images/output-onlinegiftools.gif"
                alt=""
                srcset=""
              />
              <p>
                <span>{timeTaken}</span> Sec{" "}
              </p>
            </div>
            <div>
              {result.assessment.vulnerabilities.map((vulnerability, index) => (
                <div key={index}>
                  {prevention[vulnerability] ? (
                    <div>
                      <h3>Prevention for {vulnerability}</h3>
                      <ul>
                        {Object.keys(prevention[vulnerability]).map((key) => (
                          <li key={key}>{prevention[vulnerability][key]}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
