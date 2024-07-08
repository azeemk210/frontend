import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [degree, setDegree] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDegreeChange = (e) => {
    setDegree(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('degree', degree);

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      if (jsonData.delays) {
        setResults(jsonData.delays);
        setSuccess('File uploaded successfully.');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      setError('Error: ' + error.message);
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Delay Prediction</h1>
      </header>
      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Select CSV file:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div>
            <label>Select degree of polynomial:</label>
            <select value={degree} onChange={handleDegreeChange}>
              <option value="">Select degree...</option>
              {[1, 2, 3, 4, 5, 6].map((deg) => (
                <option key={deg} value={deg}>{`Degree ${deg}`}</option>
              ))}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
        {results.length > 0 && (
          <div>
            <h2>Predicted Delays:</h2>
            <table>
              <thead>
                <tr>
                  <th>Count</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Predicted Delay</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{result.lat}</td>
                    <td>{result.lon}</td>
                    <td>{result.predicted_delay.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
