import Constants from 'expo-constants';
import AsyncStorage from "@react-native-community/async-storage";

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

    fetch(`http://${Constants.manifest.extra.API_ADDRESS}:${Constants.manifest.extra.API_PORT}/${Constants.manifest.extra.API_ENDPOINT}`, options)
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