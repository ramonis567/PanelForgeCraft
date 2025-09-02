const express = require('express');
const router = express.Router();
const { generatePanelPDF } = require('../services/pdfService');

// Rota de exportação de PDF
router.post('/pdf', async (req, res) => {
  try {
    // (no futuro: usar req.body para dados dinâmicos)
    const pdfBuffer = await generatePanelPDF();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="painel.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar PDF', details: err.message});
  }
});

// router.post('/dxf', async (req, res) => {
//   try {
//     const painelConfig = req.body;
//     const dxfBuffer = generatePanelDXF(painelConfig);
//     res.setHeader('Content-Type', 'application/dxf');
//     res.setHeader('Content-Disposition', 'attachment; filename="painel.dxf"');
//     res.send(dxfBuffer);
//   } catch (err) {
//     console.error('Erro DXF:', err);
//     res.status(500).json({ error: 'Erro ao gerar DXF', details: err.message });
//   }
// });

module.exports = router;

module.exports = router;
