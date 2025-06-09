import axios from 'axios';
import { defineStore, acceptHMRUpdate } from 'pinia'

const API_BASE_URL = process.env.VITE_APP_API_BASE_URL;
export const dataStore = defineStore('dataStore', {
  state: () => ({
    syncData: {
      loading: false,
      data: null,
      error: null,
    },
  }),
  getters: {},
  actions: {
    async sync(payload) {
      this.syncData.loading = true;
      // send request
      try {
        const { data } = await axios({
          method: "POST", // request type
          url: `${API_BASE_URL}/api/v1/data/sync`, // endpoint from BE
          data: payload, // data to pass to BE
          headers: { // request headers
            'Content-Type': 'application/json'
          },
        });

        this.syncData.data = data;
        this.syncData.error = null;
      } catch (e) {
        this.syncData.error = e;
        this.syncData.data = null;
      } finally {
        // after successful request
        this.syncData.loading = false;
      }
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(dataStore, import.meta.hot))
}
