import React from "react";
import { ScrollView, View } from "react-native";
import { useQuery } from "@apollo/client";

import CustomText from "../CustomText";
import styles from "./styles";
import queries from "./queries";

export default function Profile(props) {

  const { data: userData } = useQuery(queries.GET_PROFILE, {
    variables: {
      user_id: props.user_id
    }
  });

  const renderHeader = () => {
    return (
      <View style={styles.container}>
        <CustomText style={styles.username}>
          { userData && userData.getUserData ? 
            userData.getUserData.username :
            "..."
          }
        </CustomText>
        <CustomText style={styles.name}>
          { userData && userData.getUserData ? 
            userData.getUserData.name + " " + userData.getUserData.surname :
            "..."
          }
        </CustomText>
      </View>
    );
  };

  return (
    <ScrollView>
      {
        renderHeader()
      }
    </ScrollView>
  );
}