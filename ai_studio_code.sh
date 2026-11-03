#!/bin/bash

# ==============================================================
# PANDUAN DEPLOY KE GITHUB PAGES
# ==============================================================

# OPSI A (Sangat Mudah): Gunakan perintah otomatis 'npm run deploy'
# Cukup jalankan perintah ini di terminal Anda:
npm run deploy

# Catatan:
# 'npm run deploy' akan otomatis mem-build proyek dan mengunggahnya
# ke branch 'gh-pages' di GitHub.
# Setelah itu di GitHub (Settings > Pages):
# - Source: Deploy from a branch
# - Branch: gh-pages
# - Folder: / (root)
# - Klik Save

# --------------------------------------------------------------

# OPSI B: Gunakan GitHub Actions (Otomatis setiap push)
# 1. Commit dan push proyek ke GitHub:
#    git add .
#    git commit -m "Siap deploy ke GitHub Pages"
#    git push origin main
# 2. Di GitHub (Settings > Pages):
#    - Source: Ubah menjadi "GitHub Actions"
# Selesai! Web akan ter-deploy otomatis.