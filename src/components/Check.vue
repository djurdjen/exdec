<template>
  <div :class="['checkmark-container', { active, 'on-start': animateOnStart }]">
    <svg
      class="checkmark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
    >
      <path
        class="checkmark__check"
        fill="none"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    active: { type: Boolean, default: false },
    animateOnStart: { type: Boolean, default: false },
    color: { type: String, default: "red" }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";

.checkmark-container {
  width: 22px;
  height: 22px;
  .checkmark {
    transform: scale(1.3);
    display: block;
    stroke-width: 6;
    stroke-miterlimit: 10;
    stroke: $primary;
  }
  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
  }
  &.on-start {
    .checkmark__check {
      animation: stroke 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      @keyframes stroke {
        100% {
          stroke-dashoffset: 0;
        }
      }
    }
  }

  &:not(.on-start) {
    .checkmark__check {
      transition: 300ms cubic-bezier(0.65, 0, 0.45, 1) all;
    }
    &.active {
      .checkmark__check {
        transition: 300ms cubic-bezier(0.65, 0, 0.45, 1) all;
        stroke-dashoffset: 0;
      }
    }
  }
}
</style>
