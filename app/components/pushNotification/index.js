/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
import React from "react";
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
  StatusBar,
} from "react-native";
// import PushNotification, { Importance } from "react-native-push-notification";
import { convertToRupiah } from "../../global";
// import BackgroundTask from 'react-native-background-task';
// import BackgroundFetch from "react-native-background-fetch";

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#000",
  },
  pictureContainer: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  ContainerImg: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // picture: {
  //   borderRadius: 50,
  //   width: 100,
  //   height: 100,
  //   marginBottom: 10,
  // },
  textName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 4,
  },
  textPhone: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  contentContainer: {
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
  },
  contentTable: {
    height: 180,
    flexDirection: "column",
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
  },
  contentColumn: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#f2f2f2",
    height: 100,
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    color: "#000",
    padding: 10,
    margin: 40,
  },
  smallfont: {
    fontSize: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  formRowContainer: {
    marginTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: "#fff",
  },
  formRow: {
    flex: 0,
    flexShrink: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
    paddingLeft: 15,
    paddingRight: 15,
  },
  formColumn: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: "center",
  },
  formColumnAlignRight: {
    textAlign: "right",
  },
  picture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginTop: 10,
  },
  center: {
    textAlign: "center",
    color: "#dd0000",
  },
  avatarContainer: {
    borderColor: "#9B9B9B",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  listContent: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flexContent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    paddingRight: 8,
    paddingLeft: 4,
    alignSelf: "baseline",
    justifyContent: "center",
  },
  imgList: {
    height: 28,
    width: 28,
    resizeMode: "contain",
  },
  TitleList: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 0,
  },
  ArrawTitle: {
    flex: 2,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#F5FCFF',
  // },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "#000000",
    margin: 5,
    padding: 5,
    width: "70%",
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
  },
  textField: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    margin: 5,
    padding: 5,
    width: "70%",
  },
  spacer: {
    height: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});

class NotificationHandler {
  onNotification(notification) {
    // console.log('NotificationHandler:', notification);

    if (typeof this._onNotification === "function") {
      this._onNotification(notification);
    }
  }

  onRegister(token) {
    // console.log('NotificationHandler:', token);

    if (typeof this._onRegister === "function") {
      this._onRegister(
        "AAAAwc6401g:APA91bGP7ubw7NW0MEEIiEakxuyr3k2E9yIEkqhVsZFmIqDMm7RZhMeZ_FgQKKh8Tq5VsheWmACFdB6I6luz2hXDv64AdZfHRQhZeKfImGtFS_sBjRncC7cJ5h_TzBmrz6IIYLIhcNN2"
      );
    }
  }

  onAction(notification) {
    // console.log ('Notification action received:');
    // console.log(notification.action);
    // console.log(notification);

    if (notification.action === "Yes") {
      // PushNotification.invokeApp(notification);
    }
  }

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError(err) {
    console.log(err);
  }

