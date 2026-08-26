import PDFDocument from 'pdfkit';

export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 40 });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // COVER
    doc.rect(0, 0, 612, 792).fill('#132030');
    doc.fontSize(36).fillColor('#ffffff').text('LEANGLE', 0, 250, { align: 'center', width: 612 });
    doc.fontSize(12).fillColor('#4A7FA5').text('HR LAB', 0, 300, { align: 'center', width: 612 });
    doc.fontSize(18).fillColor('#ffffff').text(quizTitle, 0, 360, { align: 'center', width: 612 });
    doc.fontSize(11).fillColor('#8A9BB0').text('Prepared for ' + leaderName, 0, 450, { align: 'center', width: 612 });

    // PAGE 2
    doc.addPage();
    doc.fontSize(14).fillColor('#1a1a1a').text('REPORT', 40, 40);
    doc.fontSize(11).fillColor('#333').text(reportContent, 40, 80, { width: 532 });

    // PAGE 3
    doc.addPage();
    doc.fontSize(14).fillColor('#1a1a1a').text('PROFILE', 40, 40);
    doc.fontSize(10).fillColor('#333').text('People Focus: 8/10', 40, 80);
    doc.fontSize(10).fillColor('#333').text('Visibility: 7/10', 40, 100);
    doc.fontSize(10).fillColor('#333').text('Speed: 8/10', 40, 120);

    // PAGE 4
    doc.addPage();
    doc.fontSize(14).fillColor('#1a1a1a').text('ROADMAP', 40, 40);
    doc.fontSize(10).fillColor('#333').text('Month 1: Foundation', 40, 80);
    doc.fontSize(10).fillColor('#333').text('Month 2: Action', 40, 100);
    doc.fontSize(10).fillColor('#333').text('Month 3: Integration', 40, 120);

    // PAGE 5
    doc.addPage();
    doc.fontSize(14).fillColor('#1a1a1a').text('RESOURCES', 40, 40);
    doc.fontSize(10).fillColor('#333').text('• Multipliers', 40, 80);
    doc.fontSize(10).fillColor('#333').text('• The Innovators Dilemma', 40, 100);

    // PAGE 6: CERTIFICATE
    doc.addPage();
    doc.rect(20, 20, 572, 752).strokeColor('#1a1a1a').lineWidth(2).stroke();
    doc.fontSize(18).fillColor('#1a1a1a').text('CERTIFICATE', 40, 200, { width: 532, align: 'center' });
    doc.fontSize(12).fillColor('#666').text('This certifies that', 40, 280, { width: 532, align: 'center' });
    doc.fontSize(16).fillColor('#1a1a1a').text(leaderName, 40, 320, { width: 532, align: 'center' });
    doc.fontSize(12).fillColor('#666').text('has completed ' + quizTitle, 40, 380, { width: 532, align: 'center' });

    // PAGE 7: BACK COVER
    doc.addPage();
    doc.rect(0, 0, 612, 792).fill('#132030');
    doc.fontSize(18).fillColor('#ffffff').text('LEANGLE HR LAB', 40, 300, { width: 532, align: 'center' });
    doc.fontSize(10).fillColor('#8A9BB0').text('Thank you', 40, 400, { width: 532, align: 'center' });

    doc.end();
  });
}
