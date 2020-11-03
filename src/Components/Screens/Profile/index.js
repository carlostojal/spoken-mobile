import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import CustomText from "../../Misc/CustomText";

export default function Profile(props) {

  const { t } = useTranslation();

  return (
    <ScrollView>
      <CustomText>
        { props.user.username }
      </CustomText>
      <CustomText>
        { `${props.user.name} ${props.user.surname}` }
      </CustomText>
    </ScrollView>
  );
}