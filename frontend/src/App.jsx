import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import VulSolution  from "./VulSolution";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResult(null);
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:8000/vulnerability", {
        params: { url },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
              {/* <i class="fa-solid fa-magnifying-glass"></i> */}
              <img
                src="../images/search-removebg-preview.png"
                alt=""
                srcset=""
              />
            </button>
          </div>
        </form>
        {loading ? <span className="loader"></span> : null}
        {result && (
          <div className="resultStyle">
            <div className="url">
              {url}
              {/* <div className="url-img">
            <img src="../images/" alt="" srcset="" />
            </div>
             */}
            </div>
            <div className="bottom-result">
              <div className="vul">
                <ul>
                  {result.assessment.vulnerabilities.map(
                    (vulnerability, index) => (
                      <li key={index}>{vulnerability}</li>
                    )
                  )}
                </ul>
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
                <span> 2</span> Sec
              </p>
            </div>
            {/* <div className="link">
              <p>Click here to see </p>
            </div> */}

             {/* last div logic to hide or unhide the last div */}
            {result.assessment.vulnerabilities.includes(
              "No Common Vulnerabilities Detected"
            ) ? null : (
              <div className="last">
                <img
                  className="hand"
                  src="../images/giphy.gif"
                  alt=""
                  srcset=""
                />
                <a href="../src/page.html"></a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
