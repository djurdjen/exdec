<template>
  <label
    ref="picker"
    :class="['input-text-select', { 'choices-active': choicesActive }]"
  >
    {{ label }}
    <input
      :value="value"
      @input="changeData($event.target.value)"
      :placeholder="placeholder"
      :type="type"
      :pattern="pattern"
    />
    <div class="input-text-select__picker" @click="toggleChoices">
      <div class="picker__icon"></div>
    </div>
    <div class="picker__choices" v-if="choicesActive">
      <span v-if="!choices.length" class="picker__choices-single"
        >Geen presets bechikbaar</span
      >
      <a
        href="#"
        class="picker__choices-single"
        v-for="(choice, key) in choices"
        :key="key"
        @click.prevent="changeData(choice)"
      >
        {{ choice }}
      </a>
    </div>
  </label>
</template>

<script>
export default {
  props: {
    value: { type: [Number, String], default: "" },
    label: { type: String, default: "" },
    pattern: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    type: { type: String, default: "text" },
    choices: { type: Array, default: () => [] }
  },
  data() {
    return {
      choicesActive: false
    };
  },
  watch: {
    choicesActive: {
      handler(val) {
        if (val) {
          document.addEventListener("click", this.registerOutsideClick);
        } else {
          document.removeEventListener("click", this.registerOutsideClick);
        }
      }
    }
  },
  methods: {
    changeData(data) {
      this.choicesActive = false;
      this.$emit("input", data);
    },
    toggleChoices() {
      this.choicesActive = !this.choicesActive;
    },
    registerOutsideClick(e) {
      if (!this.$refs.picker.contains(e.target)) {
        this.choicesActive = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
.input-text-select {
  position: relative;
  &.choices-active {
    .input-text-select__picker {
      border-bottom-right-radius: 0;
    }
    input {
      border-bottom-left-radius: 0 !important;
    }
  }
  input {
    padding-right: 50px !important;
  }
  &__picker {
    position: absolute;
    right: 1px;
    top: 9px;
    bottom: 9px;
    width: 40px;
    background: $primary;
    border-radius: 0 3px 3px 0;
    &:before {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
      border-right: 3px solid white;
      border-top: 3px solid white;
      display: block;
      top: calc(50% - 2px);
      left: 50%;
      transform: translate(-50%, -50%) rotate(135deg);
    }
  }
  .picker {
    &__choices {
      position: absolute;
      right: 0;
      top: calc(100% - 8px);
      width: 100%;
      background-color: white;
      border: 2px solid $primary;
      border-radius: 0 0 6px 6px;
      box-shadow: 1px 5px 9px 2px rgba(0, 0, 0, 0.3);
      &-single {
        text-decoration: none;
        color: black;
        display: block;
        padding: 12px 18px;
        border-bottom: 1px solid $grey-border;
        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
