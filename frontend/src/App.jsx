import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

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
          <span className="blink">URL Security Assessment    </span>
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
            <div className="vul">
              <ul>
                {result.assessment.vulnerabilities.map(
                  (vulnerability, index) => (
                    <li key={index}>{vulnerability}</li>
                  )
                )}
              </ul>
            </div>
            <div className="time">
              <h1>TIME</h1>
              <p>
                <span>2</span> Sec
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
