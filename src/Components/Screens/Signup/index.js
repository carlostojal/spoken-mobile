import React, { useState } from "react";
import { View, ScrollView, Picker } from "react-native";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";

import Header from "../../Misc/Header";
import CustomTextField from "../../Misc/CustomTextField";
import CustomButton from "../../Misc/CustomButton";
import colors from "../../../colors";
import CustomText from "../../Misc/CustomText";

export default function Signup() {

  const { t } = useTranslation();

  const [userSelectedDate, setUserSelectedDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [profileType, setProfileType] = useState("default");
  const [profilePrivacyType, setProfilePrivacyType] = useState("default");

  const onBirthdatePick = () => {
    setShowDatePicker(true);
  };

  const onBirthdateChange = (e, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate || date);
    setUserSelectedDate(true)
  };

  const onProfileTypeChange = (value, position) => {
    if(value != "default") {
      setProfileType(value);
      if(value == "business")
        setProfilePrivacyType("public");
    }
  };

  const onProfilePrivacyTypeChange = (value, position) => {
    if(value != "default")
      setProfilePrivacyType(value);
  };

  return (
    <View>
      <ScrollView>
        <View style={{padding: 15}}>
          <Header>
            { t("screens.signup.title") }
          </Header>
          <CustomTextField style={{marginBottom: 10}}>
            { t("screens.signup.labels.name") }
          </CustomTextField>
          <CustomTextField style={{marginBottom: 10}}>
            { t("screens.signup.labels.surname") }
          </CustomTextField>
          <CustomButton style={{ backgroundColor: colors.card, marginBottom: 10 }} onPress={onBirthdatePick}>
            {
              t("screens.signup.labels.birthdate")
            }
            { userSelectedDate &&
              `: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            }
          </CustomButton>
          { showDatePicker &&
            <DateTimePicker
              value={date}
              mode="date"
              onChange={onBirthdateChange}
            />
          }
          <CustomTextField
            autoCompleteType="email"
            keyboardType="email-address"
            style={{marginBottom: 10}}
          >
            { t("screens.signup.labels.email") }
          </CustomTextField>
          <CustomTextField style={{marginBottom: 10}}>
            { t("screens.signup.labels.username") }
          </CustomTextField>
          <CustomTextField
            secureTextEntry={true}
            keyboardType="visible-password"
            style={{marginBottom: 10}}
          >
            { t("screens.signup.labels.password") }
          </CustomTextField>
          <Picker
            style={{color: colors.text, fontFamily: "Raleway_400Regular", marginBottom: 10}}
            onValueChange={onProfileTypeChange}
            selectedValue={profileType}
          >
            <Picker.Item label={t("screens.signup.labels.profile_type")} value="default" />
            <Picker.Item label={t("screens.signup.labels.personal")} value="personal" />
            <Picker.Item label={t("screens.signup.labels.business")} value="business" />
          </Picker>
          { profileType == "personal" &&
            <>
              <Picker
              style={{color: colors.text, fontFamily: "Raleway_400Regular", marginBottom: 10}}
              onValueChange={onProfilePrivacyTypeChange}
              selectedValue={profilePrivacyType}
              >
                <Picker.Item label={t("screens.signup.labels.profile_privacy_type")} value="default"/>
                <Picker.Item label={t("screens.signup.labels.public")} value="public" />
                <Picker.Item label={t("screens.signup.labels.private")} value="private" />
              </Picker>
            </>
          }
          { profileType == "business" &&
            <CustomText>
              { t("screens.signup.labels.business_always_public") }
            </CustomText>
          }
          { profilePrivacyType != "default" &&
                <CustomText>
                  {t(`screens.signup.labels.${profilePrivacyType}_description`)}
                </CustomText>
              }
        </View>
      </ScrollView>
    </View>
  );
}
