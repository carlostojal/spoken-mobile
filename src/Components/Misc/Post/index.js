import React from "react";
import { View, Text, Image } from "react-native";

import styles from "./styles";

export default function Post(props) {

  return (
    <View style={styles.container}>
      <Text>{`@${props.data.poster.username}`}</Text>
      { props.media_url &&
        <Image source={{uri: props.data.media_url}} />
      }
      <Text>{props.data.text}</Text>
    </View>
  );
}