import XLSX from "xlsx";
import date from "date-and-time";
import "date-and-time/locale/nl";

export default function(data) {
  date.locale("nl");
  var entries = data.map(e => {
    return {
      Datum: date.format(new Date(e.date), "dddd D MMMM YYYY"),
      Beschrijving: {
        v: e.description
      },
      Kilometers: e.kilometres,
      Ticket: e.ticketPrice,
      Vergoeding: { v: e.total.toFixed(2), t: "n", total: true }
    };
  });
  /* make the worksheet */
  var ws = XLSX.utils.json_to_sheet(entries);

  var wscols = [
    { wch: 35 },
    { wch: 60 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 }
  ];

  ws["!cols"] = wscols;

  const totalCellKeys = [];
  for (const [key, entry] of Object.entries(ws)) {
    if (entry.total) {
      totalCellKeys.push(key);
    }
  }
  // ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  XLSX.utils.sheet_add_aoa(ws, [], { origin: -1 });
  XLSX.utils.sheet_add_aoa(
    ws,
    (() => {
      const values = [];
      const keyLength = Object.keys(entries[0]).length;
      for (let i = 0; i < keyLength; i++) {
        if (i === keyLength - 1) {
          values.push({
            v: "",
            f: `sum(${totalCellKeys.shift()}:${totalCellKeys.pop()})`
          });
        } else if (i === keyLength - 2) {
          values.push({ v: "Subtotaal" });
        } else {
          values.push({ v: "" });
        }
      }
      return [values];
    })(),
    { origin: -1 }
  );

  /* add to workbook */
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reiskosten");
  /* generate an XLSX file */
  XLSX.writeFile(wb, "sheetjs.xlsx");
}
