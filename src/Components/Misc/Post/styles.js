import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({

  container: {
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 20,
    overflow: "hidden"
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },

  username: {
    fontFamily: "Raleway_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
    marginBottom: 3
  },

  name: {
    fontSize: 14,
    color: "#B4B4B4"
  },

  time_options: {
    flexDirection: "row"
  },

  time: {
    fontSize: 15,
    color: "#ACACAC"
  },

  content: {
    padding: 15,
    paddingTop: 0,
    fontSize: 20,
    color: "#DDDDDD"
  },

  loading_image: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width,
    backgroundColor: "gray",
    flex: 1,
    alignItems: "center",
    alignContent: "center"
  },

  footer: {
    height: 45,
    flexDirection: "row",
    padding: 15,
    paddingTop: 0,
    justifyContent: "flex-end"
  },

  footer_icon: {
    marginRight: 10
  },

  options_option: {
    fontFamily: "Raleway_700Bold",
    padding: 15,
    fontSize: 17
  }
});