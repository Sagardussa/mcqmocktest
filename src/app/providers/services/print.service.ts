import { Injectable } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { AuthServiceService } from './auth-service.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts'; // For default fonts
import { HttpClient } from '@angular/common/http';
import { LocalStorageServiceService } from './local-storage-service.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

(pdfMake as any).vfs = {
  ...pdfFonts.pdfMake.vfs,
};

@Injectable({
  providedIn: 'root'
})

export class PrintService {
  userData: any = {};
  currentCompany: ICompanyViewModel;
  recordData: any;
  constructor(companyResolver: CompanyResolver,
    private authServiceService: AuthServiceService,
    private http: HttpClient,
    private localstorageSerive: LocalStorageServiceService,
  ) {
    this.userData = this.authServiceService.getTokenInfo().user;
    this.currentCompany = companyResolver.getCurrentCompany();
  }
  async printData(rows: any[]): Promise<void> {
    const headerImage = await this.getBase64ImageFromURL("../../../assets/images/inv_head.jpeg");
    const columns = Object.keys(rows[0]);

    const capitalizeHeader = (header: string): string => {
      const words = header.split(/(?=[A-Z])/);
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
      return capitalizedWords.join(' ');
    };

    const replaceNullWithSpace = (value: any): string => {
      return value === null || value === 'null' ? '' : value;
    };

    const tableBody = rows.map(row => columns.map(column => replaceNullWithSpace(row[column])));

    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    //const columnWidth = 'auto';
    const numColumns = columns.length;

    // Calculate width for each column
    const pageWidth = 841.89; //595.28; // Width of A4 page in points
    const totalMargin = 10 * 2; // Total left and right margin
    const availableWidth = pageWidth - totalMargin;
    const columnWidth = (availableWidth / numColumns) - 10;



    const docDefinition = {
      //pageMargins: [10, 45, 10, 10],
      //[left, top, right, bottom]
      pageMargins: [10, 10, 10, 10],
      pageOrientation: 'landscape',
      pageSize: 'A4',
      content: [
        { text: `Printed on : ${formattedDate}`, alignment: 'right', margin: [0, 10, 10, 5], style: 'font11' },
        {
          table: {
            widths: Array(numColumns).fill(columnWidth),
            headerRows: 1,
            body: [
              columns.map(column => ({ text: capitalizeHeader(column), style: 'tableHeader' })),
              ...tableBody
            ],
          },
          // layout: {
          //   fillColor: function (rowIndex, node, columnIndex) {
          //     return (rowIndex % 2 === 0) ? '#F5F5F5' : null; 
          //   }
          // }
        }
      ],
      // header: function (currentPage: number) {
      //   if (currentPage == 1) {
      //     return {
      //       image: headerImage,
      //       // width: 595.28,
      //       width: 841.89,
      //       height: 80,
      //       alignment: 'right'
      //     };
      //   }
      //   return null;
      // },
      footer: function (currentPage: number, pageCount: number) {
        return { text: `Page ${currentPage.toString()} of ${pageCount}`, alignment: 'right', margin: [10, 0, 10, 10] };
      },
      defaultStyle: {
        fontSize: 8,
      },
      styles: {
        header: {
          fontSize: 10,
          bold: false,
          margin: [0, 0, 0, 10]
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          fillColor: 'skyblue'
        },
        font11: {
          fontSize: 11,
        },
      }
    };

    pdfMake.createPdf(docDefinition).download('report.pdf');
  }

  // generatePdf(data, fdata): Promise<Blob> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       await this.loadFonts(); // Ensure fonts are loaded before generating the PDF
  //       const currentDate = fdata.date ? new Date(fdata.date) : new Date();
  //       const formattedDate = currentDate.toLocaleDateString('en-GB') + ' ' + currentDate.toLocaleTimeString('en-GB');

  //       const invoiceItemDetail = data.invoiceItemDetail || [];
  //       var extraCharges = data?.invoiceExtraCharges?.length ? data.invoiceExtraCharges : (data?.extraCharges?.length ? data.extraCharges : []);
  //       if (extraCharges.length) extraCharges = extraCharges.filter((charge) => charge.amount && charge.amount != 0);
  //       // Calculate totals
  //       const itemTotal = invoiceItemDetail.reduce((sum, item) => sum + item.amount, 0);

  //       const tableBody = [
  //         // Invoice items header
  //         [
  //           { text: 'Particulars', style: 'tableHeader', font: getFontForText('Particulars') },
  //           { text: 'Qty', style: 'tableHeader', font: getFontForText('Qty'), alignment: 'right' },
  //           { text: 'Rate', style: 'tableHeader', font: getFontForText('Rate'), alignment: 'right' },
  //           { text: 'Amount', style: 'tableHeader', font: getFontForText('Amount'), alignment: 'right' },
  //         ],
  //         // Invoice items rows
  //         ...invoiceItemDetail.map((item) => [
  //           {
  //             text: typeof item.itemRow === 'string' ? JSON.parse(item.itemRow)[0].name : item.itemRow.name,
  //             font: getFontForText(
  //               typeof item.itemRow === 'string' ? JSON.parse(item.itemRow)[0].name : item.itemRow.name || ''
  //             ),
  //             style: 'tableHeader',
  //           },
  //           { text: item.std_Qty.toFixed(2), font: getFontForText(item.std_Qty.toString()), alignment: 'right', bold: true },
  //           { text: item.std_Rate.toFixed(2), font: getFontForText(item.std_Rate.toString()), alignment: 'right', bold: true },
  //           { text: item.amount.toFixed(2), font: getFontForText(item.amount.toString()), alignment: 'right', bold: true },
  //         ]),
  //         // Subtotal row
  //         [
  //           { text: 'Subtotal:', colSpan: 3, alignment: 'right', style: 'totalLabel', font: getFontForText('Subtotal') },
  //           {},
  //           {},
  //           { text: itemTotal.toFixed(2), alignment: 'right', style: 'totalAmount', font: getFontForText(itemTotal.toFixed(2)) },
  //         ],
  //         // Extra charges rows (only show if amount > 0)
  //         ...extraCharges.map((charge) => [
  //           {
  //             text: `${charge.name}(${charge.perVal || '0'}):`, // Dynamically show all extra charge names
  //             colSpan: 3,
  //             alignment: 'right',
  //             style: 'noBorder', // Custom style to remove lines
  //             font: getFontForText(charge.name),
  //             border: [false, false, false, false], // No borders
  //           },
  //           { text: '', border: [false, false, false, false] }, // Empty columns without borders
  //           { text: '', border: [false, false, false, false] },
  //           {
  //             text: charge.amount.toFixed(2),
  //             alignment: 'right',
  //             style: 'noBorder', // Custom style to remove lines
  //             font: getFontForText(charge.amount.toFixed(2)),
  //             border: [false, false, false, false], // No borders
  //           },
  //         ]),
  //         // RoundOff Row (only show if roundOff > 0)
  //         ...(data.roundOff > 0 ? [
  //           [
  //             {
  //               text: 'Round Off:',
  //               colSpan: 3,
  //               alignment: 'right',
  //               style: 'noBorder',
  //               font: getFontForText('Round Off'),
  //               border: [false, false, false, false],
  //             },
  //             { text: '', border: [false, false, false, false] }, // Empty column without borders
  //             { text: '', border: [false, false, false, false] },
  //             {
  //               text: data.roundOff.toFixed(2), // Display the roundOff value
  //               alignment: 'right',
  //               style: 'noBorder',
  //               font: getFontForText(data.roundOff.toFixed(2)),
  //               border: [false, false, false, false],
  //             },
  //           ]
  //         ] : []),
  //         // Grand total row
  //         [
  //           { text: 'Grand Total:', colSpan: 3, alignment: 'right', style: 'totalLabel', font: getFontForText('Grand Total') },
  //           {},
  //           {},
  //           { text: data.grandTotal.toFixed(2), alignment: 'right', style: 'totalAmount', font: getFontForText(data.grandTotal.toFixed(2)) },
  //         ],
  //       ];
  //       const docDefinition = {
  //         pageSize: {
  //           width: 216, // 3 inches in points
  //           height: 'auto',
  //         },
  //         pageMargins: [5, 5, 20, 20],
  //         content: [
  //           {
  //             text: this.currentCompany.compName,
  //             style: 'header',
  //             alignment: 'center',
  //             font: getFontForText(this.currentCompany.compName),
  //           },
  //           {
  //             text: this.currentCompany.address,
  //             style: 'subheader',
  //             alignment: 'center',
  //             font: getFontForText(this.currentCompany.address),
  //           },
  //           {
  //             text: `${this.currentCompany.city} - ${this.currentCompany.pinCode}`,
  //             style: 'subheader',
  //             alignment: 'center',
  //             font: getFontForText(`${this.currentCompany.city} - ${this.currentCompany.pinCode}`),
  //           },
  //           {
  //             text: 'INVOICE',
  //             style: 'invoiceTitle',
  //             alignment: 'center',
  //             font: getFontForText('INVOICE'),
  //             margin: [0, 0, 0, 5],
  //           },
  //           {
  //             columns: [
  //               {
  //                 text: `NO : ${fdata.bill_No}`,
  //                 style: 'invoiceDetails',
  //                 font: getFontForText(`NO : ${fdata.bill_No}`),
  //               },
  //               {
  //                 text: `DATE : ${formattedDate}`,
  //                 alignment: 'right',
  //                 style: 'invoiceDetails',
  //                 font: getFontForText(`DATE : ${formattedDate}`),
  //                 width: 'auto',
  //               },
  //             ],
  //           },
  //           {
  //             text: `M/S : ${fdata.ledger_Id_Object ? fdata.ledger_Id_Object?.name : fdata.partyName}`,
  //             style: 'customerDetails',
  //             font: getFontForText('M/S : Counter Customer'),
  //           },
  //           {
  //             table: {
  //               headerRows: 1,
  //               widths: ['auto', '*', 'auto', 'auto'],
  //               body: tableBody, // Use dynamically generated table body
  //             },
  //             layout: 'lightHorizontalLines',
  //             style: 'subheader',
  //           },
  //           {
  //             text: `Total (In Words): Rs. ${appCommon.numberToEnglish(data.grandTotal)}`,
  //             alignment: 'center',
  //             style: 'totalInWords',
  //             margin: [0, 5, 0, 10],
  //             font: getFontForText(`Total (In Words): Rs. ${appCommon.numberToEnglish(data.grandTotal)}`),
  //           },
  //           {
  //             text: `Prepared By: ${(this.userData.first_Name + " " + this.userData.lastname) || 'N/A'}`,
  //             style: 'preparedBy',
  //             alignment: 'left',
  //             margin: [0, 0, 0, 0],
  //             font: getFontForText(`Prepared By: ${(this.userData.first_Name + " " + this.userData.lastname) || 'N/A'}`),
  //           },
  //           {
  //             text: [
  //               { text: 'Phone: ', bold: true, font: getFontForText('Phone: ') },
  //               { text: this.currentCompany.phone_1, font: getFontForText(this.currentCompany.phone_1) },
  //               ' | ',
  //               { text: 'Email: ', bold: true, font: getFontForText('Email: ') },
  //               { text: this.currentCompany.email, font: getFontForText(this.currentCompany.email) },
  //               ' | ',
  //               { text: 'GST No: ', bold: true, font: getFontForText('GST No: ') },
  //               { text: this.currentCompany.gstNo, font: getFontForText(this.currentCompany.gstNo) },
  //               ' | ',
  //               { text: 'Website: ', bold: true, font: getFontForText('Website: ') },
  //               { text: this.currentCompany.website, font: getFontForText(this.currentCompany.website) },
  //             ],
  //             style: 'contactInfo',
  //             alignment: 'center',
  //             margin: [0, 10, 0, 0],
  //           },
  //         ],
  //         styles: {
  //           header: { fontSize: 11, bold: true },
  //           subheader: { fontSize: 8, margin: [0, 1, 0, 3], bold: true },
  //           invoiceTitle: { fontSize: 11, bold: true, margin: [0, 5, 0, 5] },
  //           invoiceDetails: { fontSize: 8, margin: [0, 2, 0, 2], bold: true },
  //           customerDetails: { fontSize: 8, bold: true, margin: [0, 5, 0, 5] },
  //           tableHeader: { bold: true, fontSize: 8, color: 'black' },
  //           tableItemHeader: { bold: true, fontSize: 8, color: 'black' },
  //           totalLabel: { bold: true, fontSize: 8 },
  //           totalAmount: { bold: true, fontSize: 9 },
  //           totalInWords: { fontSize: 7, bold: true },
  //           contactInfo: { fontSize: 7, opacity: 0 },
  //           preparedBy: { fontSize: 6, bold: true, margin: [0, 0, 0, 0] },
  //           noBorder: { border: [false, false, false, false], }
  //         },
  //       };

