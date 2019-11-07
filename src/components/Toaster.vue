<template>
  <div id="toast" :class="['toast', 'toast__' + type, { active }]">
    <div class="toast__container">
      <div class="toast__msg">{{ message }}</div>
    </div>
    <!-- <div class="toast__close" @click="close"></div> -->
  </div>
</template>

<script>
export default {
  name: "Toaster",
  props: {
    type: { type: String, default: "neutral" },
    message: { type: String, required: true }
  },
  data() {
    return {
      active: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.close();
    }, 3000);
  },
  methods: {
    close() {
      this.active = false;
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.toast {
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  right: 0;
  max-width: 300px;
  width: 100%;
  top: 100px;
  color: white;
  overflow: hidden;
  font-size: 12px;
  font-weight: bold;
  animation: HIDE 0.2s linear; /* IE 10+, Fx 29+ */
  animation-fill-mode: forwards;
  padding: 12px 20px;
  transform: translateX(100%);
  border-radius: 5px 0 0 5px;

  @include respond-to("medium-small") {
    max-width: 400px;
  }

  @keyframes HIDE {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }

  &.active {
    animation: POPUP 0.2s linear; /* IE 10+, Fx 29+ */
    animation-fill-mode: forwards;
    @keyframes POPUP {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(0);
      }
    }
  }

  &__success {
    background-color: green;
  }
  &__failed {
    background-color: #8b0000;
  }

  &__container {
    display: flex;
    max-width: 700px;
    margin: 0 auto;
  }

  &__msg {
    flex-grow: 1;
  }
  &__close {
    font-weight: bold;
    font-size: 14px;
    width: 24px;
    height: 24px;
    display: block;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid white;

    &:before,
    &:after {
      content: "";
      position: absolute;
      right: 4px;
      top: 10px;
      width: 14px;
      height: 2px;
      background-color: white;
      display: block;
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
}
</style>
