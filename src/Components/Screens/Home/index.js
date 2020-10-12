import React, { useState } from "react";
import { View, ScrollView, Dimensions, TouchableWithoutFeedback } from "react-native";

import Feed from "../Feed";
import Conversations from "../Conversations";

export default function Home(props) {

  return (
    <Feed navigation={props.navigation} />
  );
}