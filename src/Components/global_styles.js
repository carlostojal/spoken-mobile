import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: Platform.OS == "android" ? 25 : 10,
    fontFamily: "Inter_900Black",
  }
})