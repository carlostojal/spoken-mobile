import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },

  part1: {
    flex: 1,
    flexDirection: "row"
  },

  username: {
    fontWeight: "bold",
    marginRight: 10
  },

  content: {
    flex: 1
  }
});