import { ref, Ref } from "@vue/reactivity";

let instances: { [key: string]: DataStoreInterface<any> };

export interface DataStoreInterface<T> {
  state: Ref<T | {}>;
  get: () => void;
  set: (data: Partial<T>) => void;
}

export abstract class DataStore<IState> implements DataStoreInterface<IState> {
  state: Ref<IState | {}>;
  constructor() {
    this.state = ref({});
  }

  // TODO: typed to be typeof DataStore class
  static open(instanceKey: string, dataStoreInstance: new () => any) {
    if (!instanceKey) {
      throw new Error(
        "Opening or retrieving the data store requires a key value"
      );
    }
    if (!instances || !instances[instanceKey]) {
      instances = {
        ...instances,
        ...{ [instanceKey]: new dataStoreInstance() },
      };
    }
    return instances[instanceKey];
  }

  get() {
    return this.state;
  }

  static getState(instanceKey: string) {
    return instances && instances[instanceKey]
      ? instances[instanceKey].state
      : undefined;
  }

  set(data: Partial<IState>) {
    this.state.value = { ...this.state.value, ...data };
  }
}
