import Vue from "vue";
import App from "./App.vue";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}

new Vue({
  render: h => h(App)
}).$mount("#app");
