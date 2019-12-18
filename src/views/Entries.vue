<template>
  <div class="entries">
    <div
      :class="['entries__header', { 'entries__header--shadow': !showCreator }]"
    >
      <h1 class="theme-header">Reizen</h1>
      <div
        @click.prevent="showCreator = !showCreator"
        :class="['entries__header-toggle', { show: showCreator }]"
      >
        {{ showCreator ? "Verberg" : "Reis toevoegen" }}
        <i v-if="!showCreator" class="fas fa-chevron-down"></i>
        <i v-else class="fas fa-chevron-up"></i>
      </div>
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
        <div>
          <div
            :class="['entries__filter-toggle', { active: showFilters }]"
            @click="showFilters = !showFilters"
          >
            {{ showFilters ? "Verberg filters" : "Toon filters" }}
            <i class="fas fa-filter"></i>
          </div>
          <div :class="['entries__filters', { show: showFilters }]">
            <select v-model="filters.transport">
              <option value="all">Alle</option>
              <option
                v-for="(option, key) in transportation"
                :key="key"
                :value="option.val"
                >{{ option.name }}</option
              >
            </select>
            <select v-model="filters.order">
              <option value="desc">Aflopend</option>
              <option value="asc">Oplopend</option>
            </select>
          </div>
        </div>
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
            <div
              class="icon"
              :title="transportation.find(t => t.val === entry.transport).name"
            >
              <i v-if="entry.transport === 'bus'" class="fas fa-bus"></i>
              <i v-if="entry.transport === 'car'" class="fas fa-car"></i>
              <i v-if="entry.transport === 'metro'" class="fas fa-subway"></i>
              <i v-if="entry.transport === 'train'" class="fas fa-train"></i>
              <i v-if="entry.transport === 'tram'" class="fas fa-train"></i>
            </div>
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
        <div v-if="!entries.length" class="entries__no-results">
          Geen data beschikbaar
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
      showCreator: false,
      scrollTop: document.documentElement.scrollTop,
      entryDetail: null,
      transportation,
      pulser: null,
      pulserTimeout: null,
      showFilters: false,
      filters: {
        transport: "all",
        order: "desc"
      }
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
      const desc = this.filters.order === "desc";
      return Object.values(this.rawEntries)
        .sort((a, b) => {
          return new Date((desc ? b : a).date) - new Date((desc ? a : b).date);
        })
        .filter(entry => {
          if (this.filters.transport === "all") {
            return entry;
          }
          return this.filters.transport === entry.transport;
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
        // eslint-disable-next-line
        console.warn(err);
      }
    },
    resetFilters() {
      this.filters.transport = "all";
      this.filters.order = "desc";
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
    padding: 12px 20px 12px 12px;
    min-height: 60px;
    max-height: 60px;
    width: 100%;
    @include respond-to("medium-small") {
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
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
  &__header-toggle {
    display: flex;
    align-items: center;
    @include respond-to("medium-small") {
      display: none;
    }
    &.show {
      color: $primary;
    }
    i {
      margin-left: 20px;
    }
  }
  &__filter-toggle {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    padding: 8px 0;
    i {
      padding: 12px 20px;
    }
    &.active {
      color: $primary;
      cursor: pointer;
    }
    @include respond-to("medium-small") {
      display: none;
    }
  }
  &__filters {
    flex-direction: column;
    align-items: center;
    padding: 12px 12px 20px;
    display: none;
    &.show {
      display: flex;
      padding-top: 0;
    }
    @include respond-to("medium-small") {
      display: flex;
      flex-grow: 1;
      flex-direction: row;
      padding: 0 12px;
    }
    select {
      @include respond-to("medium-small") {
        max-width: 300px;
        margin-right: 12px;
      }
    }
    a {
      margin-left: auto;
      white-space: nowrap;
    }
  }

  &__data {
    @include respond-to("medium-small") {
      display: flex;
      flex-grow: 1;
    }
  }
  &__create {
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    transition: 300ms ease-in-out all;
    max-height: 400px;
    min-height: 271px;
    overflow: hidden;
    @include respond-to("medium-small") {
      max-height: none;
      min-height: 100%;
      width: 354px;
      // box-shadow: none;
      border-bottom: 0;
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
    position: relative;
    flex: 1;
    min-height: calc(100vh - 150px);
    @include respond-to("medium-small") {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      max-height: calc(100vh - 60px);
    }
  }
  &__no-results {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
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
        i {
          font-size: 30px;
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
