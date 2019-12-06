
/*
 stop program for a while
*/
import { isConsoleMessage } from './config';
import AsyncStorage from '@react-native-community/async-storage'
import { Toast } from 'native-base';

export const sleep = async (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
    });
}
/**
 * show console messages
 */

export const showMessage = (messages) => {
    if (isConsoleMessage)
        console.log(messages);
}

/**
 * store data in async storage
 * 
 */
export const storeItem = async (key, item) => {
    return new Promise(async (resolve, reject) => {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            resolve(jsonOfItem);
        } catch (error) {
            reject(error);
        }
    })

}

/**
 * reterive data from async storage
 * 
 */

export const retrieveItem = async (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            resolve(item);
        } catch (error) {
            reject(error.message);
        }
    })
}

export const removeItem = async (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(key);            
            resolve('removed');
        } catch (error) {
            reject(error.message);
        }
    })
}

export const showToast = async (text,type) =>{
        Toast.show({
            text: text,        
            duration: 3000,
            position: "bottom",
            type:type
          })
    //    alert(text)
}

export const getRandomColor=()=> {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }