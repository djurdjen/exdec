import { reactive, UnwrapRef } from "@vue/reactivity";

let instances: { [key: string]: DataStoreInterface<any> };

export interface DataStoreInterface<T> {
  defaultData: UnwrapRef<T | {}>;
  state: UnwrapRef<T>;
  key: string;
  createModel: Function;
}

export abstract class DataStore<IState> implements DataStoreInterface<IState> {
  defaultData: UnwrapRef<{}>;
  state: UnwrapRef<IState>;
  key: string;
  opened: boolean;
  constructor(storeKey: string) {
    this.opened = false;
    this.key = storeKey;
    this.open(this);
    this.defaultData = reactive({});
    this.state = this.createModel(this.defaultData);
  }

  abstract createModel(state: UnwrapRef<{}>): UnwrapRef<IState>;

  protected open<T extends DataStore<IState>>(dataStore: T) {
    if (!this.key) {
      throw new Error(
        "Opening or retrieving the data store requires a key value"
      );
    }
    if (this.opened) {
      throw new Error("This datastore has already been opened");
    }
    if (!instances || !instances[this.key]) {
      instances = {
        ...instances,
        ...{ [this.key]: dataStore },
      };
    }
    this.opened = true;
    return instances[this.key];
  }

  static getDataStore<T>(instanceKey: string): DataStoreInterface<T> {
    if (instances && instances[instanceKey]) {
      return instances[instanceKey];
    }
    throw new Error("Cannot call data store when it has never been opened");
  }
}
