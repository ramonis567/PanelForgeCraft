const PDFDocument = require('pdfkit');

/**
 * Gera um PDF simples com dados fixos de um painel
 * Retorna uma Promise com Buffer do arquivo PDF
 */
function generatePanelPDF() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Cabeçalho
    doc.fontSize(20).text('Desenho Dimensional - Painel Simplificado', { align: 'center' });
    doc.moveDown();

    // Dados fixos (mock)
    const colunas = [
      { nome: 'CUB. 1A', altura: 2000, largura: 400, profundidade: 500, peso: 850 },
      { nome: 'CUB. 2A', altura: 2000, largura: 300, profundidade: 500, peso: 850 },
      { nome: 'CUB. 3A', altura: 2000, largura: 400, profundidade: 500, peso: 800 }
    ];

    doc.fontSize(14).text('Configuração do Painel:', { underline: true });
    doc.moveDown(0.5);

    colunas.forEach((c, i) => {
      doc.text(`${i + 1}. ${c.nome}`);
      doc.text(`   Altura: ${c.altura} mm`);
      doc.text(`   Largura: ${c.largura} mm`);
      doc.text(`   Profundidade: ${c.profundidade} mm`);
      doc.text(`   Peso: ${c.peso} kg`);
      doc.moveDown(0.5);
    });

    // Desenho simplificado (caixas lado a lado)
    let x = 50, y = 300;
    colunas.forEach((c) => {
      const escLargura = c.largura / 5;   // escala
      const escAltura = c.altura / 20;    // escala
      doc.rect(x, y, escLargura, escAltura).stroke();
      doc.fontSize(10).text(c.nome, x + 5, y + escAltura / 2);
      x += escLargura + 20;
    });

    doc.end(); // fecha o PDF
  });
}

module.exports = { generatePanelPDF };
