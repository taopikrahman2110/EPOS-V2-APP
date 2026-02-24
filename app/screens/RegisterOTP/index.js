import React from "react";
import {
  Alert,
  BackHandler,
  ImageBackground,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountDown from "react-native-countdown-component";
import CodeInput from "../../components/ConfirmationCodeInput/ConfirmationCodeInput";
import HeaderTitle from "../../components/headerTitle/index";
import PrepareQuit from "../../components/prepareQuit/index";
import { getPageLang } from "../../languages";
import globalStyles from "../global.style";
import styles from "./style";
import { serverurl, webserviceurl } from "../../config";

class RegisterOTP extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("otp");
    this.globallang = getPageLang("global");

    this.state = {
      title: this.pagelang.title,
      canGoBack: true,
      webUri: "",
      canChangeCommunity: false,
      communityList: [],
      currentPage: 0,
      openModal: false,
      prepareQuit: false,
      isDateTimePickerVisible: false,
      fields: {},
      errors: {},
      code: "",
      email: "",
      phonenumber: "",
      phone: "",
      otp: "",
      newotp: "",
      name: "",
      issuspend: 0,
      statusownerid: "",
      phoneReqOwner: "",
      typeRequestOwner: "",
      multiRequestOwnerInfo: [],
      resendLimit: 0,
      waktu: 300,
      timerId: 0,
      seconds: 0,
      tabIndex: 0,
      newEmail: "",
      showLoading: false,
    };
  }

  goToHome = () => {
    this.props.navigation.navigate("Home");
  };

  _onFulfill(code) {
    // TODO: call API to check code here
    // If code does not match, clear input with: this.refs.codeInputRef1.clear()
    if (code === "Q234E") {
      Alert.alert("Verifikasi Kode", "Berhasil!", [{ text: "OK" }], {
        cancelable: false,
      });
    } else {
      Alert.alert("Confirmation Code", "Code not match!", [{ text: "OK" }], {
        cancelable: false,
      });

      this.refs.codeInputRef1.clear();
    }
  }

  _onFinishCheckingCode1(isValid) {
    console.log(isValid);
    if (!isValid) {
      Alert.alert("Verifikasi Kode", "Berhasil!", [{ text: "OK" }], {
        cancelable: false,
      });
    } else {
      Alert.alert("Confirmation Code", "Successful!", [{ text: "OK" }], {
        cancelable: false,
      });
    }
  }

  _onFinishCheckingCode2(isValid, code) {
    console.log(isValid);
    if (!isValid) {
      Alert.alert("Confirmation Code", "Code not match!", [{ text: "OK" }], {
        cancelable: false,
      });
    } else {
      this.setState({ code });
      Alert.alert("Verifikasi Kode", "Berhasil!", [{ text: "OK" }], {
        cancelable: false,
      });
      setTimeout(() => {
        let params = {
          phonenumber: this.state.phone,
          issuspend: 0,
        };
        console.log(params);
        fetch(serverurl + webserviceurl + "/registrasi_update.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: JSON.stringify({
            phonenumber: this.state.phone,
            issuspend: 0,
          }),
        })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              return response.json();
            } else {
              throw new Error("Something wrong with api server");
            }
          })
          .then((response) => {
            console.log(response);
            if (response.status === "OK") {
              Alert.alert(
                "Kode Konfirmasi",
                "Berhasil!",
                [
                  {
                    text: "OK",
                    onPress: () => this.props.navigation.replace("Login"),
                  },
                ],
                {
                  cancelable: false,
                }
              );
            } else {
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
            console.log(error);
          });
      }, 300);
    }
  }

  doValidateEmail = () => {
    if (this.state.newEmail === "") {
      Alert.alert(
        "Informasi",
        "Mohon untuk memasukkan alamat email terlebih dahulu",
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
    if (this.state.emailValid === false) {
      Alert.alert(
        "Informasi",
        "Format alamat email salah",
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
          Alert.alert(
            "Informasi",
            "Alamat email yang anda gunakan sudah terdaftar, mohon gunakan alamat email lain",
            [
              {
                text: this.globallang.ok,
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        } else {
          this.setState({
            tabIndex: this.state.tabIndex - 1,
            resendLimit: 0,
          });
          this.doUpdateEmailUser();
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

  doUpdateEmailUser = () => {
    let params = {
      new_email: this.state.newEmail,
      phoneno: this.state.phone,
    };
    console.log("doUpdateEmailUser", params);
    fetch(serverurl + webserviceurl + "/app_update_email_register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify({
        new_email: this.state.newEmail,
        phoneno: this.state.phone,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something wrong with api server");
        }
      })
      .then((response) => {
        console.log(response);
        if (response.status === "OK") {
          this.doNewOTP();
          // this.props.navigation.replace('Login');
        } else {
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
        console.log(error);
      });
  };

  doOTP = () => {
    this.setState((previousState) => ({
      timerId: ++previousState.timerId,
    }));

    var digits = "0123456789";
    var OTP = "";
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    console.log(OTP);

    let params = {
      phoneno: this.state.phone,
      email: this.state.email,
      otp: OTP,
    };

    this._storeData("user-register", JSON.stringify(params));
    console.log(params);

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
  };

  doNewOTP = () => {
    this.setState({
      timerId: 0,
    });

    var digits = "0123456789";
    var OTP = "";
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    this.setState({ otp: OTP });
    console.log(OTP);

    this.setState({
      email: this.state.newEmail,
    });

    let params = {
      phoneno: this.state.phone,
      email: this.state.newEmail,
      otp: OTP,
    };

    this._storeData("user-register", JSON.stringify(params));
    console.log(params);

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
          this.setState({
            newEmail: "",
          });
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
  };

  onDoneCountdown = () => {
    console.log(this.state.resendLimit);
    this.setState({
      resendLimit: this.state.resendLimit + 1,
    });
    if (this.state.resendLimit === 3 || this.state.resendLimit > 3) {
      Alert.alert(
        "Informasi",
        "Waktu habis, Kode verifikasi tidak diisi atau tidak valid, ganti alamat email?",
        [
          {
            text: "OK",
            // onPress: () => this.props.navigation.replace('Login'),
            onPress: () => this.setState({ tabIndex: this.state.tabIndex + 1 }),
          },
        ],
        { cancelable: false }
      );
    } else {
      // this.props.navigation.replace('RegisterOTP');
      // this.setState((previousState) => ({
      //   timerId: ++previousState.timerId,
      // }));
    }

    // setTimeout(() => {
    //   let params = {
    //     phonenumber: this.state.phonenumber,
    //     otp: this.state.newotp,
    //   };
    //   console.log(params);

    //   fetch(global.serverurl + global.webserviceurl + '/sms_otp.php', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //     },
    //     body: JSON.stringify(params),
    //   })
    //     .then((response) => {
    //       if (response.status === 200) return response.json();
    //       else throw new Error('Something wrong with api server');
    //     })
    //     .then((response) => {
    //       console.log(response);
    //       this._storeData('user-register', JSON.stringify(params));
    //       this.props.navigation.replace('RegisterOTP');
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }, 1000);
  };

  onPressCountdown = () => {
    Alert.alert("Countdown Component Press.");
  };

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentDidMount() {
    this.generateOTP();
    this._retrieveData("user-register").then((info) => {
      if (info !== null) {
        info = JSON.parse(info);
        this.setState({
          ...this.state,
          phone: info.phoneno,
          email: info.email,
          phonenumber: info.email,
          otp: info.otp,
          statusownerid: info.statusownerid,
          phoneReqOwner: info.phoneReqOwner,
          typeRequestOwner: info.typeRequestOwner,
          multiRequestOwnerInfo: info.multiRequestOwnerInfo,
        });
      } else {
        this.props.navigation.replace("Register");
      }
      console.log(info);
    });

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    Alert.alert(
      //title
      "Informasi",
      //body
      "Apakah Anda yakin ingin keluar tanpa memasukkan kode OTP? jika ya, Anda dapat menghubungi layanan pelanggan untuk menindaklanjuti akun pendaftaran Anda. Terima kasih.",
      [
        {
          text: "Ya",
          onPress: () => this.goLogin(),
        },
        {
          text: "Tidak",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  confirmation = () => {};

  goLogin = () => {
    this.props.navigation.replace("Login");
    return true;
  };

  goBack() {
    this.handleBackPress();
  }

  cancelQuit = () => {
    this.setState({ prepareQuit: false });
  };

  changeCommunity(community) {
    //not available in this page
  }

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

    this.setState({ newotp: OTP });
    return OTP;
  };

  // goBack() {
  //     //check if the page is on first page. do navigation back. if not, change page to idx before
  //     if(this.state.currentPage > 0){
  //         this.setState({currentPage: this.state.currentPage-1});
  //     }else
  //         this.props.navigation.goBack();
  // }

  refreshPage = () => {
    this.props.navigation.replace("Login");
    //let d = new Date();
    //this.setState({ webUri: global.serverurl + '/?page=mypage&community=' + global.community.code + '&t=' + d.getTime(), title: community.text, canGoBack: false, canChangeCommunity: true });
  };

  renderBody = () => {
    const { tabIndex } = this.state;
    if (tabIndex === 0) {
      return (
        <>
          <View style={styles.inputWrapper2}>
            <Text
              style={{
                alignSelf: "center",
                marginBottom: 2,
                fontSize: 18,
                fontWeight: "bold",
                color: "#000",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              Mohon masukkan kode verifikasi
            </Text>
            <Text
              style={{
                alignSelf: "center",
                marginTop: 2,
                marginBottom: 10,
                fontSize: 18,
                fontWeight: "bold",
                color: "#000",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              yang dikirimkan ke email Anda
            </Text>
            <CodeInput
              ref="codeInputRef1"
              keyboardType="numeric"
              codeLength={5}
              activeColor="#000"
              inactiveColor="#000"
              inputPosition="center"
              size={50}
              compareWithCode={this.state.otp}
              autoFocus={false}
              codeInputStyle={{ fontWeight: "800", borderWidth: 1.5 }}
              onFulfill={(isValid, code) =>
                this._onFinishCheckingCode2(isValid, code)
              }
              containerStyle={{ marginTop: 30, marginBottom: 30 }}
              onCodeChange={(code) => {
                this.state.code = code;
              }}
            />
            <CountDown
              id={this.state.timerId}
              until={this.state.waktu}
              onFinish={this.onDoneCountdown}
              onPress={this.onPressCountdown}
              size={15}
            />
          </View>
          {this.state.resendLimit !== 0 ? (
            <View>
              <TouchableOpacity onPress={() => this.doOTP()}>
                <View
                  style={{
                    justifyContent: "center",
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
                    Kirim Ulang Kode Verifikasi
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </>
      );
    } else {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer1}>
            <Image
              style={styles.inputIcon}
              source={require("../../assets/images/email.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Masukan alamat email"
              placeholderTextColor="#000"
              autoFocus={false}
              keyboardType="default"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              value={this.state.newEmail}
              onChangeText={(text) => this.validateEmail(text)}
            />
          </View>

          <View
            style={{ flexDirection: "row", marginTop: -16, marginBottom: 6 }}
          >
            {this.onErrorEmail()}
          </View>
          <View>
            <TouchableOpacity onPress={() => this.doValidateEmail()}>
              {this.renderButtonSubmit()}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  renderButtonSubmit = () => {
    if (this.state.showLoading === true) {
      return (
        <View style={styles.buttonstyle}>
          <ActivityIndicator
            animating={this.state.showLoading}
            size="large"
            color="#fff"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.buttonstyle}>
          <Text style={styles.buttontextstyle}>SUBMIT</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={globalStyles.screenContainer}>
        <ImageBackground
          source={require("../../assets/images/bg_form.png")}
          style={styles.pictureContainer}
        >
          <HeaderTitle
            param={{
              title: this.state.title,
              canGoBack: this.state.canGoBack,
              canChangeCommunity: this.state.canChangeCommunity,
              communityList: this.state.communityList,
              showPointerIcon: false,
            }}
            change={this.changeCommunity.bind(this)}
            back={this.goBack.bind(this)}
          />
          <ScrollView
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {this.renderBody()}
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

export default RegisterOTP;
