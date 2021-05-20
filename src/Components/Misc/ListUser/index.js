import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import Constants from "expo-constants";
import { useQuery } from "@apollo/client";

import CustomText from "../CustomText";

import queries from "./queries";
import styles from "./styles";
import colors from "../../../colors";

export default function ListUser(props) {

  const { data: mediaData, loading: mediaLoading, error: mediaError } = useQuery(queries.GET_MEDIA, {
    variables: {
      user_id: props.user._id
    }
  });

  const [media, setMedia] = useState([]);

  useEffect(() => {
    if(mediaData && mediaData.getUserMedia) {
      setMedia(mediaData.getUserMedia.slice(0, 3));
    }
  }, [mediaData]);

  const onPress = (user_id) => {
    props.navigation.navigate("SearchProfile", {
      user_id
    });
  };

  return (
    <TouchableOpacity style={[styles.container, {backgroundColor: colors.card, borderRadius: 10}]} onPress={() => onPress(props.user._id)} >
      <View style={{flexDirection: "row"}}>
        { props.user.profile_pic &&
          <Image style={{flex: 1, aspectRatio: 1/1, borderRadius: 50}} source={{uri: `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/media/${props.user.profile_pic._id}`}} />
        }
        <View style={{marginLeft: 10, flex: 6}}>
          <CustomText style={styles.username}>
            {props.user.username}
          </CustomText>
          <CustomText style={styles.name}>
            {`${props.user.name} ${props.user.surname}`}
          </CustomText>
        </View>
      </View>
      { media &&
        <View style={{marginTop: 5, flexDirection: "row"}}>
          { media.map((item) => (
              (item.type == "image" && 
                <Image key={item._id} style={{flex: 1, aspectRatio: 1/1}} source={{uri: `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/media/${item._id}`}} />
              )
            ))
          }
        </View>
      }
    </TouchableOpacity>
  );
}