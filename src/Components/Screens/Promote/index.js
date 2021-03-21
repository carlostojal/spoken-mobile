import React, {useEffect} from "react";
import { View, Linking, ScrollView, Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import Header from "../../Misc/Header";
import CustomText from "../../Misc/CustomText";
import CustomButton from "../../Misc/CustomButton";

import queries from "./queries";

export default function Promote(props) {

  const { t } = useTranslation();

  const [promotePost, { data: promoteData, loading: promoteLoading, error: promoteError }] = useMutation(queries.PROMOTE_POST, {
    variables: {
      id: parseInt(props.route.params.post_id)
    }
  });

  useEffect(() => {
    if(promoteData && promoteData.promotePost)
      Linking.openURL(promoteData.promotePost)
  }, [promoteData]);

  useEffect(() => {
    if(promoteError)
      Alert.alert("Promote error", promoteError.message);
  }, [promoteError]);

  return (
    <ScrollView>
      <Header>
        { t("screens.promote.title") }
      </Header>
      <View style={{padding: 15}}>
        <CustomText style={{marginBottom: 20}}>
          { t("screens.promote.description") }
        </CustomText>
        <CustomButton loading={promoteLoading} onPress={() => promotePost()}>
          { t("screens.promote.labels.confirm") }
        </CustomButton>
      </View>
    </ScrollView>
  );
}