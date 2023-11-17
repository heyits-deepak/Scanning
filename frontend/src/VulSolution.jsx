// VulSolution.jsx

import React from "react";
import prevention from "./prevention.json";
import { useLocation } from "react-router-dom";
import "./vulSolution.css";

function VulSolution() {
  const location = useLocation();
  const { state } = location;

  if (!state || !state.result) {
    // Handle the case when result is not available in the state
    return <div>No vulnerabilities detected.</div>;
  }

  const result = state.result;

  return (
    <div>
      <video autoPlay loop muted playsInline>
        <source src="../video/3.mp4" type="video/mp4" />
      </video>

      <h1>SOLUTIONS</h1>
      <div className="cont">
        {result.assessment.vulnerabilities.map((vulnerability, index) => (
          <div className="box" key={index}>
            {prevention[vulnerability] ? (
              <>
                <div className="heading">
                  <h3>Prevention for {vulnerability}</h3>
                </div>
                <div className="list">
                  <ul>
                    {Object.keys(prevention[vulnerability]).map((key) => (
                      <li key={key}>{prevention[vulnerability][key]}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VulSolution;
