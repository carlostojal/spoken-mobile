import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({

  container: {
    margin: 4,
    borderColor: "#c7c7c7",
    borderWidth: 1,
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
    fontSize: 15
  },

  time_options: {
    flexDirection: "row"
  },

  content: {
    padding: 15,
    paddingTop: 0,
    fontSize: 20
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
  }
});