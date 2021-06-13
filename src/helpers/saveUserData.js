import { gql } from "@apollo/client";
import getClient from "../apollo_config";
import AsyncStorage from "@react-native-community/async-storage";


export default async function saveUserData () {

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
        followers {
          _id
        }
        following {
          _id
        }
      }
    }
  `;

  let client = null;
  try {
    client = await getClient();
  } catch(e) {
    console.error(e);
    throw e;
  }

  let data = null;
  try {
    data = await client.query({
      query: GET_DATA
    });
  } catch(e) {
    console.error(e);
    throw e;
  }

  if(data && data.data && data.data.getUserData) {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(data.data.getUserData));
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  return data.data.getUserData;

}