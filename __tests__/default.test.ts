import { PDFContractGenerator } from '../src/index';
test('gerar pdf', () => {
  expect(new PDFContractGenerator().generatePDF('teste')).toBe(undefined);
});