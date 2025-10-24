// const { DXFWriter, point } = require('dxf-writer');

// /**
//  * Gera um DXF simples com base em uma configuração de painel
//  * Retorna um Buffer do arquivo DXF
//  */
// function generatePanelDXF(painelConfig = { colunas: [] }) {
//   const dxf = new DXFWriter();

//   // Layer base
//   dxf.addLayer('Painel', 7, 'CONTINUOUS');
//   dxf.setActiveLayer('Painel');

//   let x = 0; // posição horizontal inicial
//   const y = 0; // base (podemos trabalhar tudo no quadrante positivo)

//   (painelConfig.colunas || []).forEach((c) => {
//     const w = c.largura || 500;
//     const h = c.altura || 2000;

//     // retângulo (4 linhas)
//     dxf.addLine(point(x, y), point(x + w, y));         // base
//     dxf.addLine(point(x + w, y), point(x + w, y + h)); // lateral direita
//     dxf.addLine(point(x + w, y + h), point(x, y + h)); // topo
//     dxf.addLine(point(x, y + h), point(x, y));         // lateral esquerda

//     // texto com nome do cubículo no centro do retângulo
//     dxf.addText(c.nome || 'CUBÍCULO', 250, point(x + w / 2, y + h / 2), 0, 0, 'CENTER');

//     // incrementa posição para próxima coluna (com folga)
//     x += w + 200; // 200 mm de espaçamento entre colunas
//   });

//   // retorna como Buffer
//   const dxfString = dxf.stringify();
//   return Buffer.from(dxfString, 'utf-8');
// }

// module.exports = { generatePanelDXF };
