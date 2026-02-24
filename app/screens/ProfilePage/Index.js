import React from "react";
import { BackHandler, View, Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import Geolocation from "@react-native-community/geolocation";
import FooterMenu from "../../components/footerMenu/index";
import HeaderTitle from "../../components/headerTitle/index";
import PrepareQuit from "../../components/prepareQuit/index";
import { getPageLang } from "../../languages";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Share from "react-native-share";
import { serverurl, develbase, webserviceurl } from "../../config";
import RNFetchBlob from "react-native-blob-util";
import RNFS from "react-native-fs";
import DocumentPicker from "react-native-document-picker";
import LoadingScreen from "../../components/LoadingScreen";

class ProfileScreenPage extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("profile");
    global.community = { code: "", text: "" };

    this.state = {
      title: this.pagelang["title"],
      canGoBack: false,
      webUri:
        serverurl +
        develbase +
        "/?page=profile&community=" +
        global.community.code +
        "&t=" +
        new Date().getTime(),
      canChangeCommunity: false,
      hideTopbar: true,
      hideFooterMenu: false,
      prepareQuit: false,
      loginInfo: {},
      showLoading: false,
    };

    this.webview = null;
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentDidMount() {
    Geolocation.getCurrentPosition((info) => {
      this.doSendCoords(info);
    });
    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        this.setState({ loginInfo: JSON.parse(info) });
        console.log(info);
      } else {
        this.props.navigation.replace("Login");
      }
    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.state.canGoBack) {
      this.webview.goBack();
      return true;
    } else {
      this.props.navigation.replace("Home");
      return true;
    }
  };

  changeCommunity(community) {
    global.community = community;
  }

  goBack() {
    let d = new Date();
    //if (global.community.code == "jakartagardencity") {

    this.setState({
      webUri:
        serverurl +
        develbase +
        "/?page=profile&community=" +
        global.community.code +
        "&t=" +
        d.getTime(),
      title: this.pagelang.title,
      canGoBack: false,
      canChangeCommunity: false,
    });
  }

  receivePost(param) {
    console.log(param);
    let jsonParam = JSON.parse(param);

    if (jsonParam.code === undefined) {
      jsonParam.title = global.community.text;
      if (jsonParam.canChangeCommunity === undefined) {
        jsonParam.canChangeCommunity = true;
      }
      this.setState({
        title: jsonParam.title,
        canGoBack: jsonParam.canGoBack,
        canChangeCommunity: jsonParam.canChangeCommunity,
        hideTopbar: true,
        hideFooterMenu: jsonParam.hideFooterMenu,
      });
    } else {
      if (jsonParam.code === "need-open-camera-device") {
        this.openCamera();
      } else if (jsonParam.code === "need-open-galery-device") {
        this.openGallery();
      } else if (jsonParam.code === "need-update-profile") {
        this.updateProfile();
      } else if (jsonParam.code === "need-logout") {
        this.doLogout();
      } else if (jsonParam.code === "share-apps") {
        console.log("share-apps :" + jsonParam.data);
        let dt = jsonParam.data;
        this.shareApp(dt);
      } else if (jsonParam.code === "need-beranda") {
        this.props.navigation.replace("Home");
      } else if (jsonParam.code === "share-email") {
        console.log("share-email :" + jsonParam.data);
        let dt = jsonParam.data;
        this.shareEmail(dt);
      } else if (jsonParam.code === "need-home") {
        this.props.navigation.replace("AktivitasPage");
      } else if (jsonParam.code === "need-upload-foto-kondisi") {
        this.openCameraForPengaduan();
      } else if (jsonParam.code === "need-upload-foto-catat-meter") {
        this.openCameraForCatatMeter();
      } else if (jsonParam.code === "need-upload-foto-ktp") {
        this.openCameraForKTP();
      } else if (jsonParam.code === "need-upload-foto-npwp") {
        this.openCameraForNPWP();
      } else if (jsonParam.code === "need-titik-koordinat") {
        this.openGeolocation();
      } else if (jsonParam.code === "need-upload-foto-selfie") {
        this.openCameraForSelfie();
      } else if (jsonParam.code === "open-url-pdf-invoice") {
        Linking.canOpenURL(jsonParam.data)
          .then((supported) => {
            if (!supported) {
              //console.log('Can\'t handle url: ' + url);
              Alert.alert(
                "Alert",
                "Can not handle url : " + jsonParam.data,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } else {
              return Linking.openURL(jsonParam.data);
            }
          })
          .catch((err) => {
            Alert.alert(
              "Alert",
              "Error : " + err,
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            );
          });
      } else if (jsonParam.code === "download-materai") {
        this.downloadMaterai(jsonParam.data, jsonParam.serial);
      } else if (jsonParam.code === "need-open-dokument") {
        this.selectOneFile();
      }
    }
  }

  selectOneFile = async () => {
    console.log("upload file");
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res) {
        console.log(res);
        let uri = res[0].uri;
        if (Platform.OS === "ios") {
          uri = res.uri.replace("file://", "");
        }
        console.log("URI : " + uri);
        const fs = RNFetchBlob.fs;
        var data = await RNFS.readFile(uri, "base64").then((res) => {
          return res;
        });
        console.log(data);
        let params = {
          fileName: res[0].name,
          dataBase64: data,
          type: res[0].type,
        };
        this.sendMessage("take-file-dokumen", JSON.stringify(params));
      }
    } catch (err) {
      // Handling Exception
      if (DocumentPicker.isCancel(err)) {
        alert("Canceled");
      } else {
        // For Unknown Error
        alert("Unknown Error: " + JSON.stringify(err));
        throw err;
      }
    }
  };

  downloadMaterai = (data, serial) => {
    console.log(data);

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    let datetime = date + month + year + "_" + hours + +min + sec;
    const fs = RNFetchBlob.fs;
    const dirs = RNFetchBlob.fs.dirs;
    const file_path =
      RNFS.DownloadDirectoryPath + "/" + serial + "_" + datetime + ".png";

    RNFS.writeFile(file_path, data, "base64")
      .then(() => {
        console.log("Image converted to jpg and saved at " + file_path);

        this.sendMessage("take-status-download", JSON.stringify(file_path));
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };

  sendMessage = (code, param) => {
    if (param.constructor != "string".constructor) {
      param = JSON.stringify(param);
    }
    // console.log(param);

    if (this.webview) {
      //console.log('sent message : '+param);
      let tmp = this.webview.postMessage(
        '{"code":"' + code + '", "param":' + param + "}"
      );
      //if(code === 'logout'){
      //AsyncStorage.removeItem(global.appId+'-do-logout');
      //}
    } else {
      setTimeout(() => {
        this.sendMessage(code, param);
      }, 300);
    }
  };
  //------------------------------------

  doSendCoords = (info) => {
    console.log(info);
    this.sendMessage("take-titik-koordinat", JSON.stringify(info));
  };

  openGeolocation = () => {
    Geolocation.getCurrentPosition((info) => {
      this.doSendCoords(info);
    });
  };

  openCameraForPengaduan = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      mediaType: "photo",
    };
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.fileName);
        // let source = {uri: response.uri};

        // You can also display the image using data:
        let source = {
          uri: "data:image/jpeg;base64," + response.assets[0].base64,
        };
        let imageKondisiPengaduan = source.uri;
        this.sendMessage(
          "take-foto-kondisi",
          JSON.stringify(imageKondisiPengaduan)
        );
      }
    });
  };

  openCameraForCatatMeter = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      mediaType: "photo",
    };
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.fileName);
        // let source = {uri: response.uri};

        // You can also display the image using data:
        let source = {
          uri: "data:image/jpeg;base64," + response.assets[0].base64,
        };
        let imageCatatMeter = source.uri;
        this.sendMessage(
          "take-foto-catat-meter",
          JSON.stringify(imageCatatMeter)
        );
      }
    });
  };

  openCameraForSelfie = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      mediaType: "photo",
    };
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.fileName);
        // let source = {uri: response.uri};

        // You can also display the image using data:
        let source = {
          uri: "data:image/jpeg;base64," + response.assets[0].base64,
        };
        let imageCatatMeter = source.uri;
        this.sendMessage("take-foto-selfie", JSON.stringify(imageCatatMeter));
      }
    });
  };

  openCameraForKTP = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      mediaType: "photo",
    };
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.fileName);
        // let source = {uri: response.uri};

        // You can also display the image using data:
        let source = {
          uri: "data:image/jpeg;base64," + response.assets[0].base64,
        };
        let imageCatatMeter = source.uri;
        this.sendMessage("take-foto-ktp", JSON.stringify(imageCatatMeter));
      }
    });
  };

  openCameraForNPWP = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      mediaType: "photo",
    };
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.fileName);
        // let source = {uri: response.uri};

        // You can also display the image using data:
        let source = {
          uri: "data:image/jpeg;base64," + response.assets[0].base64,
        };
        let imageCatatMeter = source.uri;
        this.sendMessage("take-foto-npwp", JSON.stringify(imageCatatMeter));
      }
    });
  };

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  doLogout = () => {
    global.logininfo = undefined;
    AsyncStorage.removeItem("smart-app-id-login");
    AsyncStorage.setItem("smart-app-do-logout", "1");
    this.props.navigation.replace("Home");
  };

  shareApp = (obj) => {
    const options = {
      message: obj,
      title: "Share App eposapp",
      caption: "",
      contentDescription: "",
      quote: "",
    };

    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  shareEmail = (obj) => {
    // let urlEmail = JSON.parse(obj);
    console.log(obj);

    const options = {
      title: "Bantuan Email",
      email: obj,
      social: Share.Social.EMAIL,
      failOnCancel: false,
    };

    Share.shareSingle(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  updateProfile = () => {
    fetch(global.serverurl + global.webserviceurl + "/load_user_id.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify({
        userId: this.state.loginInfo.userId,
      }),
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
        if (response.status === "OK") {
          if (response.records.length === 0) {
            Alert.alert(
              "Warning",
              "Invalid phone number or password",
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

  openCamera = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      mediaType: "photo",
    };
    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.fileName);
        let source = {
          uri: "data:image/jpeg;base64," + response.assets[0].base64,
        };
        let imgProfile = source.uri;
        this.sendMessage("take-photo-profile", JSON.stringify(imgProfile));
      }
    });
  };

  openGallery = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      includeBase64: true,
      mediaType: "photo",
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.assets[0]);
        let source = {
          uri: "data:image/jpeg;base64," + response.assets[0].base64,
        };
        let imgProfile = source.uri;
        this.sendMessage("take-photo-profile", JSON.stringify(imgProfile));
      }
    });
  };

  refreshPage = () => {
    let d = new Date();
    this.setState({
      webUri:
        serverurl +
        develbase +
        "/?page=profile&community=" +
        global.community.code +
        "&t=" +
        d.getTime(),
      title: "profile",
      canGoBack: false,
      canChangeCommunity: true,
    });
  };

  renderHeader = () => {
    if (!this.state.hideTopbar) {
      return (
        <HeaderTitle
          param={{
            title: this.state.title,
            canGoBack: this.state.canGoBack,
            canChangeCommunity: this.state.canChangeCommunity,
            communityList: this.state.communityList,
          }}
          change={this.changeCommunity.bind(this)}
          back={this.goBack.bind(this)}
        />
      );
    }
  };

  renderFooter = () => {
    if (!this.state.hideFooterMenu) {
      return (
        <FooterMenu
          navigation={this.props.navigation}
          currentMenu={4}
          refreshPage={this.refreshPage}
        />
      );
    }
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

  onErrorWebview() {
    //alert('testing');
  }

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen />;
    }
  };

  render() {
    const injectedJavascript = `(function() {
      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })()`;

    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <View
          style={{
            position: "absolute",
            top: this.state.hideTopbar ? 0 : 50,
            left: 0,
            right: 0,
            bottom: this.state.hideFooterMenu ? 0 : 50,
          }}
        >
          <WebView
            ref={(ref) => (this.webview = ref)}
            source={{ uri: this.state.webUri }}
            onMessage={(event) => {
              this.receivePost(event.nativeEvent.data);
            }}
            scrollEnabled={false}
            geolocationEnabled={true}
            messagingEnabled={true}
            useWebKit={true}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderError={() => this.onErrorWebview()}
            injectedJavaScript={injectedJavascript}
            onLoadStart={() => this.setState({ showLoading: true })}
            onLoad={() => this.setState({ showLoading: false })}
            onLoadProgress={({ nativeEvent }) =>
              console.log("Loading", nativeEvent.progress)
            }
            onLoadEnd={() => this.setState({ showLoading: false })}
          />
        </View>
        {this.renderFooter()}
        {this.renderLoading()}
      </View>
    );
  }
}

export default ProfileScreenPage;
