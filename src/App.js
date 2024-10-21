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
    <div  className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
