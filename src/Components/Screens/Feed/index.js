import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { useLazyQuery, useQuery } from "@apollo/client";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import Post from "../../Misc/Post";

import refreshToken from "../../../helpers/refreshToken";

import queries from "./queries";
import styles from "./styles";

export default function Feed(props) {

  const { t } = useTranslation();

  // salutation
  const [salutation, setSalutation] = useState("...")

  // page number
  const [page, setPage] = useState(1);
  const perPage = Constants.manifest.extra.POSTS_PER_PAGE;

  // feed query
  const [getFeed, { data: feedData, loading: feedLoading, error: feedError, refetch: feedRefetch }] = useLazyQuery(queries.GET_FEED, {
    fetchPolicy: "network-only",
    onError: (error) => {
      console.log(error);
      refreshToken(feedRefetch, { variables: { page, perPage } });
    }
  });

  const { data: userData } = useQuery(queries.GET_USER_DATA);

  // feed array
  const [feed, setFeed] = useState(null);

  // get salutation by time
  useEffect(() => {

    const currentHours = parseInt(new Date().getHours());

    if(currentHours >= 12 && currentHours < 20)
      setSalutation(t("screens.feed.labels.good_afternoon"));
    else if(currentHours >= 20)
      setSalutation(t("screens.feed.labels.good_evening"));
    else
      setSalutation(t("screens.feed.labels.good_morning"));

  });

  useEffect(() => {
    if(page)
      getFeed({ variables: { page, perPage } });
  }, [page]);

  useEffect(() => {
    if(feedData && feedData.getUserFeed) {
      if(feedData.getUserFeed.length == 0) {
        setPage(null);
      } else {
        if(!feed)
          setFeed(feedData.getUserFeed);
        else
          setFeed([...feed].concat(feedData.getUserFeed));
      }
    }
  }, [feedData]);

  useEffect(() => {
    if(feedError) {
      console.log(feedError);
      Alert.alert(t("strings.error"), t("errors.unexpected"));
    }
  }, [feedError]);

  useEffect(() => {
    if(props.shouldReload) {
      setPage(1);
      setFeed({});
    }
  }, [props.shouldReload]);

  const renderItem = ({ item }) => {
    return (
      <Post data={item} navigation={props.navigation} />
    );
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <CustomText style={styles.header_title}>
          { salutation }
        </CustomText>
        <CustomText style={styles.header_name}>
          { userData && userData.getUserData ?
            userData.getUserData.name :
            "..." }
        </CustomText>
      </View>
    );
  }

  const renderFooter = () => {
    return (
      <View style={{marginTop: 20}}>
        { feedLoading && 
          <ActivityIndicator size="large" />
        }
        { /*!feedLoading &&
          <NoPosts />
        */ }
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
        onEndReached={() => {
          if(page)
            setPage(page + 1);
        }}
        onEndReachedThreshold={50}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={feedLoading && page == 1} onRefresh={() => {
            setPage(1);
            setFeed([]);
          }}/>
        }
      />
    </View>
  );
}