  //       // pdfMake.createPdf(docDefinition).print();

  //       // pdfMake.createPdf(docDefinition).getBlob((blob) => {
  //       //   const url = URL.createObjectURL(blob);

  //       //   // Open PDF in the same tab and show the print dialog
  //       //   const iframe = document.createElement('iframe');
  //       //   iframe.style.display = 'none';
  //       //   iframe.src = url;

  //       //   // Append the iframe to the document body to trigger the print
  //       //   document.body.appendChild(iframe);

  //       //   iframe.onload = () => {
  //       //     iframe.contentWindow.print(); // Trigger the print dialog
  //       //     // Optionally, remove the iframe after printing
  //       //     iframe.addEventListener('afterprint', () => {
  //       //       document.body.removeChild(iframe);
  //       //       this.posComponent.cleanupAfterPrint();
  //       //       resolve(); // Resolve the promise


  //       //     });
  //       //   };
  //       // });

  //       // pdfMake.createPdf(docDefinition).getBlob((blob) => {
  //       //   const url = URL.createObjectURL(blob);

  //       //   const iframe = document.createElement('iframe');
  //       //   iframe.style.display = 'none';
  //       //   iframe.src = url;

  //       //   document.body.appendChild(iframe);

  //       //   iframe.onload = () => {
  //       //     iframe.contentWindow.print();

