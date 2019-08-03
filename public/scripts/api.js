import { get, post } from 'httpie';

const BaseURL = 'http://dnd5eapi.co/api/'
export async function asyncCall(endpoint, dataFunction) {
    //endpoint will be a string like 'classes' or 'classes/1'
    dataFunction = dataFunction || console.log;
    try {
        const data = await get(BaseURL + endpoint + '/');
        //data is an HTTPStream Object
        //data.data will give the JSON response

        console.log("Status Code: " + data.statusCode); //=> 201
        dataFunction(data.data);
  } catch (err) {
        console.error('Error!', err.statusCode, err.message);
  }
}



