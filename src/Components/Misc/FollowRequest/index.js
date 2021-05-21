import React, { useEffect } from "react";
import { View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

import CustomText from "../CustomText";
import CustomButtom from "../CustomButton";
import styles from "./styles";
import queries from "./queries";
import colors from "../../../colors";

export default function FollowRequest({ user }) {

  const { t } = useTranslation();

  const [acceptRequest, {data: acceptData, loading: acceptLoading, error: acceptError}] = useMutation(queries.ACCEPT_REQUEST, {
    variables: {
      user_id: user._id
    }
  });

  const [ignoreRequest, {data: ignoreData, loading: ignoreLoading, error: ignoreError}] = useMutation(queries.IGNORE_REQUEST, {
    variables: {
      user_id: user._id
    }
  });

  const onAccept = () => {
    acceptRequest();
  };

  const onIgnore = () => {
    ignoreRequest();
  };

  useEffect(() => {
    if(acceptError)
      Alert.alert(acceptError.message);
  }, [acceptError]);

  useEffect(() => {
    if(ignoreError)
      Alert.alert(ignoreError.message);
  }, [ignoreError]);

  return (
    <View style={styles.container}>
      <CustomText style={styles.username}>
        { user.username }
      </CustomText>
      <CustomText style={styles.name}>
        { user.name + " " + user.surname }
      </CustomText>
      <View style={{flex: 1, flexDirection: "row"}}>
        <CustomButtom onPress={() => onAccept(user.id)}>
          { t("screens.follow_requests.labels.accept") }
        </CustomButtom>
        <CustomButtom onPress={() => onIgnore(user.id)}style={{backgroundColor: colors.secondary, marginLeft: 10}} textStyle={{color: "black"}}>
          { t("screens.follow_requests.labels.ignore") }
        </CustomButtom>
      </View>
    </View>
  );
} 