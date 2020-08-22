import { StyleSheet, Dimensions, Platform } from "react-native";
import Constants from "expo-constants";

export default StyleSheet.create({
  container: {
    marginTop: Platform.OS == "android" ? 10 : 0,
    width: Dimensions.get("screen").width
  }
})