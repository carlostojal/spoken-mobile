import React from "react";
import { View } from "react-native";
import Post from "../../Misc/Post";

import global_styles from "../../global_styles";

export default function PostView(props) {

  return (
    <View style={global_styles.container}>
      <Post data={props.route.params.post} renderComments={true} />
    </View>
  );
}