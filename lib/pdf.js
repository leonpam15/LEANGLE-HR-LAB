cp /tmp/pdf_fix.js ~/Downloads/leangle/lib/pdf.js
wc -l ~/Downloads/leangle/lib/pdf.js
cd ~/Downloads/leangle && git add lib/pdf.js && git commit -m "Fix: Complete PDF refactor - eliminate blank pages, improve colors, fix margins" && git push
