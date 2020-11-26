import React, { useState } from "react";
import { View, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../../../colors";
import CustomText from "../CustomText";
import SpokenLogo from "../../../../assets/icons/spoken-logo-cropped.svg";

import styles from "./styles";

export default function Header(props) {

  const onDraw = (e) => {
    console.log(e.nativeEvent.layout);
  }

  return  (
    <View style={styles.container} onLayout={(e) => onDraw(e)}>
      { props.renderLogo && 
        <SpokenLogo width={70} height={40} style={{marginRight: 10}} />
      }
      <CustomText style={{fontFamily: "Raleway_700Bold", fontSize: 40}}>
        {props.children}
      </CustomText>
    </View>
  );
}