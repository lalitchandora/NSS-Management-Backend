const exceljs = require("exceljs");

function generateXLS(data, year) {
    try {
        console.log("asdfl")
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Grace Marks" + year, {
            pageSetup: { paperSize: 9, orientation: "landscape" }
        });

        let rowIndex = 1;
        let row = worksheet.getRow(rowIndex);
        row.values = ["UID", "Name", "Course", "Hours Completed", "Marks"];
        row.font = { bold: true };

        const columnWidths = [12, 20, 15, 10, 20];

        row.eachCell((cell, colNumber) => {
            const columnIndex = colNumber - 1;
            const columnWidth = columnWidths[columnIndex];
            worksheet.getColumn(colNumber).width = columnWidth;
        });

        data.forEach((item, index) => {
            const currRow = worksheet.getRow(rowIndex + index + 1);
            currRow.getCell("A").value = item.uid;
            currRow.getCell("B").value = item.name;
            currRow.getCell("C").value = item.course;
            currRow.getCell("D").value = item.totalHrs;
            currRow.getCell("E").value = 10;
        });

        rowIndex += data.length;

        return workbook.xlsx.writeBuffer();
    } catch (error) {
        console.log(error);
    }
}

module.exports = generateXLS;