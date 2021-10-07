import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageError = (message: string, wrappedError: Error) => {
  wrappedError.message = `${message}: ${wrappedError.message}`;
  return wrappedError;
};

export default class Storage {
  static async get(key: string) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw StorageError("Error getting from local storage", error as Error);
    }
  }

  static async set(key: string, value: any) {
    try {
      if (value) {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
      } else {
        return await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      throw StorageError("Error setting local storage", error as Error);
    }
  }

  static async remove(key: string) {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      throw StorageError("Error removing from local storage", error as Error);
    }
  }

  static async clear() {
    try {
      return await AsyncStorage.clear();
    } catch (error) {
      throw StorageError("Error clearing local storage", error as Error);
    }  }
}
