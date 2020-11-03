import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { useLazyQuery } from "@apollo/client";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import Header from "../../Misc/Header";
import Post from "../../Misc/Post";

import refreshToken from "../../../helpers/refreshToken";

import global_styles from "../../global_styles";
import queries from "./queries";
import NoPosts from "../../Misc/NoPosts";

export default function Feed(props) {

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

  // feed array
  const [feed, setFeed] = useState(null);

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

  const renderItem = ({ item }) => {
    return (
      <Post data={item} />
    );
  }

  const renderHeader = () => {
    return (
      <Header>Home</Header>
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
    return <View style={{height: 20}} />
  }

  const { t } = useTranslation();

  return (
    <View style={global_styles.container}>
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