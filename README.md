## Exports fletching

Fletch is built pretty exclusively for JSON format API consumption if you want or need something more robust, there are much better tools out there. This was built for minimal use cases that didn't need more robust solutions and to minimize code size.

I use it often in small scale web apps and inside Cloudflare Workers.

Fletch expects a basic config object with headers and uri base

## Example Usage

const fletching = require('fletching')
// import fletching from 'fletching'

```
const API = fletching({
  base: 'https://apiroot.com/api/v1'
})

const APIHeaders = new Headers()
APIHeaders.append('Authorization', 'Bearer ***')
APIHeaders.append('Content-Type', 'application/json')

const API = fletching({
  base: 'https://apiroot.com/api/v1'
  headers: APIHeaders
})

const getData = async () => {
  try {
    const response = await API.get('/an-endpoint')
    if (!response.ok){
      return // an error
    }
    // find your info at response.data
  } catch (err) {
    return err
  }
}

const postData = async () => {
try {
    const response = await API.post('/an-endpoint', data) // object will be converted via JSON.stringify
    if (!response.ok){
      return // an error
    }
    // find your info at response.data
  } catch (err) {
    return err
  }
}
```
