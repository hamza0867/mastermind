import Vue from "vue";
import Vuetify, { VTextField } from "vuetify/lib";

Vue.use(Vuetify);

export default new (Vuetify as any)({
  theme: {
    themes: {
      light: {
        primary: "#3F51B5",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      }
    }
  },
  icons: {
    iconfont: "mdi"
  }
});