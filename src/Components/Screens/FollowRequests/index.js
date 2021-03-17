import React, { useState, useEffect } from "react";
import { FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

import Header from "../../Misc/Header";
import FollowRequest from "../../Misc/FollowRequest";
import queries from "./queries";

export default function FollowRequests(props) {

  const { t } = useTranslation();

  const { data, loading, error } = useQuery(queries.GET_FOLLOW_REQUEST);

  const [requests, setRequests] = useState();

  useEffect(() => {
    if(data && data.getFollowRequests)
      setRequests(data.getFollowRequests);
  }, [data]);

  const renderItem = ({ item }) => {
    return <FollowRequest user={item.user} />
  };

  console.log(requests);

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
        data={requests}
        renderItem={renderItem}
      />
    </>
  );
}