import { isArray } from "lodash";

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL_SERVER = 'http://localhost:8000/api/'
// const API_URL = 'https://055c-46-53-243-63.ngrok-free.app/api/'
const methods = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

const api = async (path, method, body, jwt=null, headers={'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '69420'}, API_URL=API_URL_SERVER) => {
  const token = jwt ? { 'Authorization': 'Bearer ' + jwt } : {}
  
  const options = {
    method: method,
    headers: {...headers, ...token},
  }

  if (body) {
    options.body = body;
  }

  const resp = await fetch(API_URL + path, options);
  
  let data = null;
  if (headers['Content-Type'] === 'image/png') {
    data = await resp.blob()
    console.log(data)
  }
  else {
    data = await resp.text();
    if (data) {
      data = JSON.parse(data);
    }
  }

  console.log("----")
  console.log(path)
  console.log(data)
  console.log("----")

  let err = null;
  if (![200, 204].includes(resp.status)) {
    const detail = data.detail
    err = isArray(detail) ? detail[0].msg : detail;
  }
  return {data, err}
}


const apiOpertoureservice = async (path, method, body) => {
  const API_URL = 'https://api.openrouteservice.org/'

  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': '5b3ce3597851110001cf6248a93b8f1318c14c3ba77587c7df74414d', 'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    },
  }

  if (body) {
    options.body = body;
  }

  const resp = await fetch(API_URL + path, options);

  let data = await resp.text();
  if (data) {
    data = JSON.parse(data);
  }

  console.log("----")
  console.log(path)
  console.log(data)
  console.log("----")

  let err = null;
  if ('error'.includes(resp)) {
    err = data.error
  }
  return {data, err}
}


const swapElements = (array, index1, index2) => {
  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  console.log(array)
  return array
};

export { api, apiOpertoureservice, methods, swapElements };

