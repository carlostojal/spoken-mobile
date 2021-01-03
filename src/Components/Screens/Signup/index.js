import React, { useState, useEffect } from "react";
import { View, ScrollView, Picker, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@apollo/client";

import Header from "../../Misc/Header";
import CustomTextField from "../../Misc/CustomTextField";
import CustomText from "../../Misc/CustomText";
import CustomButton from "../../Misc/CustomButton";
import colors from "../../../colors";
import queries from "./queries";

export default function Signup(props) {

  const { t } = useTranslation();

  const [userSelectedDate, setUserSelectedDate] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [birthdate, setBirthdate] = useState(new Date());
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [profileType, setProfileType] = useState("personal");
  const [profilePrivacyType, setProfilePrivacyType] = useState("public");

  const [onSignup, {loading: signupLoading, error: signupError, data: signupData}] = useMutation(queries.REGISTER_USER);

  useEffect(() => {
    if(signupError) {
      Vibration.vibrate(100);

      let details;
      switch(signupError.message) {
        case "INVALID_BIRTHDATE":
          details = t("errors.invalid_birthdate");
          break;
        case "WEAK_PASSWORD":
          details = t("errors.weak_password");
          break;
        case "DUPLICATE_USERNAME_OR_EMAIL":
          details = t("errors.duplicate_username_or_email");
          break;
        default:
          details = t("errors.unexpected") + "\n\n" + signupError.message;
          break;
      }

      Alert.alert(t("strings.error"), details);
    }
  }, [signupError]);

  useEffect(() => {
    if(signupData) {
      Alert.alert(t("strings.success"), t("screens.signup.labels.success"));
      props.navigation.goBack();
    }
  }, [signupData]);

  const onBirthdatePick = () => {
    setShowDatePicker(true);
  };

  const onBirthdateChange = (e, selectedDate) => {
    setShowDatePicker(false);
    setBirthdate(selectedDate || birthdate);
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

  const onSignupClick = () => {

    if(!userSelectedDate || !name || !surname || !email || !username || !password || profileType == "default" || profilePrivacyType == "default") {
      Alert.alert(t("strings.error"), t("errors.empty_fields"));
    } else {

      onSignup({variables: {
        username,
        password,
        name,
        surname,
        birthdate: birthdate.getTime().toString(),
        email,
        profile_type: profileType,
        profile_privacy_type: profilePrivacyType
      }});
    }
  };

  const onBack = () => {
    props.navigation.goBack();
  };


  return (
    <View>
      <ScrollView>
        <View style={{padding: 15}}>
          <Header subtitle={t("screens.signup.subtitle")}>
            { t("screens.signup.title") }
          </Header>
          <CustomTextField
            style={{marginBottom: 10}}
            onChangeText={(e) => setName(e)}
          >
            { t("screens.signup.labels.name") }
          </CustomTextField>
          <CustomTextField
            style={{marginBottom: 10}}
            onChangeText={(e) => setSurname(e)}
          >
            { t("screens.signup.labels.surname") }
          </CustomTextField>
          <CustomButton
            style={{ backgroundColor: colors.card, marginBottom: 10 }}
            onPress={onBirthdatePick}
          >
            {
              t("screens.signup.labels.birthdate")
            }
            { userSelectedDate &&
              `: ${birthdate.getDate()}/${birthdate.getMonth() + 1}/${birthdate.getFullYear()}`
            }
          </CustomButton>
          { showDatePicker &&
            <DateTimePicker
              value={birthdate}
              mode="date"
              onChange={onBirthdateChange}
            />
          }
          <CustomTextField
            autoCompleteType="email"
            keyboardType="email-address"
            style={{marginBottom: 10}}
            onChangeText={(e) => setEmail(e)}
          >
            { t("screens.signup.labels.email") }
          </CustomTextField>
          <CustomTextField
            style={{marginBottom: 10}}
            onChangeText={(e) => setUsername(e)}
          >
            { t("screens.signup.labels.username") }
          </CustomTextField>
          <CustomTextField
            secureTextEntry={true}
            keyboardType="password"
            style={{marginBottom: 10}}
            onChangeText={(e) => setPassword(e)}
          >
            { t("screens.signup.labels.password") }
          </CustomTextField>
          {/*
            <>
            <Picker
              style={{color: colors.text, fontFamily: "Raleway_400Regular", marginBottom: 10}}
              onValueChange={onProfileTypeChange}
              selectedValue={profileType}
              mode="dropdown"
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
                  mode="dropdown"
                >
                  <Picker.Item label={t("screens.signup.labels.profile_privacy_type")} value="default"/>
                  <Picker.Item label={t("screens.signup.labels.public")} value="public" />
                  <Picker.Item label={t("screens.signup.labels.private")} value="private" />
                </Picker>
              </>
            }
            { profileType == "business" &&
              <CustomText style={{marginBottom: 10}}>
                { t("screens.signup.labels.business_always_public") }
              </CustomText>
            }
            { profilePrivacyType != "default" &&
              <CustomText style={{marginBottom: 10}}>
                {t(`screens.signup.labels.${profilePrivacyType}_description`)}
              </CustomText>
            }
            </>
          */}
          <CustomButton 
            style={{marginBottom: 5}}
            onPress={onSignupClick}
            loading={signupLoading}
            loadingColor="black"
          >
            {t("screens.signup.labels.signup")}
          </CustomButton>
          <CustomButton
            style={{backgroundColor: colors.secondary}}
            textStyle={{color: "black"}}
            onPress={onBack}
          >
            {t("screens.signup.labels.return_to_login")}
          </CustomButton>
        </View>
      </ScrollView>
    </View>
  );
}
