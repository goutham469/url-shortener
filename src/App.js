import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './components/Main/Main';
import Statistics from './components/statistics/Statistics';
import AllUrls from './components/URLS/AllUrls';

function App() {


  const router = createBrowserRouter([
    {
      path:'',
      element:<Main/>
    },
    {
      path:'stats',
      element:<Statistics/>
    },
    {
      path:'urls',
      element:<AllUrls/>
    }
  ])

  return (
    <div style={{
      backgroundImage: `url(${process.env.REACT_APP_CLIENT_URL}/background.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      textAlign:"center",
      margin:"0px",
      padding:"0px",
      width:"100vw",
      height:"100vh",
      overflow:"auto"
    }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
