import React from "react";
import { View, ScrollView, Dimensions, TouchableWithoutFeedback } from "react-native";

import Feed from "../Feed";
import Conversations from "../Conversations";

export default function Home() {

  return (
    <ScrollView
      horizontal
      decelerationRate="fast"
      pagingEnabled
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
    >
      <Feed />
      <Conversations />
    </ScrollView>
  );
}