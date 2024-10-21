import React, { useEffect, useState } from 'react';
import './Statistics.css'; // Import your custom styles

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/meta`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { apiCalls, websiteCalls, api } = data;

  return (
    <div className="statistics-container">
        <br></br>
        <br/><br/>
      <h1>Statistics Overview</h1>
      
      <div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap"}}>
        <div className="overview card1">
            <div className="stat-card">
            <h2>Total API Calls</h2>
            <p className="stat-number">{apiCalls}</p>
            </div>
            <div className="stat-card">
            <h2>Total Website Calls</h2>
            <p className="stat-number">{websiteCalls}</p>
            </div>
        </div>

        <div  className='card1'>
            <h2 className="section-title">Daily Views</h2>
            <ul className="daily-stats">
                {api.stats.daily.map((dailyStat, index) => (
                <li key={index} className="daily-item">
                    <span className="daily-date">{dailyStat.date}</span>
                    <span className="daily-views">Views: {dailyStat.views}</span>
                </li>
                ))}
            </ul>
        </div>

        <div className='card1'>
            <h2 className="section-title">Monthly Views</h2>
            <ul className="monthly-stats">
                {api.stats.monthly.map((monthlyStat, index) => (
                <li key={index} className="monthly-item">
                    <span className="monthly-month">{monthlyStat.month}</span>
                    <span className="monthly-views">Views: {monthlyStat.views}</span>
                </li>
                ))}
            </ul>
        </div>
      </div>

      <div>
        <h2 className="section-title">API Views by IP</h2>
        <ul className="ip-list">
            {api.ipAdrs.map((ipData, index) => (
            <li key={index} className="ip-item">
                <span className="ip-address">{ipData.ip}</span>
                <span className="ip-views">Views: {ipData.views}</span>
            </li>
            ))}
        </ul>
    </div>


    </div>
  );
};

export default Statistics;
