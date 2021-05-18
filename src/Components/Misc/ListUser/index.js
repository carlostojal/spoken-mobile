import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import Constants from "expo-constants";

import CustomText from "../CustomText";

import styles from "./styles";

export default function ListUser(props) {


  const onPress = (user_id) => {
    props.navigation.navigate("SearchProfile", {
      user_id
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(props.user.id)} style={{flexDirection: "row"}}>
      { props.user.profile_pic &&
        <Image style={{width: 50, height: 50, borderRadius: 50}} source={{uri: `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/media/${props.user.profile_pic._id}`}} />
      }
      <View style={{marginLeft: 10}}>
        <CustomText style={styles.username}>
          {props.user.username}
        </CustomText>
        <CustomText style={styles.name}>
          {`${props.user.name} ${props.user.surname}`}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
}