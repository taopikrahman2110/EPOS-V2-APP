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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderTitle from "../../components/headerTitle/index";
import LoadingScreen from "../../components/LoadingScreen";
import { getPageLang } from "../../languages";
import globalStyles from "../global.style";
import styles from "./style";
import { serverurl, develbase, webserviceurl } from "../../config";

class ResetPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("forgotpass");
    this.globallang = getPageLang("global");

    this.state = {
      title: "Lupa Password",
      canGoBack: true,
      canChangeCommunity: false,
      phonenumber: "",
      otp: "",
      showLoading: false,
      isLoading: false,
      email: "",
    };
    //this.webview = React.createRef();
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentWillMount = (props) => {};

  componentDidMount = (props) => {
    this.generateOTP();

    console.log(this.state.otp);
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.replace("Login");
    return true;
  };

  goBack() {
    this.props.navigation.goBack();
  }

  changeCommunity(community) {
    global.community = community;
  }

  //----receive on message from webview
  receivePost(param) {}
  //------------------------------------

  refreshPage = () => {
    this.props.navigation.replace("Login");
  };

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  generateOTP = () => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    return OTP;
  };

  checkEmail = () => {
    if (this.state.email === "") {
      Alert.alert(
        "Warning",
        "Silahkan masukkan email Anda yang sudah terdaftar!",
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

    let params = {
      email: this.state.email.replace(/\s/g, ""),
    };

    console.log(params);

    this.setState({ showLoading: true });
    fetch(serverurl + webserviceurl + "/email_validation.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        // if (response.status === 200) return response.json();
        // else throw new Error('Something wrong with api server');
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
          this.doResetAkun();
        } else {
          Alert.alert(
            "Warning",
            "Email yang Anda masukan tidak terdaftar.",
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

  doResetAkun = () => {
    let params = {
      email: this.state.email,
      phonenumber: this.state.phonenumber,
      otp: this.state.otp,
    };

    console.log(params);
    this.setState({ showLoading: true });
    fetch(serverurl + webserviceurl + "/send_email.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something wrong with api server");
        }
      })
      .then((response) => {
        this.setState({ showLoading: false });
        console.log(response);
        this._storeData("user-phonenumber", JSON.stringify(params));
        this.props.navigation.replace("CodeOTP");
      })
      .catch((error) => {
        this.setState({ showLoading: false });
        console.log(error);
      });
  };

  checkPhonenumber = () => {
    if (this.state.phonenumber === "") {
      Alert.alert(
        "Warning",
        "Please enter your phone number!",
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

    // let params = {
    //   phonenumber: this.state.phonenumber,
    // };

    console.log(params);

    this.setState({ showLoading: true });

    let params = {
      email: this.state.phonenumber,
    };
    console.log(params);
    this.setState({ showLoading: true });
    fetch(serverurl + webserviceurl + "/app_email_validation.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
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
          // this.doCheckUserForgot();
          this.doReset();
        } else {
          Alert.alert(
            "Informasi",
            "Mohon maaf Email anda tidak terdaftar",
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

    /* fetch(
      serverurl + webserviceurl + '/app_phonenumber_validation.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: JSON.stringify(params),
      },
    )
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        Alert.alert(
          'Error',
          'Something wrong with api server',
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
      }
    })
    .then(response => {
      this.setState({showLoading: false});
      console.log(response);
      if (response.status === 'OK') {
        this.doCheckUserForgot();
      } else {
        Alert.alert(
          'Warning',
          'Your phone number has not been registered',
          [
            {
              text: this.globallang.ok,
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
      }
    })
    .catch(error => {
      this.setState({showLoading: false});
      Alert.alert(
        'Error',
        'unable to connect, check your internet connection.',
        [
          {
            text: this.globallang.ok,
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );
      console.log(error);
    }); */
  };

  doCheckUserForgot = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var date_create =
      year + "-" + month + "-" + date + " " + hours + ":" + min + ":" + sec;
    var date_forgot = year + "-" + month + "-" + date;

    let params = {
      phonenumber: this.state.phonenumber,
      dateForgot: date_forgot,
      dateCreate: date_create,
    };

    console.log(params);

    this.setState({ showLoading: true });
    fetch(serverurl + webserviceurl + "/app_phonenumber_forgot.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
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
          Alert.alert(
            "Warning",
            "You can only get a verification code once a day, if you want to get a verification code, you can ask for it the next day.",
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        } else {
          this.doReset();
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

  doReset = () => {
    var digits = "0123456789";
    var OTP = "";
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    console.log(OTP);

    let params = {
      email: this.state.phonenumber,
      otp: OTP,
    };

    let params2 = {
      phonenumber: this.state.phonenumber,
      otp: OTP,
    };

    this._storeData("user-register", JSON.stringify(params));
    console.log(params);

    this.setState({ showLoading: true });

    fetch(serverurl + webserviceurl + "/email_otp.php", {
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

        this._storeData("user-phonenumber", JSON.stringify(params2));
        this.props.navigation.replace("CodeOTP");
      })
      .catch((error) => {
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
        this.setState({
          showLoadingOTP: false,
        });
        console.log(error);
      });

    // fetch(serverurl + global.webserviceurl + '/sms_otp.php', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //   },
    //   body: JSON.stringify(params),
    // })
    // .then(response => {
    //   if (response.status === 200) {return response.json();}
    //   else {throw new Error('Something wrong with api server');}
    // })
    // .then(response => {
    //   this.setState({showLoading: false});
    //   console.log(response);
    //   this._storeData('user-phonenumber', JSON.stringify(params));
    //   this.props.navigation.replace('CodeOTP');
    // })
    // .catch(error => {
    //   this.setState({showLoading: false});
    //   console.log(error);
    // });
  };

  canBeSubmitted() {
    const { phonenumber } = this.state;
    return phonenumber.length > 0;
  }

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
            Kirim
          </Text>
        </View>
      );
    }
  };

  render() {
    const isEnabled = this.canBeSubmitted();
    return (
      <View style={globalStyles.screenContainer}>
        <ImageBackground
          source={require("../../assets/images/brankas/brankas-12.png")}
          style={styles.pictureContainer}
        >
          <HeaderTitle
            param={{
              title: this.state.title,
              canGoBack: this.state.canGoBack,
              canChangeCommunity: this.state.canChangeCommunity,
              showPointerIcon: false,
            }}
            change={this.changeCommunity.bind(this)}
            back={this.goBack.bind(this)}
          />
          <ScrollView
            style={{
              flex: 1,
              position: "absolute",
              top: 50,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View style={styles.formContainer}>
              <Text
                style={{
                  alignSelf: "center",
                  marginTop: 5,
                  marginBottom: 20,
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#000",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                Masukkan email anda yang digunakan saat pendaftaran. Kode
                Verifikasi akan dikirim ke email anda.
              </Text>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer1}>
                <Image
                  style={styles.inputIcon}
                  source={require("../../assets/images/email.png")}
                />
                <TextInput
                  style={styles.inputs}
                  placeholder={"Masukkan Email"}
                  placeholderTextColor="#000"
                  autoFocus={false}
                  // maxLength={13}
                  // keyboardType="email"
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({ email: text })}
                />
              </View>
              <View>
                <TouchableOpacity onPress={() => this.checkEmail()}>
                  {this.renderButton()}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

export default ResetPasswordScreen;
