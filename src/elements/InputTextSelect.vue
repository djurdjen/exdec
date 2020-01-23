<template>
  <label
    ref="picker"
    :class="['input-text-select', { 'choices-active': choicesActive }]"
  >
    {{ label }}
    <input
      v-if="optionalDropdown"
      :value="value"
      @input="changeData($event.target.value)"
      :placeholder="placeholder"
      :type="type"
      :name="name"
      :pattern="pattern"
    />
    <input
      v-else
      :value="value"
      @input="changeData($event.target.value)"
      @blur="closeChoices"
      @focus="choicesActive = true"
      :placeholder="placeholder"
      :type="type"
      :name="name"
      :pattern="pattern"
    />

    <div
      v-if="optionalDropdown"
      :class="['input-text-select__picker', { active: choicesActive }]"
      @click="toggleChoices"
    ></div>
    <div class="picker__choices" v-show="choicesActive">
      <span v-if="!choices.length" class="picker__choices-single"
        >Geen data bechikbaar</span
      >
      <span
        :class="['picker__choices-single', { active: choice.active }]"
        v-for="(choice, key) in formattedChoices"
        :key="key"
        @click.prevent="clickedChoice(choice)"
      >
        {{ choice.name }}
      </span>
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
    name: { type: String, default: "" },
    choices: { type: Array, default: () => [] },
    suggestion: { type: Boolean, default: false },
    optionalDropdown: { type: Boolean, default: false }
  },
  data() {
    return {
      choicesActive: false,
      selectionIndex: null
    };
  },
  watch: {
    choicesActive: {
      handler(val) {
        if (val) {
          this.$el.addEventListener("keydown", this.onKeyEvents);
        } else {
          this.$el.removeEventListener("keydown", this.onKeyEvents);
          this.selectionIndex = null;
        }
      }
    }
  },
  computed: {
    formattedChoices() {
      return this.choices.map((c, key) => {
        return {
          key,
          name: typeof Object.values(this.choices)[0] === "string" ? c : c.name,
          active: key + 1 === this.selectionIndex
        };
      });
    }
  },

  methods: {
    onKeyEvents(e) {
      if (this.choicesActive) {
        if (e.keyCode === 40) {
          this.selectionIndex < 6 && this.selectionIndex++;
        }
        if (e.keyCode === 38) {
          this.selectionIndex && this.selectionIndex--;
        }
        if (e.keyCode === 13 && !isNaN(this.selectionIndex)) {
          this.changeData(this.formattedChoices.find(c => c.active).name, true);
        }
      }
    },
    changeData(data, close = false) {
      this.choicesActive = close ? false : this.suggestion;
      this.$emit("input", data);
    },
    clickedChoice(val) {
      this.changeData(val.name);
      this.$emit("onChoice", this.choices[val.key]);
    },
    toggleChoices() {
      this.choicesActive = !this.choicesActive;
    },
    closeChoices() {
      setTimeout(() => {
        this.choicesActive = false;
      }, 120); // race condition
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
.input-text-select {
  position: relative;
  z-index: 2;
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
    z-index: 20;
    cursor: pointer;

    &:before {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      border-right: 3px solid white;
      border-top: 3px solid white;
      display: block;
      top: calc(50% - 2px);
      left: 50%;
      transform: translate(-50%, -50%) rotate(135deg);
    }
    &.active {
      &:before {
        top: calc(50% + 2px);
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }
  .picker {
    &__choices {
      position: absolute;
      right: 0;
      top: calc(100% - 9px);
      width: 100%;
      background-color: white;
      border: 2px solid $primary;
      border-radius: 0 0 6px 6px;
      box-shadow: 2px 3px 3px 0px rgba(0, 0, 0, 0.3);
      z-index: 40;
      &-single {
        text-decoration: none;
        color: black;
        display: block;
        padding: 12px 18px;
        border-bottom: 1px solid $grey-border;
        &:last-child {
          border-bottom: 0;
        }
        &.active {
          background-color: #e1ebf9;
        }
      }
    }
  }
}
</style>
