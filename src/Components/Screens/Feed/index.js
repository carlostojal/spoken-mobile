import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, TouchableOpacity, Image } from "react-native";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";

import Post from "../../Misc/Post";
import NoPosts from "../../Misc/NoPosts";

import queries from "./queries";
import styles from "./styles";
import getFullBackendAddress from "../../../helpers/getFullBackendAddress";

export default function Feed(props) {

  const { t } = useTranslation();

  // salutation
  const [salutation, setSalutation] = useState("...")

  // feed query
  const {
    data: feedData,
    loading: feedLoading,
    error: feedError, 
    refetch: feedRefetch 
  } = useQuery(queries.GET_FEED, {
    fetchPolicy: "network-only"
  });

  const { data: userData } = useQuery(queries.GET_USER_DATA);

  // feed array
  const [feed, setFeed] = useState(null);

  // get salutation by time
  useEffect(() => {

    const currentHours = parseInt(new Date().getHours());

    if(currentHours >= 6 && currentHours < 12)
      setSalutation(t("screens.feed.labels.good_morning"));
    else if(currentHours >= 12 && currentHours < 20)
      setSalutation(t("screens.feed.labels.good_afternoon"));
    else
      setSalutation(t("screens.feed.labels.good_evening"));      

  });

  useEffect(() => {
    if(feedData && feedData.getUserFeed)
      setFeed(feedData.getUserFeed);
  }, [feedData, feed]);

  useEffect(() => {
    if(feedError) {
      Alert.alert(t("strings.error"), t("errors.unexpected") + "\n" + feedError.message);
    }
  }, [feedError]);

  useEffect(() => {
    if(props.shouldReload) {
      setFeed({});
    }
  }, [props.shouldReload]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate("PostView", {post: JSON.stringify(item)})}>
        <Post containerStyle={{marginLeft: 15, marginRight: 15}} data={item} navigation={props.navigation} profileType="dynamic" renderFooter={true} />
      </TouchableOpacity>
    );
  }

  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.header}
        onPress={() => props.navigation.navigate("Profile")}
      >
        { userData && userData.getUserData && userData.getUserData.profile_pic &&
          <>
            <Image style={{flex: 1, aspectRatio: 1/1, borderRadius: 50}} source={{uri: `${getFullBackendAddress("media")}/media/${userData.getUserData.profile_pic._id}`}} />
            <View style={{width: 10}} />
          </>
        }
        <View style={{flex: 7}}>
          <CustomText style={styles.header_title}>
            { salutation }
          </CustomText>
          <CustomText style={styles.header_name}>
            { userData && userData.getUserData ?
              userData.getUserData.name :
              "..." }
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  }

  const renderFooter = () => {
    return (
      <View style={{marginTop: 20}}>
        { feedLoading && 
          <ActivityIndicator size="large" />
        }
        { !feedLoading &&
          <NoPosts />
        }
      </View>
    );
  }

  const renderSeparator = () => {
    return <View style={{height: 15}} />
  }  

  return (
    <View>
      <FlatList
        decelerationRate="normal"
        data={feed}
        renderItem={renderItem}
        onEndReachedThreshold={50}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={feedLoading} onRefresh={() => {
            setFeed([]);
            feedRefetch();
          }}/>
        }
      />
    </View>
  );
}