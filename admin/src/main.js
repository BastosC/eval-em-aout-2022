// Core
// --------------------------------------------------------------------------------------------------------------
import { createApp } from "vue";
import App from "./App.vue";
import router from "./utils/router";
import "./styles/common.css";
import "./styles/custom.css";
const app = createApp(App);
app.use(router);

// Notifications
// --------------------------------------------------------------------------------------------------------------
import VueUniversalModal from "vue-universal-modal";
import "vue-universal-modal/dist/index.css";
app.use(VueUniversalModal, {
    teleportTarget: "#modals",
});

// Modal
// --------------------------------------------------------------------------------------------------------------
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {
    position: "bottom-right",
};
app.use(Toast, options);

// Init app
// --------------------------------------------------------------------------------------------------------------
app.config.errorHandler = (err, instance, info) => {
    const toast = useToast();
    if (err.response?.status === 500) {
        toast.error(err?.response?.data?.message || err?.message);
    }
};
app.mount("#app");
