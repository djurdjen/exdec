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
    <div class="entries__data">
      <div
        :class="[
          'entries__create',
          { 'entries__create--hidden': !showCreator }
        ]"
      >
        <CreateEntry />
      </div>
      <div class="entries__list">
        <div
          :class="['entries__single', { pulse: pulser === entry.id }]"
          v-for="entry in entries"
          :key="entry.id"
          :id="'entry_' + entry.id"
        >
          <div
            :class="[
              'entries__single-meta',
              {
                'entries__single-meta--active':
                  entryDetail && entry.id === entryDetail.id
              }
            ]"
            @click="toggleEntry(entry)"
          >
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
              <span><strong>Datum: </strong>{{ entry.date | formatTime }}</span>
            </div>
          </div>
          <!-- Edit field for single entry -->
          <div
            v-if="entryDetail && entry.id === entryDetail.id"
            class="entries__single-edit"
          >
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
              :choices="presets"
            />
            <InputDate v-model="entryDetail.date" label="Datum" />

            <div class="entries__single-send">
              <button class="cancel" @click.prevent="cancelEdit()">
                Annuleren
              </button>
              <button
                class="cta"
                :disabled="editLoading"
                @click.prevent="editSingleEntry(entryDetail)"
              >
                Bewerken
              </button>
              <span v-if="error.edit" class="create__error">{{
                error.edit[0]
              }}</span>
            </div>
            <a
              href="#"
              class="entries__delete"
              @click.prevent="toggleRemove(entryDetail.id)"
              >Verwijder</a
            >
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
import { modal } from "../services/modal.js";
import { setTimeout, clearTimeout } from "timers";

export default {
  name: "Entries",
  components: { CreateEntry, InputText, InputDate, InputTextSelect },
  data() {
    return {
      showCreator: true,
      scrollTop: document.documentElement.scrollTop,
      entryDetail: null,
      transportation,
      pulser: null,
      pulserTimeout: null
    };
  },
  computed: {
    ...mapState({
      rawEntries: state => state.entries.data,
      error: state => state.entries.failed,
      presets: state => state.settings.presets || [],
      editLoading: state => state.loading.editEntry
    }),
    entries() {
      if (!Object.keys(this.rawEntries).length) {
        return {};
      }

      return Object.values(this.rawEntries).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }
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
        this.$store.commit("EDIT_ENTRY_CANCEL");
      } else {
        this.entryDetail = JSON.parse(JSON.stringify(entry));
        setTimeout(() => {
          this.$scrollTo(`#entry_${entry.id}`, 300, { offset: -56 });
        }, 100);
      }
    },
    async editSingleEntry(data) {
      try {
        await this.editEntry(data);
        this.entryDetail = null;
        // create a pulse animation to see which entry you just edited
        pushToast("success", "Reisdata succesvol gewijzigd");
        clearTimeout(this.pulserTimeout);
        this.pulser = data.id;
        this.$scrollTo(`#entry_${data.id}`, 300, { offset: -56 });
        this.pulserTimeout = setTimeout(() => {
          this.pulser = null;
        }, 2000);
      } catch (err) {
        pushToast("failed", "Er is iets mis gegaan met opslaan");
      }
    },
    cancelEdit() {
      this.entryDetail = null;
    },
    async toggleRemove(id) {
      try {
        await modal({
          copy: "Weet je zeker dat je deze invoer wil verwijderen?",
          proceed: "Verwijderen",
          prompt: true
        });
        await this.removeEntry(id);
      } catch (err) {
        console.warn(err);
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/variables.scss";
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
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);

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
      @include respond-to("medium-small") {
        display: none;
      }
    }
  }

  &__data {
    @include respond-to("medium-small") {
      display: flex;
      flex-grow: 1;
    }
  }
  &__create {
    box-shadow: 0px 5px 12px -4px rgba(0, 0, 0, 0.4);
    transition: 300ms ease-in-out all;
    max-height: 400px;
    min-height: 271px;
    overflow: hidden;
    @include respond-to("medium-small") {
      max-height: none;
      min-height: 100%;
      width: 354px;
      box-shadow: none;
      border-right: 1px solid rgba(0, 0, 0, 0.15);
    }

    &--hidden {
      max-height: 0;
      min-height: 0;
      transition: 300ms ease-in-out all;
      @include respond-to("medium-small") {
        max-height: none;
        min-height: 0;
      }
    }
  }
  &__list {
    flex: 1;
    @include respond-to("medium-small") {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;

      max-height: calc(100vh - 60px);
    }
  }
  &__single {
    cursor: pointer;
    &.pulse {
      animation: pulse-entry 2.5s forwards;
      @keyframes pulse-entry {
        0% {
          background-color: #e8f7e4;
        }
        50% {
          background-color: #e8f7e4;
        }
        100% {
          background-color: white;
        }
      }
    }
    &:first-child {
      .entries__single-meta {
        border-top: 0;
      }
    }
    &:last-child {
      .entries__single-meta {
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      }
    }
    &-meta {
      border-top: 1px solid rgba(0, 0, 0, 0.15);
      padding: 12px 20px;
      position: relative;
      display: flex;
      align-items: center;

      &--active {
        background-color: $primary;
        color: white;

        .icon {
          color: white;
        }
      }

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
      position: relative;
      padding: 20px;
      background: $grey-background;
    }
    &-send {
      margin-top: 20px;
      display: flex;
      align-items: center;
      button {
        margin-top: 0;
        &:first-child {
          margin-right: 12px;
        }
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
}
</style>
