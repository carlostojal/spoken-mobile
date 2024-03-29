import React, { useState, useEffect } from "react";
import { FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

import Header from "../../Misc/Header";
import FollowRequest from "../../Misc/FollowRequest";
import queries from "./queries";

export default function FollowRequests(props) {

  const { t } = useTranslation();

  const { data, loading, error, refetch } = useQuery(queries.GET_FOLLOW_REQUEST, {
    fetchPolicy: "network-only"
  });

  const [requests, setRequests] = useState();

  useEffect(() => {
    if(data && data.getFollowRequests)
      setRequests(data.getFollowRequests);
  }, [data]);

  // called by the follow request component when it is accepted or ignored
  const onEvent = (type, user_id) => {
    setRequests(requests.filter((request) => {
      return request.user._id != user_id
    }));
    refetch();
  }

  const renderItem = ({ item }) => {
    return <FollowRequest user={item.user} onEvent={onEvent} />
  };

  return (
    <>
      <FlatList 
        ListHeaderComponent={
          <Header>
            { t("screens.follow_requests.title") }
          </Header>
        }
        ListFooterComponent={
          loading && <ActivityIndicator />
        }
        keyExtractor={item => item.user._id}
        data={requests}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => {
            refetch();
          }}/>
        }
      />
    </>
  );
}