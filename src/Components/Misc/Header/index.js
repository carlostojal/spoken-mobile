import React, { useState } from "react";
import { View, Image, TouchableWithoutFeedback } from "react-native";
import MessageIcon from "../../../../assets/icons/message.svg";

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
    <View style={styles.container} onLayout={getHeaderDimensions}>
      <TouchableWithoutFeedback onPress={() => props.navigation.openDrawer()} >
        <Image source={require("../../../../assets/icons/icons8-menu-30.png")} style={{width: iconsDimensions.width, height: iconsDimensions.height}}/>
      </TouchableWithoutFeedback>
      <View style={[styles.right]}>
        <TouchableWithoutFeedback>
          <Image source={require("../../../../assets/icons/icons8-add-image-100.png")} style={{width: iconsDimensions.width, height: iconsDimensions.height}}/>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => props.homeScroller.scrollToEnd({ animated: true })} >
          <MessageIcon width={iconsDimensions.width} height={iconsDimensions.height} style={styles.header_icon} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}