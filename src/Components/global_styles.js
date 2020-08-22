import { StyleSheet, Dimensions, Platform } from "react-native";
import Constants from "expo-constants";

export default StyleSheet.create({
  container: {
    marginTop: Platform.OS == "android" ? 25 : 0,
    width: Dimensions.get("screen").width,
    backgroundColor: "white"
  }
})