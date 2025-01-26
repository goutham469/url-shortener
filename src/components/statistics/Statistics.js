import React, { useEffect, useState } from 'react';
import './Statistics.css'; // Import your custom styles
import { BarChart } from '@mui/x-charts';

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure `api` exists to avoid errors
  const { apiCalls, websiteCalls, api = {} } = data;

  return (
    <div className="statistics-container">
      <h1 style={{backgroundColor:"white",width:"fit-content",padding:"10px",borderRadius:"10px",boxShadow:"2px 2px 2px red"}}>Statistics Overview</h1>

      <div>
        <div className="overview card1">
          <div className="stat-card">
            <h2>API Calls</h2>
            <p className="stat-number">{apiCalls}</p>
          </div>
          <div className="stat-card">
            <h2>Website Calls</h2>
            <p className="stat-number">{websiteCalls}</p>
          </div>
        </div>

        <div className="card1">
          <h2 className="section-title">Daily Views</h2>

          <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              padding: "20px"
            }}>
              {/* Chart Container */}
              <div style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                minWidth: "300px",
                flex: "1"
              }}>
                {api.stats.daily && <ChartsOverviewDemo data={api.stats.daily} />}
              </div>

              {/* Table Container */}
              <div style={{
                padding: "20px",
                borderRadius: "10px",
                minWidth: "300px",
                flex: "1"
              }}>
                <table className="daily-stats-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {api.stats?.daily?.map((dailyStat, index) => (
                      <tr key={index}>
                        <td>{dailyStat.date}</td>
                        <td>{dailyStat.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


        </div>

        <div className="card1">
          <h2 className="section-title">Monthly Views</h2>


          <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              padding: "20px"
            }}>
              {/* Chart Container */}
              <div style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                borderRadius: "10px",
                minWidth: "300px",
                flex: "1"
              }}>
                {api.stats.monthly && <ChartsOverviewDemoMonthly data={api.stats.monthly} />}
              </div>

              {/* Table Container */}
              <div style={{
                padding: "20px",
                borderRadius: "10px",
                minWidth: "300px",
                flex: "1"
              }}>
                <table className="daily-stats-table">
                  <thead>
                    <tr>
                      <th>month</th>
                      <th>views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {api.stats?.monthly?.map((monthlyStat, index) => (
                      <tr key={index}>
                        <td>{monthlyStat.month}</td>
                        <td>{monthlyStat.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>



        </div>
      </div>

      <div>
        <h2 className="section-title">API Views by IP</h2>

        <div style={{display:"flex",justifyContent:"space-around"}}>
          <div style={{
              padding: "20px",
              borderRadius: "10px",
              minWidth: "300px",
              flex: "1"
            }}>
              <table className="daily-stats-table">
                <thead>
                  <tr>
                    <th>month</th>
                    <th>views</th>
                  </tr>
                </thead>
                <tbody>
                  {api.ipAdrs?.map((ipData, index) => (
                    <tr key={index}>
                      <td>{ipData.ip}</td>
                      <td>{ipData.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>


      </div>
    </div>
  );
};

function ChartsOverviewDemo({ data }) {
  const values = data.map(x => x.views);
  const names = data.map(x => x.date);

  return (
    <BarChart
      series={[{ data: values }]}
      height={290}
      xAxis={[{ data: names, scaleType: 'band' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}

function ChartsOverviewDemoMonthly({ data }) {
  const values = data.map(x => x.views);
  const names = data.map(x => x.month);

  return (
    <BarChart
      series={[{ data: values }]}
      height={290}
      xAxis={[{ data: names, scaleType: 'band' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}


export default Statistics;
