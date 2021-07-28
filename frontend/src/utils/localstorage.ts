import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Deals with the local storage of AuthResponse into AsyncStorage
 * calling `const note = await localStorage.getItem(noteId);`
 *
 * @class LocalStorage
 */
class LocalStorage {
  /**
   * Get a single item
   *
   * @param {string} authId
   * @returns {Promise<Note>}
   * @memberof LocalStorage
   */
  async getItem(authId: string): Promise<AuthResponse> {
    return AsyncStorage.getItem(`@note:${authId}`).then((json: any) => {
      return JSON.parse(json) as AuthResponse;
    });
  }

  /**
   * Save a single item
   *
   * @param {Note} item
   * @returns {Promise<void>}
   * @memberof LocalStorage
   */
  async setItem(item: AuthResponse): Promise<void> {
    return AsyncStorage.setItem(
      `@note:${item.user.name}`,
      JSON.stringify(item)
    );
  }

  /**
   * Deletes a single item
   *
   * @returns {Promise<void>}
   * @memberof LocalStorage
   */
  async deleteItem(noteId: string): Promise<void> {
    return AsyncStorage.removeItem(`@note:${noteId}`);
  }

  /**
   * Get all the items
   *
   * @returns {Promise<Note[]>}
   * @memberof LocalStorage
   */
  async getAllItems(): Promise<AuthResponse[]> {
    return AsyncStorage.getAllKeys()
      .then((keys: string[]) => {
        const fetchKeys = keys.filter((k) => {
          return k.startsWith("@note:");
        });
        return AsyncStorage.multiGet(fetchKeys);
      })
      .then((result) => {
        return result.map((r: any) => {
          return JSON.parse(r[1]) as AuthResponse;
        });
      });
  }
}

const localStorage = new LocalStorage();
export default localStorage;
