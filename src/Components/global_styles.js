import { StyleSheet, Dimensions } from "react-native";
import Constants from "expo-constants";

export default StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    width: Dimensions.get("screen").width,
    backgroundColor: "white",
    padding: 20
  }
})