  //       //     // Set a fallback timeout for cleanup
  //       //     setTimeout(() => {
  //       //       console.log('Fallback timeout triggered');
  //       //       document.body.removeChild(iframe);
  //       //       this.posComponent.cleanupAfterPrint();
  //       //       resolve();
  //       //     }, 5000); // Adjust timeout as necessary

  //       //     // Attempt cleanup using unload events
  //       //     iframe.contentWindow.onunload = () => {
  //       //       console.log('onunload triggered');
  //       //       document.body.removeChild(iframe);
  //       //       this.posComponent.cleanupAfterPrint();
  //       //       resolve();
  //       //     };
  //       //   };

  //       //   // Log for debugging
  //       //   console.log('Iframe created and print dialog triggered');
  //       // });


  //       // const win = window.open('', "tempWinForPdf");
  //       // pdfMake.createPdf(docDefinition).print({}, win);
  //       // setTimeout(function () {
  //       //   win.close();
  //       // }, 2000);  

  //       pdfMake.createPdf(docDefinition).getBlob((blob) => {
  //         resolve(blob); // Return the Blob
  //       });
  //     } catch (error) {
  //       reject(error); // Handle errors
  //     }
  //   });
  // }

  generatePdf(data, fdata): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loadFonts(); // Ensure fonts are loaded before generating the PDF

        // Retrieve print settings from local storage
        const printSettings = this.localstorageSerive.getItem(appCommon.LocalStorageKeyType.PrintSettings);

