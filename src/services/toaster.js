import Vue from "vue";
import Toaster from "../components/Toaster.vue";
/**
 * @param {string} type
 * @param {string} message
 */
export function pushToast(type, message) {
  const dialog = new Vue({
    methods: {
      closePopup() {
        return function() {
          dialog.$destroy();
          dialog.$el.remove();
        };
      }
    },
    render(h) {
      return h(Toaster, {
        props: { type, message },
        on: {
          close: this.closePopup()
        }
      });
    }
  }).$mount();
  if (!document.getElementById(dialog.$el.id)) {
    document.body.appendChild(dialog.$el);
  }
}
export default { pushToast };
