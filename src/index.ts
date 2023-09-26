import { jsPDF } from 'jspdf';

interface Params {
  marginSides?: number;
  marginTopBottom?: number;
  font?: string;
  fontSize?: number;
  lineHeight?: number;
  hasSignature?: boolean;
  documentLanguage?: string;
  fileName?: string;
}

export const Greeter = (name: string) => `Hello ${name}`;

export class PDFContractGenerator {
  private doc: jsPDF = new jsPDF();

  generatePDF(text: string, params?: Params): void {
    let marginSides = params?.marginSides ? params?.marginSides : 1;
    let marginTopBottom = params?.marginTopBottom ? params?.marginTopBottom : 1;
    marginSides *= 10;
    marginTopBottom *= 6;
    const font = params?.font ? params?.font : 'times';
    const fontSize = params?.fontSize ? params?.fontSize : 15;
    const lineHeight = params?.lineHeight ? params?.lineHeight : 1.45;
    const hasSignature = params?.hasSignature ? params?.hasSignature : true;

    const pageText = text
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/(<br>)/g, '\n')
      .replace(/(<2br>)/g, '\n\n');
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;
    const pageUsableWidth = pageWidth - marginSides * 2;
    const parts = pageText
      .match(/(<[a-zA-Z]?[0-9]*>.*?<\/[a-zA-Z]?[0-9]*>|[^<]+)/g)
      ?.filter((part) => part.match(/[\w\n\d]/g));
    let writtingHeight = marginTopBottom;
    this.doc.setFont(font);

    parts!.forEach((parte, index) => {
      let tempFontSize = fontSize;
      let textAlign: any = 'left';
      if (parte.match(/<[a-zA-Z]?[0-9]*?>.*?<\/[a-zA-Z]?[0-9]*?>/g)) {
        tempFontSize = parseInt(parte.match(/<[a-zA-Z]?([0-9]*)>/)![1], 10);
        textAlign = parseInt(parte.match(/<([a-zA-Z]?)[0-9]*>/)![1], 10);
        switch (textAlign) {
          case 'c':
            textAlign = 'center';
            break;
          case 'r':
            textAlign = 'right';
            break;
          case 'l':
            textAlign = 'left';
            break;
          case 'j':
            textAlign = 'justify';
            break;
        }
        parts![index] = parte.replace(/(<[a-zA-Z]?[0-9]*>)/g, '').replace(/(<\/[a-zA-Z]?[0-9]*>)/g, '');
      }
      this.doc.setFontSize(tempFontSize);
      const wrappedText = this.doc.splitTextToSize(parts![index], pageUsableWidth);
      for (let i = 0; i < wrappedText.length; i++) {
        if (writtingHeight + tempFontSize > pageHeight) {
          this.doc.addPage();
          writtingHeight = marginTopBottom;
        }
        writtingHeight += Math.floor((tempFontSize / 3) * lineHeight);
        this.doc.text(
          wrappedText[i],
          textAlign === 'center' ? pageWidth / 2 : textAlign === 'right' ? pageWidth - marginSides : marginSides,
          writtingHeight,
          { maxWidth: pageUsableWidth, align: textAlign },
        );
      }
    });
    if (hasSignature) {
      if (writtingHeight + fontSize * 9 + 10 > pageHeight) {
        this.doc.addPage();
        writtingHeight = marginTopBottom;
      }
      for (let i = 0; i < 2; i++) {
        writtingHeight += fontSize * 4;
        this.doc.setLineWidth(0.5);
        this.doc.line(marginSides, writtingHeight, marginSides + 80, writtingHeight);
        switch (params?.documentLanguage) {
          case 'pt':
            this.doc.text(
              'Assinatura do ' + (i === 0 ? 'Contratante' : 'Contratado'),
              marginSides + 40,
              writtingHeight + fontSize / 2 + 5,
              { maxWidth: 80, align: 'center' },
            );
            break;
          case 'en':
            this.doc.text(
              i === 0 ? 'Contractor' : 'Contracted' + ' Signature',
              marginSides + 40,
              writtingHeight + fontSize / 2 + 5,
              { maxWidth: 80, align: 'center' },
            );
            break;
          case 'es':
            this.doc.text(
              'Firma del ' + (i === 0 ? 'Contratante' : 'Contratado'),
              marginSides + 40,
              writtingHeight + fontSize / 2 + 5,
              { maxWidth: 80, align: 'center' },
            );
            break;
          default:
            this.doc.text(
              i === 0 ? 'Contractor' : 'Contracted' + ' Signature',
              marginSides + 40,
              writtingHeight + fontSize / 2 + 5,
              { maxWidth: 80, align: 'center' },
            );
            break;
        }
      }
    }
    this.doc.output('dataurlnewwindow', { filename: (params?.fileName ? params?.fileName : 'contrato') + '.pdf' });
  }
}
