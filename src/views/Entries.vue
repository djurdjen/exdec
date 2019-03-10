<template>
  <div class="entries">
    <div
      :class="['entries__header', { 'entries__header--shadow': !showCreator }]"
    >
      <h1>Reizen</h1>
      <button @click.prevent="showCreator = !showCreator">
        {{ showCreator ? "Verberg" : "Toevoegen" }}
      </button>
    </div>
    <div
      :class="['entries__create', { 'entries__create--hidden': !showCreator }]"
    >
      <CreateEntry />
    </div>
    <div class="entries__list">
      <div class="entries__single" v-for="entry in entries" :key="entry.id">
        <div class="entries__single-meta" @click="toggleEntry(entry)">
          <div :class="['icon', entry.transport]" />
          <div>
            <span v-if="entry.kilometres"
              ><strong>Kilometers: </strong>{{ entry.kilometres }}</span
            >
            <span v-else
              ><strong>Ticketprijs: </strong>{{ entry.ticketPrice }}</span
            ><br />
            <span><strong>Beschrijving: </strong>{{ entry.description }}</span
            ><br />
            <span><strong>Datum: </strong>{{ entry.date | formatTime }}</span
            ><br />
            <a
              href="#"
              class="entries__delete"
              @click.prevent="removeEntry(entry.id)"
              >Delete</a
            >
          </div>
        </div>
        <!-- Edit field for single entry -->
        <div
          v-if="entryDetail && entry.id === entryDetail.id"
          class="entries__single-edit"
        >
          <label>
            Vervoer
            <select v-model="entryDetail.transport">
              <option
                v-for="(option, key) in transportation"
                :key="key"
                :value="option.val"
                >{{ option.name }}</option
              >
            </select>
          </label>

          <InputText
            v-if="entryDetail.transport === 'car'"
            pattern="\d*"
            v-model="entryDetail.kilometres"
            placeholder="Kilometers"
            label="Kilometers"
          />
          <InputText
            v-else
            type="number"
            v-model="entryDetail.ticketPrice"
            placeholder="Prijs kaartje"
            label="Prijs kaartje"
          />

          <InputTextSelect
            v-model="entryDetail.description"
            placeholder="Beschrijving"
            :choices="['Optie 1', 'Optie 2']"
          />
          <InputDate v-model="entryDetail.date" label="Datum" />
          <br />

          <div class="entries__single-send">
            <button class="cta" @click.prevent="editSingleEntry(entryDetail)">
              Aanpassen
            </button>
            <span v-if="error.edit" class="create__error">{{
              error.edit[0]
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        class="entries__to-top"
        v-scroll-to="'#app'"
        v-if="scrollTop > 100"
      ></div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CreateEntry from "../components/CreateEntry.vue";
import date from "date-and-time";
import "date-and-time/locale/nl";
import InputText from "../elements/InputText.vue";
import InputTextSelect from "../elements/InputTextSelect.vue";
import InputDate from "../elements/InputDate.vue";
import { transportation } from "../services/presets.js";
import { pushToast } from "../services/toaster.js";

export default {
  name: "Entries",
  components: { CreateEntry, InputText, InputDate, InputTextSelect },
  data() {
    return {
      showCreator: true,
      scrollTop: document.documentElement.scrollTop,
      entryDetail: null,
      transportation
    };
  },
  computed: {
    ...mapState({
      entries: state => state.entries.data.reverse(),
      error: state => state.entries.failed
    })
  },
  filters: {
    formatTime(val) {
      date.locale("nl");
      return date.format(new Date(val), "dddd D MMMM YYYY");
    }
  },
  async mounted() {
    await this.getEntries();
    window.addEventListener("scroll", () => {
      this.scrollTop = window.pageYOffset;
    });
  },
  methods: {
    ...mapActions(["getEntries", "removeEntry", "editEntry"]),
    toggleEntry(entry = null) {
      if (this.entryDetail && this.entryDetail.id === entry.id) {
        this.entryDetail = null;
      } else {
        this.entryDetail = JSON.parse(JSON.stringify(entry));
      }
    },
    async editSingleEntry(data) {
      try {
        await this.editEntry(data);
        pushToast("success", "Reisdata succesvol gewijzigd");
      } catch (err) {
        pushToast("failed", "Er is iets mis gegaan met opslaan");
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/util.scss";
.entries {
  text-align: left;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    min-height: 60px;
    max-height: 60px;

    &--shadow {
      animation: box-shadow-frames 0.3s;
      animation-fill-mode: forwards;
      animation-delay: 0.2s; /* or: Xms */

      @keyframes box-shadow-frames {
        0% {
          box-shadow: 0, 0, 0, 0, transparent;
        }
        100% {
          box-shadow: 0px 5px 12px -4px rgba(0, 0, 0, 0.4);
        }
      }
    }
    h1 {
      padding: 0;
    }
    button {
      height: 30px;
    }
  }
  &__create {
    box-shadow: 0px 5px 12px -4px rgba(0, 0, 0, 0.4);
    transition: 300ms ease-in-out all;
    max-height: 400px;
    min-height: 271px;
    overflow: hidden;

    &--hidden {
      max-height: 0;
      min-height: 0;
      transition: 300ms ease-in-out all;
    }
  }
  &__list {
    flex: 1;
  }
  &__single {
    &-meta {
      padding: 12px 20px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      position: relative;
      display: flex;
      align-items: center;
      .icon {
        min-width: 30px;
        min-height: 30px;
        margin-right: 20px;
        background: {
          size: cover;
          image: url("../assets/icons/train.svg");
        }

        &.car {
          background-image: url("../assets/icons/car.svg");
        }
        &.bus {
          background-image: url("../assets/icons/bus.svg");
        }
      }
    }
    &-edit {
      padding: 20px;
      background: $grey-background;
    }
    &-send {
      display: flex;
      button {
        margin-right: 12px;
      }
    }
  }
  &__delete {
    position: absolute;
    right: 12px;
    top: 6px;
    color: red;
    text-decoration: none;
    text-transform: lowercase;
    font-size: 14px;
  }
  &__to-top {
    width: 40px;
    height: 40px;
    position: fixed;
    left: 50%;
    margin-left: -20px;
    bottom: 20px;
    background-color: $primary;
    border-radius: 50%;
    color: white;
    background: {
      image: url("../assets/icons/up-arrow.svg");
      size: 16px 16px;
      position: 50% 50%;
      repeat: no-repeat;
    }
  }
  // &__modal {
  //   position: fixed;
  //   left: 0;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  //   background-color: rgba(0, 0, 0, 0.6);
  //   z-index: 10;

  //   &-container {
  //     padding: 20px;
  //     width: calc(100% - 24px);
  //     max-width: 400px;
  //     margin: 0 12px;
  //     background-color: white;
  //     border-radius: 6px;
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     transform: translate(-50%, -50%);
  //   }
  // }
}
</style>
