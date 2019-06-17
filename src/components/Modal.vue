<template>
  <div class="modal">
    <div class="modal__background" @click="closeModal"></div>
    <div class="modal__view">
      <div class="modal__header">
        <strong>Let op!</strong>
        <div class="modal__close" @click="closeModal">
          &times;
        </div>
      </div>

      <div class="modal__view-content">
        <p v-html="copy" />
      </div>
      <div v-if="prompt" class="modal__prompt">
        <button href="#" class="cta" @click.prevent="$emit('send', $event)">
          {{ proceed }}
        </button>
        <button @click.prevent="closeModal">Annuleer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    copy: { type: String, default: "" },
    prompt: { type: Boolean, default: false },
    proceed: { type: String, required: true }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.modal {
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;

  &__background {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 5;
  }
  &__header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 50px;
    padding: 0 0 0 20px;
    background-color: $primary;
    color: white;
    display: flex;
    align-items: center;

    strong {
      font-size: 20px;
      flex-grow: 1;
    }
  }
  &__close {
    font-size: 30px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
  }
  &__view {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 20px;
    transform: translate(-50%, -50%);
    width: calc(100% - 60px);
    max-width: 500px;
    background-color: white;
    z-index: 10;
    &-content {
      overflow: auto;
      max-height: 80vh;
      padding: 56px 0 30px;
      font-weight: 300;
      font-size: 15px;
      letter-spacing: 0.2px;
    }
  }
  &__prompt {
    display: flex;
    justify-content: flex-end;
    button {
      display: inline-flex;
      width: auto;
      margin: 0 0 0 12px;
    }
  }
  &__static {
    p {
      text-align: center;
      color: black;
    }
  }
}
</style>
