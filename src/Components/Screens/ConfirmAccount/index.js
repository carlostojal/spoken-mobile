import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation} from "@apollo/client";

import Header from "../../Misc/Header";
import CustomText from "../../Misc/CustomText";
import CustomTextField from "../../Misc/CustomTextField";
import CustomButton from "../../Misc/CustomButton";

import global_styles from "../../global_styles";
import colors from "../../../colors";

import queries from "./queries";

export default function ConfirmAccount(props) {

  const { t } = useTranslation();

  const [code, setCode] = useState(null);

  const [confirmAccount, { loading: confirmationLoading, data: confirmationData, error: confirmationError }] = useMutation(queries.CONFIRM_ACCOUNT);

  const [resendEmail, { loading: resendLoading, error: resendError }] = useLazyQuery(queries.RESEND_EMAIL, {
    fetchPolicy: "network-only"
  });

  const onConfirm = () => {
    confirmAccount({ variables: {username: props.route.params.username, code: parseInt(code)} });
  }

  const onResend = () => {
    resendEmail({ variables: { username: props.route.params.username, password: props.route.params.password } })
  }

  useEffect(() => {
    if(confirmationError) {

      let message;

      switch(confirmationError.message) {
        case "WRONG_CONFIRMATION_CODE":
          message = t("errors.wrong_confirmation_code");
          break;
        default:
          message = t("errors.unexpected");
      }
      Alert.alert(t("strings.error"), message);
    }
  }, [confirmationError]);

  useEffect(() => {
    if(resendError) {

      let message;

      switch(resendError.message) {
        case "ON_TIMEOUT":
          message = t("errors.confirmation_on_timeout");
          break;
        default: 
          message = t("errors.unexpected");
          break;
      }
      
      Alert.alert(t("strings.error"), message);
    }
  }, [resendError]);

  useEffect(() => {
    if(confirmationData && confirmationData.confirmAccount) {
      Alert.alert(t("strings.success"), t("screens.confirm_account.labels.success"))
      props.navigation.goBack();
    }
  }, [confirmationData]);

  return (
    <View style={global_styles.container}>
      <View style={{padding: 15}}>
        <Header>
          {t("screens.confirm_account.title")}
        </Header>
        <CustomText style={{color: "gray"}}>
          {t("screens.confirm_account.labels.instructions")}
        </CustomText>
        <View style={{height: 20}} />
        <CustomTextField onChangeText={(text) => setCode(text)}>
          {t("screens.confirm_account.labels.confirmation_code")}
        </CustomTextField>
        <View style={{height: 20}}/>
        <CustomButton onPress={onConfirm} loading={confirmationLoading}>
          {t("screens.confirm_account.labels.confirm_btn")}
        </CustomButton>
        <View style={{height: 5}} />
        <CustomButton onPress={onResend} style={{backgroundColor: colors.secondary}} textStyle={{color: "black"}} loading={resendLoading}>
          {t("screens.confirm_account.labels.resend_btn")}
        </CustomButton>
      </View>
    </View>
  );

}