  attachRegister(handler) {
    this._onRegister = handler;
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
}

const handler = new NotificationHandler();

// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: handler.onRegister.bind(handler),

//   // (required) Called when a remote or local notification is opened or received
//   onNotification: handler.onNotification.bind(handler),

//   // (optional) Called when Action is pressed (Android)
//   onAction: handler.onAction.bind(handler),

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: handler.onRegistrationError.bind(handler),

//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,

//   /**
//    * (optional) default: true
//    * - Specified if permissions (ios) and token (android and ios) will requested or not,
//    * - if not, you must call PushNotificationsHandler.requestPermissions() later
//    */
//   requestPermissions: true,
// });

class pushNotification extends React.Component {
  constructor(props, onRegister, onNotification) {
    super(props);

    this.state = {
      staff_id: "",
      tempo: 0,
      loginInfo: {
        staffId: "",
      },
    };

    this.lastId = 0;
    this.lastChannelCounter = 0;

    this.createDefaultChannels();

    // NotificationHandler.attachRegister(onRegister);
    // NotificationHandler.attachNotification(onNotification);

    // Clear badge number at start
    // PushNotification.getApplicationIconBadgeNumber(function (number) {
    //   if (number > 0) {
    //     PushNotification.setApplicationIconBadgeNumber(0);
    //   }
    // });

    // PushNotification.getChannels(function (channels) {
    //   // console.log(channels);
    // });
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentWillMount = (props) => {
    this.cancelAll();

    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        this.setState({ loginInfo: JSON.parse(info) });
        console.log(this.state.loginInfo.phonenumber);

        /* let myInterval = setInterval(() => {
                console.log('INI PEGAWAI');  
                if (this.state.tempo >= 1) {
                    clearInterval(myInterval);
                } else {
                    this.doInfoNotification();
                }
            }, 5000); */
      }
    });
  };

  componentDidMount = async () => {
    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        this.setState({ loginInfo: JSON.parse(info) });

        // console.log(this.state.loginInfo.userId);

        // this.doNotificationUser(this.state.loginInfo.userId);
      }
    });
  };

  doNotificationUser = (userId) => {
    fetch("http://103.215.26.245/eposapp_webapi_app/notifikasi_info_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((response) => {
        if (response.status === "OK") {
          if (response.records.length > 0) {
            var arrayNotif = response.records;
            var arrayPromise = arrayNotif.map(
              (obj, idx) =>
                new Promise((resolve) =>
                  setTimeout(() => {
                    console.log(obj);

                    this.localNotif(null, obj);
                    resolve();
                  }, 6000 * idx)
                )
            );
            Promise.all(arrayPromise).then(() => console.log("done"));
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doAcceptNotification = (notifId) => {
    fetch(
      "http://103.215.26.245/eposapp_webapi_app/notifikasi_update_send.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: JSON.stringify({
          notifikasiId: notifId,
        }),
      }
    )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // createDefaultChannels() {
  //   PushNotification.createChannel(
  //     {
  //       channelId: "default-channel-id", // (required)
  //       channelName: `Default channel`, // (required)
  //       channelDescription: "A default channel", // (optional) default: undefined.
  //       soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //     },
  //     (created) =>
  //       console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  //   PushNotification.createChannel(
  //     {
  //       channelId: "sound-channel-id", // (required)
  //       channelName: `Sound channel`, // (required)
  //       channelDescription: "A sound channel", // (optional) default: undefined.
  //       soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
  //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //     },
  //     (created) =>
  //       console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  // }

  // createOrUpdateChannel() {
  //   this.lastChannelCounter++;
  //   PushNotification.createChannel(
  //     {
  //       channelId: "custom-channel-id", // (required)
  //       channelName: `Custom channel - Counter: ${this.lastChannelCounter}`, // (required)
  //       channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional) default: undefined.
  //       soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //     },
  //     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  // }

  // popInitialNotification() {
  //   PushNotification.popInitialNotification((notification) =>
  //     console.log("InitialNotication:", notification)
  //   );
  // }

  // localNotif(soundName, obj) {
  //   this.lastId++;
  //   this.doAcceptNotification(obj.notifikasi_id);
  //   PushNotification.localNotification({
  //     /* Android Only Properties */
  //     channelId: soundName ? "sound-channel-id" : "default-channel-id",
  //     ticker: "My Notification Ticker", // (optional)
  //     autoCancel: true, // (optional) default: true
  //     largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
  //     smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
  //     bigText: obj.description, // (optional) default: "message" prop
  //     subText: "", // (optional) default: none
  //     color: "red", // (optional) default: system default
  //     vibrate: true, // (optional) default: true
  //     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  //     tag: "some_tag", // (optional) add tag to message
  //     group: "group", // (optional) add group to message
  //     groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
  //     ongoing: false, // (optional) set whether this is an "ongoing" notification

  //     // actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
  //     invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

  //     when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
  //     usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
  //     timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

  //     /* iOS only properties */
  //     category: "", // (optional) default: empty string
  //     subtitle: "KDL Mobile", // (optional) smaller title below notification title

  //     /* iOS and Android properties */
  //     id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  //     title: obj.category, // (optional)
  //     message: obj.description, // (required)
  //     userInfo: { screen: "home" }, // (optional) default: {} (using null throws a JSON value '<null>' error)
  //     playSound: !!soundName, // (optional) default: true
  //     soundName: soundName ? soundName : "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
  //     number: 1, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  //   });
  // }

  // scheduleNotif(soundName) {
  //   this.lastId++;
  //   PushNotification.localNotificationSchedule({
  //     date: new Date(Date.now() + 5 * 1000), // in 30 secs

  //     /* Android Only Properties */
  //     channelId: soundName ? "sound-channel-id" : "default-channel-id",
  //     ticker: "My Notification Ticker", // (optional)
  //     autoCancel: true, // (optional) default: true
  //     largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
  //     smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
  //     bigText:
  //       "My <strong>big text</strong> that will be shown when notification is expanded", // (optional) default: "message" prop
  //     subText: "This is a subText", // (optional) default: none
  //     color: "blue", // (optional) default: system default
  //     vibrate: true, // (optional) default: true
  //     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  //     tag: "some_tag", // (optional) add tag to message
  //     group: "group", // (optional) add group to message
  //     groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
  //     ongoing: false, // (optional) set whether this is an "ongoing" notification
  //     actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
  //     invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

  //     when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
  //     usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
  //     timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

  //     /* iOS only properties */
  //     category: "", // (optional) default: empty string

  //     /* iOS and Android properties */
  //     id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  //     title: "Scheduled Notification", // (optional)
  //     message: "My Notification Message", // (required)
  //     userInfo: { sceen: "home" }, // (optional) default: {} (using null throws a JSON value '<null>' error)
  //     playSound: !!soundName, // (optional) default: true
  //     soundName: soundName ? soundName : "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
  //     number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  //   });
  // }

  // checkPermission(cbk) {
  //   return PushNotification.checkPermissions(cbk);
  // }

  // requestPermissions() {
  //   return PushNotification.requestPermissions();
  // }

  // cancelNotif() {
  //   PushNotification.cancelLocalNotification(this.lastId);
  // }

  // cancelAll() {
  //   PushNotification.cancelAllLocalNotifications();
  // }

  // abandonPermissions() {
  //   PushNotification.abandonPermissions();
  // }

  // getScheduledLocalNotifications(callback) {
  //   PushNotification.getScheduledLocalNotifications(callback);
  // }

  // getDeliveredNotifications(callback) {
  //   PushNotification.getDeliveredNotifications(callback);
  // }

  // onRegister(token) {
  //   this.setState({
  //     registerToken:
  //       "AAAAwc6401g:APA91bGP7ubw7NW0MEEIiEakxuyr3k2E9yIEkqhVsZFmIqDMm7RZhMeZ_FgQKKh8Tq5VsheWmACFdB6I6luz2hXDv64AdZfHRQhZeKfImGtFS_sBjRncC7cJ5h_TzBmrz6IIYLIhcNN2",
  //     fcmRegistered: true,
  //   });
  // }

  onNotif(notif) {
    Alert.alert(notif.title, notif.message);
  }

  render() {
    return (
      <View style={styles.contentContainer}>
        {/* <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                      this.localNotif();
                  }}>
                  <Text>Local Notification (now)</Text>
              </TouchableOpacity> */}
        {/* <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.localNotif('sample.mp3');
              }}>
              <Text>Local Notification with sound (now)</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.scheduleNotif();
              }}>
              <Text>Schedule Notification in 30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.scheduleNotif('sample.mp3');
              }}>
              <Text>Schedule Notification with sound in 30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.cancelNotif();
              }}>
              <Text>Cancel last notification (if any)</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.cancelAll();
              }}>
              <Text>Cancel all notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.checkPermission(this.handlePerm.bind(this));
              }}>
              <Text>Check Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.requestPermissions();
              }}>
              <Text>Request Permissions</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.abandonPermissions();
              }}>
              <Text>Abandon Permissions</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.getScheduledLocalNotifications(notifs => console.log(notifs));
              }}>
              <Text>Console.Log Scheduled Local Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.getDeliveredNotifications(notifs => console.log(notifs));
              }}>
              <Text>Console.Log Delivered Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.createOrUpdateChannel();
              }}>
              <Text>Create or update a channel</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                  this.popInitialNotification();
              }}>
              <Text>popInitialNotification</Text>
              </TouchableOpacity> */}
      </View>
    );
  }
}

export default pushNotification;
