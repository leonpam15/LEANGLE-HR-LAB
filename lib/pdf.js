import PDFDocument from 'pdfkit';
function escapeHtml(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function clean(t){return(t||'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim()}
export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 48, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 48, CW = W - M * 2;
    const lines = reportContent.split('\n');
    let y = 60;

    const header = () => {
      doc.rect(0, 0, W, 4).fill('#4A7FA5');
      doc.rect(0, 4, W, 44).fill('#132030');
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#4A7FA5').text('LEANGLE HR LAB', M, 14, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('  |  ' + quizTitle.toUpperCase(), { continued: false });
    };

    const footer = () => {
      doc.moveTo(M, H - 50).lineTo(W - M, H - 50).strokeColor('#D0D8E0').lineWidth(0.5).stroke();
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('LEANGLE HR LAB | Confidential', M, H - 18, { width: CW, align: 'center' });
    };

    // COVER - LIGHT BACKGROUND (PRINTER FRIENDLY)
    doc.rect(0, 0, W, H).fill('#F5F8FB');
    doc.fontSize(48).font('Helvetica').fillC
cat > ~/Downloads/leangle/lib/pdf.js << 'EOF'
import PDFDocument from 'pdfkit';
function escapeHtml(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function clean(t){return(t||'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/^#+\s+/,'').trim()}
export async function generatePDF(quizTitle, primaryStyle, reportContent, leaderName = '') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: 'LETTER', margin: 48, bufferPages: true });
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width, H = doc.page.height, M = 48, CW = W - M * 2;
    const lines = reportContent.split('\n');
    let y = 60;

    const header = () => {
      doc.rect(0, 0, W, 4).fill('#4A7FA5');
      doc.rect(0, 4, W, 44).fill('#132030');
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#4A7FA5').text('LEANGLE HR LAB', M, 14, { lineBreak: false });
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('  |  ' + quizTitle.toUpperCase(), { continued: false });
    };

    const footer = () => {
      doc.moveTo(M, H - 50).lineTo(W - M, H - 50).strokeColor('#D0D8E0').lineWidth(0.5).stroke();
      doc.fontSize(7).font('Helvetica').fillColor('#8A9BB0').text('LEANGLE HR LAB | Confidential', M, H - 18, { width: CW, align: 'center' });
    };

    // COVER - LIGHT BACKGROUND (PRINTER FRIENDLY)
    doc.rect(0, 0, W, H).fill('#F5F8FB');
    doc.fontSize(48).font('Helvetica').fillColor('#132030').text('LEANGLE', M, H / 2 - 80, { align: 'center', width: CW });
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text('HR LAB', M, H / 2 - 20, { align: 'center', width: CW });
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#132030').text(quizTitle, M, H / 2 + 40, { align: 'center', width: CW });
    const badgeW = 130, badgeH = 28, badgeX = (W - badgeW) / 2, badgeY = H / 2 + 100;
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).fill('#E8EFF5').strokeColor('#4A7FA5').lineWidth(1.5).stroke();
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#4A7FA5').text(primaryStyle, badgeX, badgeY + 7, { align: 'center', width: badgeW });
    doc.fontSize(11).font('Helvetica').fillColor('#666').text('Prepared for ' + escapeHtml(leaderName || 'Your Name'), M, H / 2 + 180, { align: 'center', width: CW });

    // CONTENT PAGES
    doc.addPage();
    header();
    y = 60;
    
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      
      if (t.startsWith('##')) {
        if (y + 30 > H - 60) { doc.addPage(); header(); y = 60; }
        y += 8;
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#132030').text(t.replace(/^#+\s+/, '').toUpperCase(), M, y, { width: CW });
        y += 16;
        doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#4A7FA5').lineWidth(2).stroke();
        y += 10;
      } else if (t.startsWith('- ')) {
        const txt = clean(t.replace(/^-\s+/, ''));
        const h = doc.heightOfString(txt, { width: CW - 20, lineGap: 2 });
        if (y + h + 10 > H - 60) { doc.addPage(); header(); y = 60; }
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#4A7FA5').text('▸', M, y, { width: 12, lineBreak: false });
        doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text(txt, M + 16, y, { width: CW - 20, lineGap: 2 });
        y += h + 8;
      } else {
        const txt = clean(t);
        if (txt.length < 3) continue;
        const h = doc.heightOfString(txt, { width: CW, lineGap: 2 });
        if (y + h + 6 > H - 60) { doc.addPage(); header(); y = 60; }
        doc.fontSize(11).font('Helvetica').fillColor('#1a1a1a').text(txt, M, y, { width: CW, lineGap: 2 });
        y += h + 8;
      }
    }

    footer();
    doc.end();
  });
}
