import { DataStore } from "@/services/DataStore";
import { ensureAuthorized } from "./endpoints";

interface UserState {
  username: string;
  id: string;
}

export const storeKey = "USER_DATA_STORE";

export class UserDataStore extends DataStore<UserState> {
  constructor() {
    super(storeKey);
  }
  createModel(model: UserState) {
    model.username = "";
    model.id = "";
    return model;
  }
  async ensureUserIsAuthorized() {
    return ensureAuthorized()
      .then((resp) => {
        this.state.username = resp.username;
        this.state.id = resp.id;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}

export function getUserDataStore() {
  return UserDataStore.getDataStore<UserState>(storeKey);
}