        // Determine the language to use (1 = English, 2 = Hindi, 3 = Marathi)
        const selectedLanguage = printSettings.printLanguage || 1; // Default to English if no language is selected

        // Define language mappings
        const languageMappings = {
          1: { // English
            particulars: 'Particulars',
            qty: 'Qty',
            rate: 'Rate',
            amount: 'Amount',
            grandTotal: 'Grand Total',
          },
          2: { // Hindi
            particulars: 'माल का प्रकार',
            qty: 'संख्या',
            rate: 'भाव',
            amount: 'कुल राशि',
            grandTotal: 'नकद राशि',

          },
          3: { // Marathi (if needed, add mappings here)
            particulars: 'मालाचे प्रकार',
            qty: 'नग',
            rate: 'भाव',
            amount: 'एकूण',
            grandTotal: 'नगदी रक्कम',
          }
        };

        const currentLanguage = languageMappings[selectedLanguage];

        const currentDate = fdata.date ? new Date(fdata.date) : new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB') + ' ' + currentDate.toLocaleTimeString('en-GB');

        const invoiceItemDetail = data.invoiceItemDetail || [];
        var extraCharges = data?.invoiceExtraCharges?.length ? data.invoiceExtraCharges : (data?.extraCharges?.length ? data.extraCharges : []);
        if (extraCharges.length) extraCharges = extraCharges.filter((charge) => charge.amount && charge.amount != 0);

        // Calculate totals
        const itemTotal = invoiceItemDetail.reduce((sum, item) => sum + item.amount, 0);

        const tableBody = [
          // Invoice items header
          [
            { text: currentLanguage.particulars, style: 'tableHeader', font: getFontForText(currentLanguage.particulars) },
            { text: currentLanguage.qty, style: 'tableHeader', font: getFontForText(currentLanguage.qty), alignment: 'right' },
            { text: currentLanguage.rate, style: 'tableHeader', font: getFontForText(currentLanguage.rate), alignment: 'right' },
            { text: currentLanguage.amount, style: 'tableHeader', font: getFontForText(currentLanguage.amount), alignment: 'right' },
          ],
          // Invoice items rows
          ...invoiceItemDetail.map((item) => [
            {
              text: typeof item.itemRow === 'string' ? JSON.parse(item.itemRow)[0].name : item.itemRow.name,
              font: getFontForText(
                typeof item.itemRow === 'string' ? JSON.parse(item.itemRow)[0].name : item.itemRow.name || ''
              ),
              style: 'tableHeader',
            },
            { text: item.std_Qty.toFixed(2), font: getFontForText(item.std_Qty.toString()), alignment: 'right', bold: true },
            { text: item.std_Rate.toFixed(2), font: getFontForText(item.std_Rate.toString()), alignment: 'right', bold: true },
            { text: item.amount.toFixed(2), font: getFontForText(item.amount.toString()), alignment: 'right', bold: true },
          ]),
          // Subtotal row
          [
            { text: 'Subtotal:', colSpan: 3, alignment: 'right', style: 'totalLabel', font: getFontForText('Subtotal') },
            {},
            {},
            { text: itemTotal.toFixed(2), alignment: 'right', style: 'totalAmount', font: getFontForText(itemTotal.toFixed(2)) },
          ],
          // Extra charges rows (only show if amount > 0)
          ...extraCharges.map((charge) => [
            {
              text: `${charge.name}(${charge.perVal || '0'}):`, // Dynamically show all extra charge names
              colSpan: 3,
              alignment: 'right',
              style: 'noBorder', // Custom style to remove lines
              font: getFontForText(charge.name),
              border: [false, false, false, false], // No borders
            },
            { text: '', border: [false, false, false, false] }, // Empty columns without borders
            { text: '', border: [false, false, false, false] },
            {
              text: charge.amount.toFixed(2),
              alignment: 'right',
              style: 'noBorder', // Custom style to remove lines
              font: getFontForText(charge.amount.toFixed(2)),
              border: [false, false, false, false], // No borders
            },
          ]),
          // RoundOff Row (only show if roundOff > 0)
          ...(data.roundOff > 0 ? [
            [
              {
                text: 'Round Off:',
                colSpan: 3,
                alignment: 'right',
                style: 'noBorder',
                font: getFontForText('Round Off'),
                border: [false, false, false, false],
              },
              { text: '', border: [false, false, false, false] }, // Empty column without borders
              { text: '', border: [false, false, false, false] },
              {
                text: data.roundOff.toFixed(2), // Display the roundOff value
                alignment: 'right',
                style: 'noBorder',
                font: getFontForText(data.roundOff.toFixed(2)),
                border: [false, false, false, false],
              },
            ]
          ] : []),
          // Grand total row
          [
            { text: currentLanguage.grandTotal, colSpan: 3, alignment: 'right', style: 'totalLabel', font: getFontForText(currentLanguage.grandTotal) },
            {},
            {},
            { text: data.grandTotal.toFixed(2), alignment: 'right', style: 'totalAmount', font: getFontForText(data.grandTotal.toFixed(2)) },
          ],
        ];

