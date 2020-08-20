import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";

import postDateFormat from "../../../helpers/postDateFormat";
import styles from "./styles";

export default function Post(props) {

  const [imageDimensions, setImageDimensions] = useState({
    width: null,
    height: null
  });

  const [imageDimensionsSet, setImageDimensionsSet] = useState(false);

  const [optionsIconDimensions, setOptionsIconDimensions] = useState({
    width: null,
    height: null
  });

  const [optionsIconDimensionsSet, setOptionsIconDimensionsSet] = useState(false);

  const dateFormatResult = postDateFormat(parseInt(props.data.time));

  const getPostDimensions = (e) => {
    if(!imageDimensionsSet) {
      const { nativeEvent } = e;
      if(props.data.media_url) {
        Image.getSize(props.data.media_url, (width, height) => {
          const scale = nativeEvent.layout.width / width;
          const dimensions = {
            width: (width * scale) - 2,
            height: height * scale
          }
          setImageDimensionsSet(true);
          setImageDimensions(dimensions);
        }, (error) => {
          console.log(error);
        });
      }
    }
  }

  const getHeaderDimensions = (e) => {
    if(!optionsIconDimensionsSet) {
      const { nativeEvent } = e;
      const icon = require("../../../../assets/icons/icons8-menu-vertical-24.png");
      const source = Image.resolveAssetSource(icon);
      const scale = nativeEvent.layout.height / source.height;
      const dimensions = {
        width: (source.width * scale) - 30,
        height: (source.height * scale) - 30
      }
      setOptionsIconDimensionsSet(true);
      setOptionsIconDimensions(dimensions);
    }
  }

  return (
    <View style={styles.container} onLayout={getPostDimensions}>
      <View style={styles.header} onLayout={getHeaderDimensions}>
        <Text style={styles.username}>{`@${props.data.poster.username}`}</Text>
        <View style={styles.time_options}>
          <Text>{dateFormatResult.value + dateFormatResult.unit}</Text>
          <Image source={require("../../../../assets/icons/icons8-menu-vertical-24.png")} style={{ marginLeft: 5, width: optionsIconDimensions.width, height: optionsIconDimensions.height }} />
        </View>
      </View>
      { props.data.media_url &&
        <Image source={{uri: props.data.media_url}} style={{ width: imageDimensions.width, height: imageDimensions.height, marginBottom: 15 }} />
      }
      <Text style={styles.content}>{props.data.text}</Text>
    </View>
  );
}