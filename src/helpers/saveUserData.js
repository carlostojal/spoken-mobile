import { gql } from "@apollo/client";
import getClient from "../apollo_config";
import AsyncStorage from "@react-native-community/async-storage";


export default function saveUserData () {
  return new Promise(async (resolve, reject) => {

    const GET_DATA = gql`
      {
        getUserData {
          _id
          name
          surname
          username
          profile_type
          profile_privacy_type
          permissions {
            collect_usage_data
          }
        }
      }
    `;

    let client = null;
    try {
      client = await getClient();
    } catch(e) {
      return reject(e);
    }

    let data = null;
    try {
      data = await client.query({
        query: GET_DATA
      });
    } catch(e) {
      return reject(e);
    }

    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(data.data.getUserData));
    } catch(e) {
      return reject(e);
    }

    return resolve(data.data.getUserData);
  });
}