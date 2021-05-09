import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useLazyQuery, useQuery } from "@apollo/client";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import Post from "../../Misc/Post";
import NoPosts from "../../Misc/NoPosts";

import refreshToken from "../../../helpers/refreshToken";

import queries from "./queries";
import styles from "./styles";

export default function Feed(props) {

  const { t } = useTranslation();

  // salutation
  const [salutation, setSalutation] = useState("...")

  // feed query
  const { data: feedData, loading: feedLoading, error: feedError, refetch: feedRefetch } = useQuery(queries.GET_FEED, {
    fetchPolicy: "network-only",
    onError: (error) => {
      console.log(error);
      refreshToken(feedRefetch);
    }
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
  }, [feedData]);

  useEffect(() => {
    if(feedError) {
      console.log(feedError);
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
      <Post data={item} navigation={props.navigation} profileType="dynamic" renderOptions={false} />
    );
  }

  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.header}
        onPress={() => props.navigation.navigate("Profile")}
      >
        <CustomText style={styles.header_title}>
          { salutation }
        </CustomText>
        <CustomText style={styles.header_name}>
          { userData && userData.getUserData ?
            userData.getUserData.name :
            "..." }
        </CustomText>
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
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={feedLoading} onRefresh={() => {
            setFeed([]);
          }}/>
        }
      />
    </View>
  );
}