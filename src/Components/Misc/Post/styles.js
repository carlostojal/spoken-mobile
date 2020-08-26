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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },

  username: {
    fontWeight: "bold"
  },

  time_options: {
    flexDirection: "row"
  },

  content: {
    padding: 15,
    paddingTop: 0,
    fontSize: 15
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
    height: 40,
    flexDirection: "row",
    padding: 15,
    paddingTop: 0,
    justifyContent: "flex-end"
  },

  footer_icon: {
    marginRight: 10
  }
});