        var content: any = [];
        var logoFile = printSettings.logoFile;
        if (logoFile && Object.keys(logoFile).length !== 0) {
          content.push({
            image: logoFile,
            width: 50, // Adjust size as needed
            alignment: 'center',
            margin: [0, 0, 0, 5],
          },);
        }

        content.push(
          {
            text: this.currentCompany.compName,
            style: 'header',
            alignment: 'center',
            font: getFontForText(this.currentCompany.compName),
          },
          {
            text: this.currentCompany.address,
            style: 'subheader',
            alignment: 'center',
            font: getFontForText(this.currentCompany.address),
          },
          {
            text: `${this.currentCompany.city} - ${this.currentCompany.pinCode}`,
            style: 'subheader',
            alignment: 'center',
            font: getFontForText(`${this.currentCompany.city} - ${this.currentCompany.pinCode}`),
          },
          {
            text: 'INVOICE',
            style: 'invoiceTitle',
            alignment: 'center',
            font: getFontForText('INVOICE'),
            margin: [0, 0, 0, 5],
          },
          {
            columns: [
              {
                text: `NO : ${fdata.bill_No}`,
                style: 'invoiceDetails',
                font: getFontForText(`NO : ${fdata.bill_No}`),
              },
              {
                text: `DATE : ${formattedDate}`,
                alignment: 'right',
                style: 'invoiceDetails',
                font: getFontForText(`DATE : ${formattedDate}`),
                width: 'auto',
              },
            ],
          },
          {
            text: `M/S : ${fdata.ledger_Id_Object ? fdata.ledger_Id_Object?.name : fdata.partyName}`,
            style: 'customerDetails',
            font: getFontForText('M/S : Counter Customer'),
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto'],
              body: tableBody, // Use dynamically generated table body
            },
            layout: 'lightHorizontalLines',
            style: 'subheader',
          },
          {
            text: `Total (In Words): Rs. ${appCommon.numberToEnglish(data.grandTotal)}`,
            alignment: 'center',
            style: 'totalInWords',
            margin: [0, 5, 0, 10],
            font: getFontForText(`Total (In Words): Rs. ${appCommon.numberToEnglish(data.grandTotal)}`),
          },
          {
            text: `Prepared By: ${(this.userData.first_Name + " " + this.userData.lastname) || 'N/A'}`,
            style: 'preparedBy',
            alignment: 'left',
            margin: [0, 0, 0, 0],
            font: getFontForText(`Prepared By: ${(this.userData.first_Name + " " + this.userData.lastname) || 'N/A'}`),
          },
          {
            text: [
              { text: 'Phone: ', bold: true, font: getFontForText('Phone: ') },
              { text: this.currentCompany.phone_1, font: getFontForText(this.currentCompany.phone_1) },
              ' | ',
              { text: 'Email: ', bold: true, font: getFontForText('Email: ') },
              { text: this.currentCompany.email, font: getFontForText(this.currentCompany.email) },
              ' | ',
              { text: 'GST No: ', bold: true, font: getFontForText('GST No: ') },
              { text: this.currentCompany.gstNo, font: getFontForText(this.currentCompany.gstNo) },
              ' | ',
              { text: 'Website: ', bold: true, font: getFontForText('Website: ') },
              { text: this.currentCompany.website, font: getFontForText(this.currentCompany.website) },
            ],
            style: 'contactInfo',
            alignment: 'center',
            margin: [0, 10, 0, 0],
          },
        );

        const docDefinition = {
          pageSize: {
            width: parseInt(printSettings.printWidth || 216), // 3 inches in points // Dynamic width from local storage
            height: 'auto',
          },
          pageMargins: [5, 5, 20, 20],

          content: content,
          styles: {
            header: { fontSize: 11, bold: true },
            subheader: { fontSize: 8, margin: [0, 1, 0, 3], bold: true },
            invoiceTitle: { fontSize: 11, bold: true, margin: [0, 5, 0, 5] },
            invoiceDetails: { fontSize: 8, margin: [0, 2, 0, 2], bold: true },
            customerDetails: { fontSize: 8, bold: true, margin: [0, 5, 0, 5] },
            tableHeader: { bold: true, fontSize: 8, color: 'black' },
            tableItemHeader: { bold: true, fontSize: 8, color: 'black' },
            totalLabel: { bold: true, fontSize: 8 },
            totalAmount: { bold: true, fontSize: 9 },
            totalInWords: { fontSize: 7, bold: true },
            contactInfo: { fontSize: 7, opacity: 0 },
            preparedBy: { fontSize: 6, bold: true, margin: [0, 0, 0, 0] },
            noBorder: { border: [false, false, false, false], }
          },
        };

        pdfMake.createPdf(docDefinition).getBlob((blob) => {
          resolve(blob); // Return the Blob
        });
      } catch (error) {
        reject(error); // Handle errors
      }
    });
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary); // Encode to Base64
  }

  async loadFonts() {
    // Load the NotoSansDevanagari fonts dynamically and add them to pdfMake.vfs
    const regularNotoFont = await this.http
      .get('assets/fonts/NotoSansDevanagari-Regular.ttf', {
        responseType: 'arraybuffer',
      })
      .toPromise();
    const boldNotoFont = await this.http
      .get('assets/fonts/NotoSansDevanagari-Bold.ttf', {
        responseType: 'arraybuffer',
      })
      .toPromise();

    pdfMake.vfs['NotoSansDevanagari-Regular.ttf'] =
      this.arrayBufferToBase64(regularNotoFont);
    pdfMake.vfs['NotoSansDevanagari-Bold.ttf'] =
      this.arrayBufferToBase64(boldNotoFont);

    // Load the Roboto fonts dynamically and add them to pdfMake.vfs
    const regularRobotoFont = await this.http
      .get('assets/fonts/Roboto-Regular.ttf', {
        responseType: 'arraybuffer',
      })
      .toPromise();
    const boldRobotoFont = await this.http
      .get('assets/fonts/Roboto-Bold.ttf', {
        responseType: 'arraybuffer',
      })
      .toPromise();

    pdfMake.vfs['Roboto-Regular.ttf'] =
      this.arrayBufferToBase64(regularRobotoFont);
    pdfMake.vfs['Roboto-Bold.ttf'] =
      this.arrayBufferToBase64(boldRobotoFont);

    // Define fonts for pdfMake
    pdfMake.fonts = {
      NotoSansDevanagari: {
        normal: 'NotoSansDevanagari-Regular.ttf',
        bold: 'NotoSansDevanagari-Bold.ttf',
      },
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Bold.ttf',
      },
    };
  }
}

function getFontForText(text: string): string {
  const devanagariRegex = /[\u0900-\u097F]/; // Unicode range for Devanagari script
  return devanagariRegex.test(text) ? 'NotoSansDevanagari' : 'Roboto';
}
