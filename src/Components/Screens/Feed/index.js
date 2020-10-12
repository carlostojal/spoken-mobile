import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { useQuery } from "@apollo/client";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import Header from "../../Misc/Header";
import Post from "../../Misc/Post";
import CustomText from "../../Misc/CustomText";

import global_styles from "../../global_styles";
import styles from "./styles";
import queries from "./queries";

export default function Feed(props) {

  // page number
  const [page, setPage] = useState(1);
  const perPage = Constants.manifest.extra.POSTS_PER_PAGE;

  // feed query
  const { data: feedData, loading: feedLoading, error: feedError } = useQuery(queries.GET_FEED, {
    variables: {
      page,
      perPage
    }
  });

  // feed array
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    if(feedData && feedData.getUserFeed) {
      if(!feed)
        setFeed(feedData.getUserFeed);
      else
        setFeed([...feed].concat(feedData.getUserFeed));
    }
  }, [feedData]);

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
      <View style={styles.footer}>
        { feedLoading && 
          <ActivityIndicator size="large" />
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
          setPage(page + 1);
        }}
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
      { (!feed || feed.length == 0) && !feedLoading &&
        <CustomText>{t("screens.feed.labels.no_posts")}</CustomText>
      }
    </View>
  );
}