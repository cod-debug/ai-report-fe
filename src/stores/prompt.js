import { defineStore, acceptHMRUpdate } from 'pinia';
import axios from 'src/utils/axios.js';

const API_BASE_URL = process.env.VITE_APP_API_BASE_URL;
export const promptStore = defineStore('promptStore', {
  state: () => ({
    sendPromptData: {
      loading: false,
      data: null,
      error: null,
    },
    sendAdditionalPromptData: {
      loading: false,
      data: null,
      error: null,
    },
  }),
  getters: {},
  actions: {
    async sendPrompt(payload) {
      this.sendPromptData.loading = true;
      // send request
      try {
        const { data } = await axios({
          method: "POST", // request type
          url: `${API_BASE_URL}/api/v1/prompt`, // endpoint from BE
          data: payload, // data to pass to BE
          headers: { // request headers
            'Content-Type': 'application/json'
          },
        });

        this.sendPromptData.data = data;
        this.sendPromptData.error = null;
      } catch (e) {
        this.sendPromptData.error = e;
        this.sendPromptData.data = null;
      } finally {
        // after successful request
        this.sendPromptData.loading = false;
      }
    },
    async sendAdditionalPrompt(payload) {
      this.sendAdditionalPromptData.loading = true;
      // send request
      try {
        const { data } = await axios({
          method: "POST", // request type
          url: `${API_BASE_URL}/api/v1/prompt/additional`, // endpoint from BE
          data: payload, // data to pass to BE
          headers: { // request headers
            'Content-Type': 'application/json'
          },
        });

        this.sendAdditionalPromptData.data = data;
        this.sendAdditionalPromptData.error = null;
      } catch (e) {
        this.sendAdditionalPromptData.error = e;
        this.sendAdditionalPromptData.data = null;
      } finally {
        // after successful request
        this.sendAdditionalPromptData.loading = false;
      }
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(promptStore, import.meta.hot))
}
