import React, {Fragment, useState, useEffect, useRef} from 'react';
import './App.css';

function useJsonFetch(url, opts) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timestampRef = useRef()
  const interval = 5000;
  console.log("url:",url)
  useEffect(() => {
    const fetchData = async () => {
    const timestamp = Date.now();
    timestampRef.current = timestamp;
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (timestampRef.current === timestamp) {
        const data = await response.json();
        console.log("data json",data);
        setData(data);
      }
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
    };
    fetchData();
    const intervalId = setInterval(fetchData, interval);
    return () => clearInterval(intervalId);
    }, [])

  return [{data, loading, error}];
}


function DataComponent (props) {
  const [{data, loading, error}] = useJsonFetch(props.url, '');
  console.log("DATA:",data)
  return (
    <Fragment>
      <h1>DataComponent</h1>
      <h2>{data.status}</h2>
    </Fragment>
  )
}

function LoadComponent (props) {
  const [loading] = useJsonFetch(props.url, '');
  console.log("LOAD:",loading)
  return (
    <Fragment>
      <h1>LoadComponent</h1>
      {loading && <p>Loading...</p>}
    </Fragment>
  )
}

function ErrorComponent (props) {
  const [error] = useJsonFetch(props.url, '');
  console.log("ERROR:",error)
  return (
    <Fragment>
      <h1>ErrorComponent</h1>
      <p>{error}</p>
    </Fragment>
  )
}

function App() {
  return (
    <div className="App">

      <DataComponent url={process.env.REACT_APP_DATA_URL} />
      <LoadComponent url={process.env.REACT_APP_LOADING_URL} />
      <ErrorComponent url={process.env.REACT_APP_ERROR_URL} />

    </div>
  );
}

export default App;
