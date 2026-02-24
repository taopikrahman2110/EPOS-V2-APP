/* eslint-disable prettier/prettier */
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  viewContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    flex: 1,
    backgroundColor: "rgba(27,69,137,.5)",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    padding: 0,
    margin: 0,
    elevation: 10,
  },
  pickerContainer: {
    maxHeight: height - 200,
    minHeight: 150,
    width: width - 50,
    padding: 10,
    backgroundColor: "rgba(27,69,137,1)",
    borderRadius: 10,
  },
  scrollContainer: {
    backgroundColor: "#ffffff",
    marginBottom: 10,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemContainerTop: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
    borderTopWidth: 1,
    borderTopColor: "#d9d9d9",
  },
  itemContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
  },
  itemText: {
    fontSize: 18,
  },
  itemTextSelected: {
    fontSize: 18,
    color: "#3399ff",
  },
  cancelContainer: {
    width: width - 70,
    height: 40,
    backgroundColor: "#255a8e",
    borderRadius: 10,
  },
});
export default styles;
