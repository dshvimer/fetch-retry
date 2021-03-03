import { useEffect, useState } from 'react';
interface RequestConfig {
  data?: any,
  method: 'GET' | ' POST'
};

const config = ({data, method}: RequestConfig) => {
  const conf = {
    method: method, // *GET, POST, PUT, DELETE, etc.
  }

  if (method === 'GET') return conf
  else return { ...conf, body: JSON.stringify(data)}
}

const status200 = () => {
  return {
    url: 'http://httpstat.us/200',
    config: config({method: 'GET'})
  }
}

const status401 = () => {
  return {
    url: 'http://httpstat.us/401',
    config: config({method: 'GET'})
  }
}

interface Request {
  url: string,
  config: RequestConfig
}

const request = async ({url, config}: Request) => {
    try {
      const res = await fetch(url, config)
      if (res.status === 401) {
        const tokenRes = await fetch('http://httpstat.us/401')
        if (tokenRes.status === 200) {
          // SET THE TOKEN HERE
          const retry = await fetch(url, config)
          return Promise.resolve(retry)
        }
        else {
          return Promise.reject(tokenRes)
        }
      }
      else {
        return Promise.resolve(res)
      }
    }
    catch(e) {
      return Promise.reject(e)
    }
}


function App() {
  const [text, setText] = useState("")

  useEffect(() => {
    request(status401())
    .then(res => {
      console.log('res', res)
      return res.text()
    })
    .then(text => setText(text))
    .catch(error => console.log('error', error))
  }, [])

  return (
    <div className="App">
      {text}
    </div>
  );
}

export default App;
