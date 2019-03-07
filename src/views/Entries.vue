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

export default {
  name: "Entries",
  components: { CreateEntry },
  data() {
    return {
      showCreator: true,
      scrollTop: document.documentElement.scrollTop
    };
  },
  computed: {
    ...mapState({
      entries: state => state.entries.data.reverse()
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
    ...mapActions(["getEntries", "removeEntry"])
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
    background-color: $blue;
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
