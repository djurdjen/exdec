<template>
  <table>
    <thead>
      <tr class="warning">
        <th>Datum</th>
        <th>Beschrijving</th>
        <th>Transport</th>
        <th>Kilometers</th>
        <th>Ticket prijs</th>
        <th>Totaal</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(data, key) in fields" :key="key">
        <td>{{ data.date | formatTime }}</td>
        <td>{{ data.description }}</td>
        <td>{{ data.transport | translateTransport }}</td>
        <td>{{ data.kilometres || "-" }}</td>
        <td>{{ data.ticketPrice || "-" }}</td>
        <td>{{ data.total.toFixed(2) }},-</td>
      </tr>
      <tr>
        <td colspan="4"></td>
        <td><strong>Subtotaal</strong></td>
        <td>
          {{
            fields
              .map(v => v.total)
              .reduce((a, b) => a + b)
              .toFixed(2)
          }},-
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import date from "date-and-time";
import { getName } from "@/services/presets.js";

export default {
  props: {
    fields: { type: [Array, Object], required: true }
  },
  filters: {
    formatTime(val) {
      return date.format(new Date(val), "DD-MM-YYYY");
    },
    translateTransport(val) {
      return getName(val);
    }
  }
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  text-align: left;
  border-spacing: 0;

  th {
    color: white;
    font-size: 15px;
    background-color: #0081bf;
  }
  th,
  td {
    padding: 6px;
  }
  tr {
    &:nth-of-type(odd) {
      td {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
