import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, FlatList } from "react-native";
import { useMutation } from "@apollo/client";

import CommentIcon from "../../../../assets/icons/comment1.svg";
import CustomText from "../CustomText";
import Comment from "../Comment";

import postDateFormat from "../../../helpers/postDateFormat";
import styles from "./styles";
import queries from "./queries";

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

  const [userReacted, setUserReacted] = useState(props.userReacted || props.data.user_reacted);

  const [reactPost, { data: reactData, loading: reactLoading, error: reactError }] = useMutation(queries.REACT_POST, {
    variables: {
      id: props.data.id
    }
  });

  useEffect(() => {
    if(reactError)
      setUserReacted(!userReacted);
  }, [reactData]);

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

  const renderComment = ({item}) => {
    return (
      <Comment data={item}/>
    );
  }

  const onReact = () => {
    reactPost();
    setUserReacted(!userReacted);
  }

  return (
    <View style={styles.container} onLayout={getPostDimensions}>
      {
        // image
      }
      { props.data.media_url &&
        <Image source={{uri: props.data.media_url}} style={{ width: imageDimensions.width, height: imageDimensions.height }} onLoadEnd={() => setImageLoaded(true)} />
      }
      { props.data.media_url && !imageLoaded &&
        <View style={styles.loading_image} />
      }
      {
        // header
      }
      <View style={styles.header} onLayout={getHeaderDimensions}>
        <CustomText style={styles.username}>{`@${props.data.poster.username}`}</CustomText>
        <View style={styles.time_options}>
          <CustomText>{dateFormatResult.value + dateFormatResult.unit}</CustomText>
          <Image source={require("../../../../assets/icons/icons8-menu-vertical-24.png")} style={{ marginLeft: 5, width: optionsIconDimensions.width, height: optionsIconDimensions.height }} />
        </View>
      </View>
      {
        // content
      }
      <CustomText style={styles.content}>{props.data.text}</CustomText>
      {
        // footer
      }
      <View style={styles.footer} onLayout={getFooterDimensions}>
        <TouchableOpacity onPress={onReact}>
          { !userReacted &&
            <Image source={require("../../../../assets/icons/icons8-heart-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
          }
          { userReacted &&
            <Image source={require("../../../../assets/icons/icons8-heart-active1-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
          }
        </TouchableOpacity>
        <TouchableOpacity>
          <CommentIcon width={footerIconsDimensions.width} height={footerIconsDimensions.height} style={styles.footer_icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../../../../assets/icons/icons8-share-3-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
        </TouchableOpacity>
      </View>
      {
        // comments
      }
      { props.renderComments &&
        <FlatList 
          data={props.data.comments}
          renderItem={renderComment}
        />
      }
    </View>
  );
}