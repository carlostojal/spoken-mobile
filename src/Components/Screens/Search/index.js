import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client";
import * as Location from "expo-location";

import CustomTextField from "../../Misc/CustomTextField";
import ListUser from "../../Misc/ListUser";
import NoResults from "../../Misc/NoResults";

import queries from "./queries";
import { FlatList } from "react-native-gesture-handler";

export default function Search(props) {

  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [userLat, setUserLat] = useState(null);
  const [userLong, setUserLong] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  const [doSearch, {data: searchData, loading: searchLoading, error: searchError}] = useLazyQuery(queries.SEARCH);

  const [getNearbyUsers, {data: nearbyData, loading: nearbyLoading, error: nearbyError}] = useLazyQuery(queries.NEARBY_USERS);

  useEffect(() => {
    doSearch({variables: { query }});
  }, [query]);

  useEffect(() => {
    if(searchData && searchData.userSearch) {
      setResults(searchData.userSearch);
    } else {
      setResults([]);
    }
  }, [searchData]);

  useEffect(() => {
    if(nearbyData && nearbyData.getNearbyUsers) {
      setNearbyUsers(nearbyData.getNearbyUsers);
      setResults(nearbyUsers);
    }
  });

  useEffect(() => {

    async function getNearby() {
      
      const { status } = await Location.requestPermissionsAsync();

      if(status == "granted" && await Location.hasServicesEnabledAsync()) {

        const location = await Location.getCurrentPositionAsync();

        setUserLat(location.coords.latitude);
        setUserLong(location.coords.longitude);
        
        getNearbyUsers({
          variables: {
            current_lat: userLat,
            current_long: userLong,
            max_distance: 500
          }
        });
      }
    }

    getNearby();
  }, [userLat, userLong]);

  const renderHeader = () => {
    return (
      <View style={{position: "absolute", left: 15, right: 15, top: 15}}>
        <View style={{flexDirection: "row"}}>
          <CustomTextField onChangeText={(e) => setQuery(e)} style={{flex: 1}}>
            { t("screens.search.labels.search") }
          </CustomTextField>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{paddingLeft: 15, paddingRight: 15}}>
        <ListUser user={item} navigation={props.navigation} />
      </View>
    );
  };

  const renderSeparator = () => {
    return (
      <View style={{height: 2, backgroundColor: "#404040", marginLeft: 15, marginRight: 15}} />
    );
  };

  return (
    <>
      <View style={{marginTop: 90}}>
        { searchLoading &&
          <ActivityIndicator color="white" size={40} />
        }
        { !searchLoading && results.length == 0 &&
          <NoResults />
        }
        <FlatList
          data={results}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={(item) => item._id}
        />
      </View>
      {
        renderHeader()
      }
    </>
  );
}