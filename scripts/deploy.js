import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.log('📦 Folder dist belum ada, menjalankan build terlebih dahulu...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Gagal mem-build proyek.');
    process.exit(1);
  }
}

// Check if git is initialized
try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
} catch {
  console.log('⚡ Menginisialisasi git repository lokal...');
  try {
    execSync('git init', { stdio: 'ignore' });
  } catch {
    // Ignore if git not installed
  }
}

// Check remote origin
let remoteUrl = '';
try {
  remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
} catch {
  // Check if repo was passed as argument e.g. --repo=https://github.com/user/repo.git
  const repoArg = process.argv.find((arg) => arg.startsWith('--repo='));
  if (repoArg) {
    remoteUrl = repoArg.split('=')[1];
  }
}

if (!remoteUrl) {
  console.error('\n' + '='.repeat(60));
  console.error('❌ PERHATIAN: Remote GitHub Belum Terhubung');
  console.error('='.repeat(60));
  console.error('Perintah "npm run deploy" memerlukan URL repository GitHub Anda.');
  console.error('\nSilakan pilih salah satu cara berikut:');
  console.error('\n👉 CARA 1 (Rekomendasi - Jika di Komputer Lokal):');
  console.error('   1. Pastikan folder ini sudah dihubungkan ke GitHub:');
  console.error('      git remote add origin https://github.com/USERNAME/NAMA-REPO.git');
  console.error('   2. Jalankan kembali:');
  console.error('      npm run deploy');
  console.error('\n👉 CARA 2 (Menggunakan GitHub Actions Otomatis):');
  console.error('   Cukup push file ke GitHub:');
  console.error('      git add .');
  console.error('      git commit -m "Deploy update"');
  console.error('      git push origin main');
  console.error('   (File .github/workflows/deploy.yml sudah siap otomatis men-deploy)');
  console.error('\n👉 CARA 3 (Sebutkan URL Repository Langsung):');
  console.error('   npm run deploy -- --repo=https://github.com/USERNAME/NAMA-REPO.git');
  console.error('='.repeat(60) + '\n');
  process.exit(1);
}

try {
  console.log(`\n🚀 Memulai proses deploy ke GitHub Pages...`);
  console.log(`📌 Remote target: ${remoteUrl}`);
  execSync(`npx gh-pages -d dist --repo "${remoteUrl}"`, { stdio: 'inherit' });
  console.log('\n✅ DEPLOYMENT BERHASIL!');
  console.log('Buka repository GitHub Anda > Settings > Pages untuk melihat status web Anda.');
} catch (error) {
  console.error('\n❌ Deployment gagal dijalankan:', error.message || error);
  process.exit(1);
}
