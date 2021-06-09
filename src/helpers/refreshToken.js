import AsyncStorage from "@react-native-community/async-storage";
import getFullBackendAddress from './getFullBackendAddress';

export default function refreshToken(retryFunction, retryVariables) {
  return new Promise((resolve, reject) => {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: "{ refreshToken }"
      })
    };

    fetch(getFullBackendAddress("api"), options)
    .then((res) => {
      res.json().then(async (res) => {
        const token = res.data && res.data.refreshToken ? res.data.refreshToken : null;
        await AsyncStorage.setItem("access_token", token);
        retryFunction(retryVariables);
        return resolve(null);
      }).catch((err) => {
        return reject(err);
      });
    })
  });
}