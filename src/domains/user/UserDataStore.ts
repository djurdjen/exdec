import { DataStore, DataStoreInterface } from "@/services/DataStore";

interface UserState {
  username: string;
  id: string;
}

export const storeKey = "USER_DATA_STORE";

export class UserDataStore extends DataStore<UserState> {
  static open(): DataStoreInterface<UserState> {
    return super.open(storeKey, UserDataStore);
  }
  static getState() {
    return super.getState(storeKey);
  }
}
