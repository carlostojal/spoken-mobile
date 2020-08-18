import React from "react";
import { gql, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-community/async-storage";

const REFRESH_TOKEN = gql`
  query refreshToken {
    refreshToken
  }
`;

export default function sessionRefresher(props) {

  const { data } = useQuery(REFRESH_TOKEN);

  if(data && data.data) {
    if(data.data.refreshToken) {
      AsyncStorage.setItem("access_token", data.data.refreshToken).then(() => {
        if(props.retryFunction)
          props.retryFunction();
      });
    }
  }

  return null;
}