import AsyncStorage from "@react-native-async-storage/async-storage";

import { User } from "src/entities/user.entities";
import { USER_STORAGE } from "@storage/storageConfig";

export async function storageUserSave(user: User) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  // let user: User;

  // if (storage) {
  //   user = JSON.parse(storage);
  // } else {
  //   user = {
  //     id: "",
  //     name: "",
  //     email: "",
  //     avatar: "",
  //   };
  // }

  const user: User = storage ? JSON.parse(storage) : {}

  return user;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}
