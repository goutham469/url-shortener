import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [logged , setLogged] = useState(localStorage.getItem('email'))
  const [link , setLink] = useState()
  const [compressedLink , setCompressedLink] = useState()

  async function onSuccess(response)
  {
    console.log(response.credential)
    let credential = jwtDecode(response.credential)

    alert("hi ",credential.email)
  }

  async function CompressLink(event) 
  {
    event.preventDefault()
    if(link && isValidURL(link))
    {
      
      try
      {
        let data = await fetch(`${process.env.REACT_APP_SERVER_URL}/create-link`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            url : link,
            api : false
          })
        })
        data = await data.json()

        if(data.status == true)
        {
          setCompressedLink(`${process.env.REACT_APP_SERVER_URL}` + data.tinyUrl)
        }
        else
        {
          setCompressedLink("some problem occured !")
        }
      }
      catch(err)
      {
        alert("Problem at our server !")
        console.log(err)
      }
    }
    else
    {
      alert("enter a valid URL")
    }
  }

  function isValidURL(string) {
      try {
          new URL(string);
          return true; // If no error, the URL is valid
      } catch (err) {
          return false; // If an error is thrown, the URL is invalid
      }
  }
  return (
    <div className="App">
      <h1>URL shortener service .</h1>
      {
        !logged ?
        <div>
          <h3>Login to use the service !</h3>
          <center>
            <GoogleLogin onSuccess={onSuccess}/>
          </center>
        </div>
        :
        <div>
          <b>{localStorage.getItem('email')}</b>
          <br/>
          <button onClick={()=>{
            localStorage.removeItem('email')
            setLogged(false)
          }}>log out</button>
        </div>
      }
      <div style={{display:"flex",justifyContent:"space-around"}}>
        <form className='Main-form'>
          <input type='text' onChange={(event)=>setLink(event.target.value)} placeholder='paste the link here'/><br/>
          <label>{compressedLink?compressedLink:"paste a link above"}</label><br/>
          <button onClick={(event)=>CompressLink(event)}>Compress link</button>
        </form>
      </div>
    </div>
  );
}

export default App;
