import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FaCopy } from 'react-icons/fa'; // Import copy icon

function App() {
  const [logged, setLogged] = useState(localStorage.getItem('email'));
  const [link, setLink] = useState();
  const [compressedLink, setCompressedLink] = useState('');
  const [copied, setCopied] = useState(false);

  async function onSuccess(response) {
    console.log(response.credential);
    let credential = jwtDecode(response.credential);
    alert('hi ', credential.email);
  }

  async function CompressLink(event) {
    event.preventDefault();
    if (link && isValidURL(link)) {
      try {
        let data = await fetch(`${process.env.REACT_APP_SERVER_URL}/create-link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: link,
            api: false,
          }),
        });
        data = await data.json();

        if (data.status === true) {
          setCompressedLink(`${process.env.REACT_APP_SERVER_URL}/${data.tinyUrl}`);
          setCopied(false); // Reset copied status when new link is generated
        } else {
          setCompressedLink('Some problem occurred!');
        }
      } catch (err) {
        alert('Problem at our server!');
        console.log(err);
      }
    } else {
      alert('Enter a valid URL');
    }
  }

  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  function copyToClipboard() {
    if (compressedLink) {
      navigator.clipboard.writeText(compressedLink);
      setCopied(true); // Show copied status
    }
  }

  return (
    <div className="App">
      <h1>URL shortener service.</h1>
      {!logged ? (
        <div>
          <h3>Login to use the service!</h3>
          <center>
            <GoogleLogin onSuccess={onSuccess} />
          </center>
        </div>
      ) : (
        <div>
          <b>{localStorage.getItem('email')}</b>
          <br />
          <button
            onClick={() => {
              localStorage.removeItem('email');
              setLogged(false);
            }}
          >
            Log out
          </button>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <form className="Main-form">
          <input type="text" onChange={(event) => setLink(event.target.value)} placeholder="Paste the link here" />
          <br />
          <br />
          <br />
          <label style={{ backgroundColor: 'white', borderRadius: '5px', padding: '3px', margin: '10px', display: 'flex', alignItems: 'center' }}>
            {compressedLink ? compressedLink : 'Paste a link above'}
            {compressedLink && (
              <span style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={copyToClipboard}>
                <FaCopy color={copied ? 'green' : 'black'} /> {/* Copy icon */}
              </span>
            )}
          </label>
          {copied && <span style={{ color: 'green', marginLeft: '10px' }}>Copied!</span>}
          <br />
          <br />
          <br />
          <button onClick={(event) => CompressLink(event)}>Compress link</button>
        </form>
      </div>
    </div>
  );
}

export default App;
