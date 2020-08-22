import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, ActivityIndicator } from "react-native";

import CustomText from "../CustomText";

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

  const [footerIconsDimensions, setFooterIconsDimensions] = useState({
    width: null,
    height: null
  });
  const [footerIconsDimensionsSet, setFooterIconsDimensionsSet] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);

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

  const getFooterDimensions = (e) => {
    if(!footerIconsDimensionsSet) {
      const { nativeEvent } = e;
      const icon = require("../../../../assets/icons/icons8-heart-50.png");
      const source = Image.resolveAssetSource(icon);
      const scale = nativeEvent.layout.height / source.height;
      const dimensions = {
        width: (source.width * scale) - 15,
        height: (source.height * scale) - 15
      }
      setFooterIconsDimensionsSet(true);
      setFooterIconsDimensions(dimensions);
    }
  }

  return (
    <View style={styles.container} onLayout={getPostDimensions}>
      { props.data.media_url &&
        <Image source={{uri: props.data.media_url}} style={{ width: imageDimensions.width, height: imageDimensions.height }} onLoadEnd={() => setImageLoaded(true)} />
      }
      { props.data.media_url && !imageLoaded &&
        <View style={styles.loading_image} />
      }
      <View style={styles.header} onLayout={getHeaderDimensions}>
        <CustomText style={styles.username}>{`@${props.data.poster.username}`}</CustomText>
        <View style={styles.time_options}>
          <CustomText>{dateFormatResult.value + dateFormatResult.unit}</CustomText>
          <Image source={require("../../../../assets/icons/icons8-menu-vertical-24.png")} style={{ marginLeft: 5, width: optionsIconDimensions.width, height: optionsIconDimensions.height }} />
        </View>
      </View>
      <CustomText style={styles.content}>{props.data.text}</CustomText>
      <View style={styles.footer} onLayout={getFooterDimensions}>
        <Image source={require("../../../../assets/icons/icons8-heart-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
        <Image source={require("../../../../assets/icons/icons8-send-comment-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
        <Image source={require("../../../../assets/icons/icons8-share-3-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
      </View>
    </View>
  );
}