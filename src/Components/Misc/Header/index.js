import React, { useState } from "react";
import { View, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../../../colors";
import CustomText from "../CustomText";

import styles from "./styles";

export default function Header(props) {

  const [iconsDimensions, setIconsDimensions] = useState({
    width: 30,
    height: 30
  });

  const getHeaderDimensions = (e) => {
    if(!iconsDimensions.width) {
      const { nativeEvent } = e;
      const icon = require("../../../../assets/icons/icons8-menu-30.png");
      const source = Image.resolveAssetSource(icon);
      const scale = nativeEvent.layout.height / source.height;
      const dimensions = {
        width: (source.width * scale) - 8,
        height: (source.height * scale) - 8
      }
      setIconsDimensions(dimensions);
    }
  }

  return  (
    <View style={styles.container}>
      { props.renderLogo && 
        <Icon name="logo-twitter" size={45} color={colors.primary} style={{marginRight: 5}} />
      }
      <CustomText style={{fontFamily: "Raleway_700Bold", fontSize: 40}}>
        {props.children}
      </CustomText>
    </View>
  );
}