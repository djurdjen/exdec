import Vue from "vue";
import NsCalculate from "../../components/NsCalculate.vue";
/**
 * Usage:
 *  const answer = await modal({copy: "component"});
 *
 * @param {String} component
 */
export function nsModal() {
  return new Promise((resolve, reject) => {
    const dialog = new Vue({
      methods: {
        closeHandler() {
          reject("Modal closed");
          dialog.$destroy();
          dialog.$el.remove();
        },
        resolveModal(d) {
          resolve({ data: d });
          dialog.$destroy();
          dialog.$el.remove();
        }
      },
      render(h) {
        return h(NsCalculate, {
          on: {
            close: this.closeHandler,
            send: this.resolveModal
          }
        });
      }
    }).$mount();
    document.body.appendChild(dialog.$el);
  });
}

export default { nsModal };
