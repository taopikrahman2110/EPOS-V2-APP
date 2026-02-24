import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

const PLATFORM_MICROPHONE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
};

const PLATFORM_BLUETOOTH_SCAN_PERMISSIONS = {
  ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  android: PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
};

const PLATFORM_BLUETOOTH_CONNECT_PERMISSIONS = {
  ios: null,
  android: PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
};

const PLATFORM_BLUETOOTH_ADVERTISE_PERMISSIONS = {
  ios: null,
  android: PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
};

const PLATFORM_PHOTO_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};

const PLATFORM_READ_STORAGE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};

const PLATFORM_LOCATION_PERMISSIONS = {
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const PLATFORM_ACCESS_BACKGROUND_LOCATION_PERMISSIONS = {
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
};

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const PLATFORM_CONTACTS_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CONTACTS,
  android: PERMISSIONS.ANDROID.READ_CONTACTS,
};

const REQUEST_PERMISSION_TYPE = {
  contacts: PLATFORM_CONTACTS_PERMISSIONS,
  camera: PLATFORM_CAMERA_PERMISSIONS,
  microphone: PLATFORM_MICROPHONE_PERMISSIONS,
  photo: PLATFORM_PHOTO_PERMISSIONS,
  read_storage: PLATFORM_READ_STORAGE_PERMISSIONS,
  location: PLATFORM_LOCATION_PERMISSIONS,
  location_background: PLATFORM_ACCESS_BACKGROUND_LOCATION_PERMISSIONS,
  bluetooth_scan: PLATFORM_BLUETOOTH_SCAN_PERMISSIONS,
  bluetooth_connect: PLATFORM_BLUETOOTH_CONNECT_PERMISSIONS,
  bluetooth_advertise: PLATFORM_BLUETOOTH_ADVERTISE_PERMISSIONS,
};

const PERMISSIONS_TYPE = {
  contacts: "contacts",
  camera: "camera",
  microphone: "microphone",
  photo: "photo",
  read_storage: "read_storage",
  location: "location",
  location_background: "location_background",
  bluetooth_scan: "bluetooth_scan",
  bluetooth_connect: "bluetooth_connect",
  bluetooth_advertise: "bluetooth_advertise",
};

class AppPermission {
  checkPermission = async (type): Promise<boolean> => {
    console.log("AppPermission checkPermission type: ", type);
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    console.log("AppPermission checkPermission permissions: ", permissions);
    if (!permissions) {
      return true;
    }
    try {
      const result = await check(permissions);
      console.log("AppPermission checkPermission result: ", result);
      if (result === RESULTS.GRANTED) {
        return true;
      }
      return this.requestPermission(permissions);
    } catch (error) {
      console.log("AppPermission checkPermission error: ", error);
      return false;
    }
  };

  requestPermission = async (permissions): Promise<boolean> => {
    console.log("AppPermission requestPermission permissions: ", permissions);
    try {
      const result = await request(permissions);
      console.log("AppPermission requestPermission result: ", result);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log("AppPermission requestPermission error: ", error);
      return false;
    }
  };

  requestMultiple = async (types): Promise<boolean> => {
    console.log("AppPermission requestMultiple type: ", types);
    const results = [];
    for (const type of types) {
      const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
      if (permission) {
        const result = await this.requestPermission(permission);
        results.push(result);
      }
    }
    for (const result of results) {
      if (!result) {
        return false;
      }
    }
    return true;
  };
}

const Permission = new AppPermission();
export { Permission, PERMISSIONS_TYPE };
