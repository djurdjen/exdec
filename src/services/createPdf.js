import jsPDF from "jspdf";
import "jspdf-autotable";

export default function(table, rawData, settings = {}, mode = "save") {
  return new Promise(resolve => {
    var doc = new jsPDF("l");
    doc.setFontSize(18);
    doc.text(
      `Reiskosten overzicht: ${settings.beginDate} t/m ${settings.endDate}`,
      14,
      22
    );
    doc.setFontSize(11);
    doc.setTextColor(100);

    var pageSize = doc.internal.pageSize;
    var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    doc.text(
      doc.splitTextToSize(`Naam: ${settings.name || ""}`, pageWidth - 35, {}),
      14,
      30
    );
    doc.text(
      doc.splitTextToSize(
        `Bedrijfsnaam: ${settings.company || ""}`,
        pageWidth - 35,
        {}
      ),
      14,
      38
    );
    doc.text(
      doc.splitTextToSize(
        `Rekeningnummer: ${settings.bankAccount || ""}`,
        pageWidth - 35,
        {}
      ),
      14,
      46
    );

    doc.autoTable({
      html: table,
      startY: 52,
      showHead: "firstPage",
      columnStyles: {
        1: { cellWidth: 60 }
      },
      didParseCell: function(data) {
        if (data.row.index === rawData.length) {
          data.cell.styles.fontStyle = "bold";
        }
      }
    });
    if (mode === "url") {
      (async function() {
        const blob = await doc.output("blob");
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          resolve(reader.result);
        };
      })();
    } else {
      doc.save(`${settings.beginDate}-${settings.endDate}.pdf`);
      resolve();
    }
  });
}
