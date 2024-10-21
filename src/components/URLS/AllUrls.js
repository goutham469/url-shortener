import React, { useEffect, useState } from 'react';
import './AllUrls.css'; // Import your custom styles

const AllUrls = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/all-urls`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setUrls(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="all-urls-container">
      <h1 className="all-urls-title">All Shortened URLs</h1>
      
      <table className="urls-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>URL</th>
            <th>Views</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((urlData) => (
            <tr key={urlData._id}>
              <td>
                <a href={`${process.env.REACT_APP_SERVER_URL}/${urlData.key}`} target='_blank'>{urlData.key}</a>
              </td>
              <td>
                <a href={urlData.url} target="_blank" rel="noopener noreferrer">{urlData.url}</a>
              </td>
              <td>{urlData.views}</td>
              <td>{urlData.owner || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUrls;
