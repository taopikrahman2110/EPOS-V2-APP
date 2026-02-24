import React from "react";
import {
  Alert,
  AsyncStorage,
  BackHandler,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import chevronLeft from "../../../assets/images/returnback.png";
import { getPageLang } from "../../../languages";
import globalStyles from "../../global.style";
import styles from "./style";

class EditUserTypeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("editnickname");
    this.globallang = getPageLang("global");
    this.state = {
      title: "Edit User Type",
      canGoBack: true,
      canChangeCommunity: false,
      phonenumber: "",
      name: "",
      nickname: "",
      gender: "",
      profilepic: "",
      dob: "",
      businessqrcode: "",
      company: "",
      location: "",
      email: "",
      onlycollagues: 0,
      join: "",
      showLoading: false,
      options: [],
      genderId: "",
      statusownerid: "",
      statusbinding: "",
      phonenumberOwner: "",
      formFields: [{ cluster: "", unit: "" }],
      cekUnit: [],
    };

    this.usertype = [
      { id: 1, text: "I'm the owner" },
      { id: 2, text: "I'm not owner" },
      { id: 3, text: "None of above" },
    ];
  }

  retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentWillMount = (props) => {
    this.retrieveData("smart-app-id-login").then((info) => {
      if (info === null) this.props.navigation.replace("Login");
    });
  };

  componentDidMount = (props) => {
    this.retrieveData("usertype").then((usertype) => {
      console.log(usertype);
      if (usertype !== null) {
        usertype = JSON.parse(usertype);
        this.setState({
          statusownerid: usertype.statusownerid,
          phonenumberOwner: usertype.phonenumberOwner,
          formFields: usertype.clusterInfo,
        });
      } else {
        this.retrieveData("smart-app-id-login").then((info) => {
          if (info !== null) {
            console.log(info);

            info = JSON.parse(info);
            this.setState({
              phonenumber: info.phonenumber,
              name: info.name,
              nickname: info.nickname,
              gender: info.gender,
              genderId: info.genderId,
              profilepic: info.profilepic,
              dob: info.dob,
              email: info.email,
              statusownerid: info.statusownerid,
              statusbinding: info.statusbinding,
              phonenumberOwner: info.phonenumberOwner,
            });
            if (info.clusterInfo.length === 0) {
              this.setState({
                formFields: [{ cluster: "", unit: "" }],
                cekUnit: [],
              });
            } else {
              this.setState({
                formFields: info.clusterInfo,
              });
            }
          }
        });
      }
    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  };

  handleBackPress = () => {
    this.goBack();
  };

  goBack = () => {
    this.props.navigation.replace("Profile");
  };

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  dovalidationPhone = () => {
    let params = {
      phonenumber: this.state.phonenumberOwner,
    };
    console.log(params);
    this.setState({ showLoading: true });
    fetch(
      global.serverurl +
        global.webserviceurl +
        "/app_phonenumber_validation.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: JSON.stringify(params),
      }
    )
      .then((response) => {
        this.setState({ showLoading: false });
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            "Error",
            "Something wrong with api server",
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .then((response) => {
        this.setState({ showLoading: false });
        console.log(response);
        if (response.status === "OK") {
          let param = {
            statusownerid: this.state.statusownerid,
            phonenumberOwner: this.state.phonenumberOwner,
            clusterInfo: this.state.formFields,
          };
          console.log(param);
          this.storeData("usertype", JSON.stringify(param));
          this.props.navigation.replace("Profile");
        } else {
          Alert.alert(
            "Warning",
            "The owner phone number hasn't registered",
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        Alert.alert(
          "Error",
          "unable to connect, check your internet connection.",
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
        console.log(error);
      });
  };

  doChangeUserType = () => {
    if (this.state.statusownerid === 0) {
      Alert.alert(
        "Warning",
        "Please choose your user type",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return false;
    }

    if (this.state.statusownerid === 2) {
      if (this.state.phonenumberOwner === "") {
        Alert.alert(
          "Warning",
          "Please fill owner phone number!",
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
        return false;
      } else if (this.state.phonenumber === this.state.phonenumberOwner) {
        Alert.alert(
          "Warning",
          "The owner phone number failed!",
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
        return false;
      }
    }

    if (this.state.statusownerid === 1) {
      if (
        -1 !==
        this.state.formFields.findIndex(
          (v) => v.cluster == null || v.cluster === ""
        )
      ) {
        Alert.alert(
          "Warning",
          "Please enter your cluster",
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
        return false;
      } else if (
        -1 !==
        this.state.formFields.findIndex((v) => v.unit == null || v.unit === "")
      ) {
        Alert.alert(
          "Warning",
          "Please enter your unit number",
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
        return false;
      }
    }

    if (
      -1 !==
      this.state.formFields.findIndex(
        (v) =>
          v.cluster == null ||
          v.cluster === "" ||
          v.unit == null ||
          v.unit === ""
      )
    ) {
      this.setState({
        formFields: [],
      });
    }

    if (this.state.statusownerid !== 2) {
      let param = {
        statusownerid: this.state.statusownerid,
        phonenumberOwner: this.state.phonenumberOwner,
        clusterInfo: this.state.formFields,
      };
      console.log(param);
      this.storeData("usertype", JSON.stringify(param));
      this.props.navigation.replace("Profile");
    } else {
      this.dovalidationPhone();
    }
  };

  addInput = () => {
    if (
      -1 !==
      this.state.formFields.findIndex(
        (v) => v.cluster == null || v.cluster === ""
      )
    ) {
      Alert.alert(
        "Warning",
        "Please enter your cluster",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (
      -1 !==
      this.state.formFields.findIndex((v) => v.unit == null || v.unit === "")
    ) {
      Alert.alert(
        "Warning",
        "Please enter your unit number",
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (
      -1 !==
      this.state.formFields.findIndex(
        (v) =>
          v.unit !== null ||
          v.unit !== "" ||
          v.cluster !== null ||
          v.cluster !== ""
      )
    ) {
      console.log(this.state.formFields);
      const existingFormFields = this.state.formFields.map((fields) => ({
        ...fields,
      }));
      const allFormFieldsAfterAddingNew = [
        ...existingFormFields,
        { cluster: "", unit: "" },
      ];
      console.log(allFormFieldsAfterAddingNew);
      this.setState({ formFields: allFormFieldsAfterAddingNew });
    }
  };

  onTextChange = (text, index) => {
    const existingFormFields = this.state.formFields.map((fields) => ({
      ...fields,
    }));
    let targetField = { ...existingFormFields[index] };
    targetField.cluster = text;
    existingFormFields[index] = targetField;

    this.setState({ formFields: existingFormFields });
  };

  onTextChangeUnit = (text, index) => {
    const existingFormFields = this.state.formFields.map((fields) => ({
      ...fields,
    }));
    let targetField = { ...existingFormFields[index] };
    targetField.unit = text;
    existingFormFields[index] = targetField;

    this.setState({ formFields: existingFormFields });
  };

  removeClusterUnit = () => {
    let data = this.state.formFields;
    console.log(data.splice(-1, 1));
    this.setState({
      formFields: data,
    });
  };

  ButtonRemove = () => {
    if (this.state.formFields.length > 1) {
      return (
        <TouchableOpacity onPress={() => this.removeClusterUnit()}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 30 / 2,
              backgroundColor: "#f00",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                justifyContent: "center",
                alignSelf: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              -
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  renderIfChooseNumber2 = () => {
    if (this.state.statusownerid === 2) {
      return (
        <View style={{ marginTop: -20, padding: 16 }}>
          <Text style={styles.label}>Owner phone number</Text>
          <View style={styles.inputContainer1}>
            <Image
              style={styles.inputIcon}
              source={require("../../../assets/images/smartphone.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Please fill owner phone number"
              placeholderTextColor="#000"
              autoFocus={false}
              maxLength={15}
              keyboardType="phone-pad"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              value={this.state.phonenumberOwner}
              onChangeText={(text) => this.setState({ phonenumberOwner: text })}
            />
          </View>
        </View>
      );
    } else if (this.state.statusownerid === 1) {
      return (
        <View style={{ marginTop: -20, padding: 16 }}>
          <View style={{ flex: 1 }}>
            {this.state.formFields.map((field, index) => {
              return (
                <View key={index}>
                  <Text style={styles.label}>Cluster</Text>
                  <View style={styles.inputContainer1}>
                    <Image
                      style={styles.inputIcon}
                      source={require("../../../assets/images/house.png")}
                    />
                    <TextInput
                      style={styles.inputs}
                      placeholder="Please enter your cluster"
                      placeholderTextColor="#000"
                      autoFocus={false}
                      keyboardType="default"
                      autoCapitalize="none"
                      underlineColorAndroid="transparent"
                      value={field.cluster}
                      onChangeText={(text) => this.onTextChange(text, index)}
                    />
                  </View>
                  <Text style={styles.label}>Unit Number</Text>
                  <View style={styles.inputContainer1}>
                    <Image
                      style={styles.inputIcon}
                      source={require("../../../assets/images/address.png")}
                    />
                    <TextInput
                      style={styles.inputs}
                      placeholder="Please enter your unit number"
                      placeholderTextColor="#000"
                      autoFocus={false}
                      keyboardType="default"
                      autoCapitalize="none"
                      underlineColorAndroid="transparent"
                      value={field.unit}
                      onChangeText={(text) =>
                        this.onTextChangeUnit(text, index)
                      }
                    />
                  </View>
                </View>
              );
            })}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              {this.ButtonRemove()}
              <TouchableOpacity onPress={() => this.addInput()}>
                <View
                  style={{
                    marginLeft: 10,
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: "#255a8e",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      fontSize: 25,
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  renderUserTypeID = () => {
    console.log(this.state.formFields);
    if (
      this.state.statusbinding === 1 &&
      this.state.statusownerid === 1 &&
      this.state.cekUnit.length === 0
    ) {
      return null;
    } else {
      return (
        <View>
          <View style={styles.buttonContainer}>
            <Text style={styles.label}>I'm not the owner</Text>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => {
                this.setState({
                  statusownerid: 2,
                  formFields: [{ cluster: "", unit: "" }],
                });
              }}
            >
              {this.state.statusownerid === 2 && (
                <View style={styles.checkedCircle} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.label}>None of above</Text>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => {
                this.setState({
                  statusownerid: 3,
                  phonenumberOwner: "",
                  formFields: [{ cluster: "", unit: "" }],
                });
              }}
            >
              {this.state.statusownerid === 3 && (
                <View style={styles.checkedCircle} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={globalStyles.screenContainer}>
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <View style={styles.headerTitle}>
            <View style={{ flex: 0, flexDirection: "column", paddingLeft: 14 }}>
              <TouchableOpacity onPress={() => this.handleBackPress()}>
                <View
                  style={{ justifyContent: "center", flexDirection: "row" }}
                >
                  <Image
                    style={{ height: 20, width: 20 }}
                    source={chevronLeft}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.textContentTitle}>
              <Text style={styles.fontTextTitle}>{this.state.title}</Text>
            </View>
            <View
              style={{ flex: 0, flexDirection: "column", paddingRight: 14 }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.doChangeUserType();
                }}
              >
                <View
                  style={{ justifyContent: "center", flexDirection: "row" }}
                >
                  <Text style={styles.determine}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.contentContainer}>
                <View style={styles.formRowContainer1}>
                  <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                      <Text>Please choose your new user type</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.formRowContainer2}>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.label}>I'm the owner</Text>
                    <TouchableOpacity
                      style={styles.circle}
                      onPress={() => {
                        this.setState({
                          statusownerid: 1,
                          phonenumberOwner: "",
                        });
                      }}
                    >
                      {this.state.statusownerid === 1 && (
                        <View style={styles.checkedCircle} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {this.renderUserTypeID()}
                </View>
              </View>
              {this.renderIfChooseNumber2()}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
export default EditUserTypeScreen;
