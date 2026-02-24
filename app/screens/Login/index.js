import React from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serverurl, webserviceurl } from "../../config";
import LoadingScreen from "../../components/LoadingScreen";
import PrepareQuit from "../../components/prepareQuit/index";
import { getPageLang } from "../../languages";
import globalStyles from "../global.style";
import styles from "./style";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("login");
    this.globallang = getPageLang("global");
    global.community = { code: "", text: "" };

    this.state = {
      title: this.pagelang.title,
      canGoBack: false,
      webUri: "",
      canChangeCommunity: false,
      communityList: [],
      phonenumber: "",
      password: "",
      prepareQuit: false,
      hidePassword: true,
      showLoading: false,
      currentTab: 0,
      employeeId: "",
    };

    this.color = {
      red: "#cc0000",
      green: "#39e600",
      orange: "#ffcc00",
      blue: "#6680ff",
      black: "#000",
      gray: "#CCCCCC",
    };
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentDidMount() {
    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        this.props.navigation.replace("ProfilePage");
      }
    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.replace("Home");
    return true;
  };

  goBack() {
    this.props.navigation.goBack();
  }

  cancelQuit = () => {
    this.setState({ prepareQuit: false });
  };

  changeCommunity(community) {}

  goToRegister = () => {
    this.props.navigation.navigate("Register");
  };

  goSetPass = () => {
    this.props.navigation.navigate("ResetPass");
  };

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  canBeSubmitted() {
    const { phonenumber, password } = this.state;
    return phonenumber.length > 0 && password.length > 0;
  }

  doLogin = () => {
    if (this.state.phonenumber === "") {
      Alert.alert(
        "Informasi",
        "Silakan masukkan username Anda!",
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
    if (this.state.password === "") {
      Alert.alert(
        "Informasi",
        "Silakan masukkan password Anda!",
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

    this.setState({ showLoading: true });

    fetch(serverurl + webserviceurl + "/app_login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify({
        username: this.state.phonenumber,
        password: this.state.password,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            "Error",
            "Terjadi kesalahan dalam jaringan",
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
        console.log(response);
        this.setState({ showLoading: false });
        if (response.status === "OK") {
          if (response.records.length === 0) {
            Alert.alert(
              "Peringatan",
              "Nomor telepon atau kata sandi tidak valid",
              [
                {
                  text: this.globallang.ok,
                  onPress: () => console.log("OK Pressed"),
                },
              ],
              { cancelable: false }
            );
          } else {
            this._storeData(
              "smart-app-id-login",
              JSON.stringify(response.records[0])
            );
            AsyncStorage.setItem(
              "PlatformDevice",
              Platform.OS === "ios" ? '"ios"' : '"android"'
            ).then(() => {});
            // this.updatePlatform(Platform.OS);
            this.props.navigation.replace("Home");
          }
        } else {
          //error
          Alert.alert(
            this.globallang.alert,
            response.message,
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

  updatePlatform = (platform) => {
    let params = {
      phonenumber: this.state.phonenumber,
      platform:
        platform === "android" ? "ANDROID" : platform === "ios" ? "iOS" : "",
    };

    console.log(params);

    fetch(serverurl + webserviceurl + "/update_platform_os.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        } else {
          Alert.alert(
            "Error",
            "Terjadi kesalahan dalam jaringan",
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
        // console.log(error);
      });
  };

  refreshPage = () => {
    this.props.navigation.replace("Login");
  };

  renderPrepareQuit = () => {
    if (this.state.prepareQuit) {
      return (
        <PrepareQuit
          started={this.state.prepareQuit}
          cancel={this.cancelQuit}
        />
      );
    }
  };

  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen />;
    }
  };

  renderButton = () => {
    if (this.state.showLoading === true) {
      return (
        <View
          style={{
            backgroundColor: "#255a8e",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            height: 50,
            borderRadius: 25,
          }}
        >
          <ActivityIndicator
            animating={this.state.showLoading}
            size="large"
            color="#fff"
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: "#255a8e",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            height: 50,
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            MASUK
          </Text>
        </View>
      );
    }
  };

  changeTab = (idx) => {
    if (this.state.currentTab !== idx) {
      this.setState({ currentTab: idx });
    }
  };

  renderBody = () => {
    if (this.state.currentTab === 0) {
      return (
        <>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ color: "#000", fontWeight: "600" }}>
              Masukkan username anda
            </Text>
          </View>
          <View style={styles.inputContainer1}>
            <Image
              style={styles.inputIcon}
              source={require("../../assets/images/brankas/brankas-06.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="username..."
              placeholderTextColor="#999999"
              autoFocus={false}
              keyboardType="default"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              maxLength={15}
              onChangeText={(text) => this.setState({ phonenumber: text })}
            />
          </View>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ color: "#000", fontWeight: "600" }}>
              Masukkan password anda
            </Text>
          </View>
          <View style={styles.inputContainer1}>
            <Image
              style={styles.inputIcon}
              source={require("../../assets/images/brankas/brankas-07.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="************"
              placeholderTextColor="#999999"
              autoFocus={false}
              secureTextEntry={this.state.hidePassword}
              keyboardType="default"
              maxLength={30}
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ password: text })}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.visibilityBtn}
              onPress={this.managePasswordVisibility}
            >
              <Image
                source={
                  this.state.hidePassword
                    ? require("../../assets/images/eye.png")
                    : require("../../assets/images/view.png")
                }
                style={styles.btnImage}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={() => this.doLogin()}>
              {this.renderButton()}
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            {/* <View style={{ flex: 1, flexDirection: "column" }}>
              <TouchableOpacity onPress={() => this.goSetPass()}>
                <View
                  style={{
                    justifyContent: "flex-start",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      paddingTop: 6,
                      fontWeight: "bold",
                      color: "#255a8e",
                    }}
                  >
                    Lupa Password?
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: "column" }}>
              <TouchableOpacity onPress={() => this.goToRegister()}>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      paddingTop: 6,
                      fontWeight: "bold",
                      color: "#255a8e",
                    }}
                  >
                    Registrasi?
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </View>
        </>
      );
    }
  };

  render() {
    return (
      <View style={globalStyles.screenContainer}>
        <ImageBackground
          source={require("../../assets/images/brankas/brankas-04.png")}
          style={styles.pictureContainer}
        >
          <ScrollView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <View style={styles.formContainer}>
              <Image
                source={require("../../assets/images/icon-app.png")}
                style={{
                  alignSelf: "center",
                  marginTop: 30,
                  width: 160,
                  height: 160,
                  marginBottom: 10,
                }}
              />

              {this.renderBody()}
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

export default LoginScreen;
