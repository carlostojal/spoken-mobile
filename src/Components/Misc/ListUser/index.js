import React from "react";
import { TouchableOpacity } from "react-native";

import CustomText from "../CustomText";

import styles from "./styles";

export default function ListUser(props) {


  const onPress = (user_id) => {
    props.navigation.navigate("SearchProfile", {
      user_id
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(props.user.id)}>
      <CustomText style={styles.username}>
        {props.user.username}
      </CustomText>
      <CustomText style={styles.name}>
        {`${props.user.name} ${props.user.surname}`}
      </CustomText>
    </TouchableOpacity>
  );
}