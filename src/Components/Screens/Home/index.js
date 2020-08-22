import React, { useState } from "react";
import { View, ScrollView, Dimensions, TouchableWithoutFeedback } from "react-native";

import Feed from "../Feed";
import Conversations from "../Conversations";

export default function Home(props) {

  const [homeScroller, setHomeScroller] = useState(null);

  return (
    <ScrollView
      ref={ref => setHomeScroller(ref)}
      horizontal
      decelerationRate="fast"
      pagingEnabled
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
    >
      <Feed navigation={props.navigation} homeScroller={homeScroller} />
      <Conversations />
    </ScrollView>
  );
}