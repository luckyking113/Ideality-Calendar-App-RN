import { showMessage } from './../validator'

export const getApi = (config) => {
    
    showMessage(config)
    return new Promise((resolve,reject)=>{

        return fetch(config.url,
        {
            method: config.type,
            body: config.data,
            headers:config.headers
        })
        .then((response) => response.json())
        .then((responseJson) => {
          showMessage(responseJson)  
          resolve(responseJson);
        })
        .catch((error) => {
            showMessage(error)
            reject(error.message);
        });
    })
    
}

