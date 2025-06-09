import { QSpinnerIos, Loading } from "quasar";

const show = (message = "Loading. Please wait...") => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerColor: "white",
    spinnerSize: 140,
    message: message,
    messageColor: "white",
  });
};

const hide = () => {
  Loading.hide();
};

// leave the export, even if you don't use it
export default ({ app }) => {
  app.config.globalProperties.$spinner = {
    show,
    hide,
  };
};

export { show, hide };
