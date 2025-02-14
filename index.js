const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const districtPublicationUrl = [
    { name: 'Ajung', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=ajung+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Ambulu', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=ambulu+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Arjasa', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=arjasa+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Balung', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=balung+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Bangsalsari', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=bangsalsari+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Gumuk Mas', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=gumukmas+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Jelbuk', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=jelbuk+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Jenggawah', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=jenggawah+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Jombang', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=jombang+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Kalisat', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=kalisat+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Kaliwates', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=kaliwates+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Kencong', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=kencong+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Ledokombo', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=ledokombo+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Mayang', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=mayang+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Mumbulsari', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=mumbulsari+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Pakusari', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=pakusari+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Panti', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=panti+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Patrang', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=patrang+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Puger', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=puger+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Rambipuji', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=rambipuji+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Semboro', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=semboro+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Silo', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=silo+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Sukorambi', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=sukorambi+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Sukowono', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=sukowono+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Sumber Baru', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=sumberbaru+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Sumberjambe', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=sumberjambe+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Sumbersari', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=sumbersari+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Tanggul', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=tanggul+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Tempurejo', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=tempurejo+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Umbulsari', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=umbulsari+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Wuluhan', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=wuluhan+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' }
];

const undiscoveredDistricts = [
    { name: 'Gumuk Mas', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=gumuk+mas+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
    { name: 'Sumber Baru', url: 'https://searchengine.web.bps.go.id/search?mfd=3509&q=sumber+baru+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi' },
]

const summary = [];

async function scrapeBPS() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    for (const district of districtPublicationUrl) {
        console.log(`Mengakses halaman pencarian untuk ${district.name}...`);
        await page.goto(district.url, { waitUntil: 'domcontentloaded' });

        // Ambil semua link publikasi dengan header yang sesuai
        const publications = await page.evaluate((districtName) => {
            return Array.from(document.querySelectorAll('h5.fw-medium.text-dark.mb-1')).map(header => {
                const title = header.innerText.trim();
                const linkElement = header.parentElement.querySelector('a.text-body-tertiary');
                return linkElement && new RegExp(`^Kecamatan ${districtName} Dalam Angka \\d{4}$`).test(title) 
                    ? { title, url: linkElement.href } 
                    : null;
            }).filter(item => item);
        }, district.name);

        console.log(`Ditemukan ${publications.length} publikasi untuk ${district.name}.`);

        // Buat folder untuk kecamatan
        const downloadFolder = path.join(__dirname, `${district.name}_dalam_angka_2020_2024`);
        if (!fs.existsSync(downloadFolder)) {
            fs.mkdirSync(downloadFolder, { recursive: true });
        }

        for (const { title, url } of publications) {
            console.log(`Mengakses publikasi: ${title}`);
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            // Cari tombol unduh PDF
            const pdfUrl = await page.evaluate(() => {
                const downloadBtn = document.querySelector('a.download-product');
                return downloadBtn ? downloadBtn.href : null;
            });

            if (pdfUrl) {
                const yearMatch = title.match(/\d{4}/);
                const year = yearMatch ? yearMatch[0] : 'unknown';
                const filename = `${district.name}_dalam_angka_${year}.pdf`;
                const filepath = path.join(downloadFolder, filename);

                console.log(`Mengunduh: ${filename}`);
                const fileSize = await downloadFile(pdfUrl, filepath);
                summary.push({ district: district.name, year, filename, fileSize });
            } else {
                console.log(`Tidak ditemukan tautan unduhan untuk ${title}.`);
            }
        }
    }

    await browser.close();
    generateSummary();
    console.log('Selesai!');
}

async function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        let fileSize = 0;
        https.get(url, response => {
            response.on('data', chunk => fileSize += chunk.length);
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(fileSize));
            });
        }).on('error', error => {
            fs.unlink(filepath, () => {});
            reject(error);
        });
    });
}

function generateSummary() {
    const summaryPathTxt = path.join(__dirname, 'summary.txt');
    const summaryPathCsv = path.join(__dirname, 'summary.csv');
    let totalFiles = summary.length;
    let totalSize = summary.reduce((sum, file) => sum + file.fileSize, 0);

    console.log('\nRingkasan Unduhan:');
    console.log(`Total File: ${totalFiles}`);
    console.log(`Total Ukuran: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    const txtContent = summary.map(s => `${s.district}, ${s.year}, ${s.filename}, ${(s.fileSize / 1024).toFixed(2)} KB`).join('\n');
    fs.writeFileSync(summaryPathTxt, `Total File: ${totalFiles}\nTotal Ukuran: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n\n${txtContent}`);

    const csvContent = `District,Year,Filename,Size (KB)\n` + summary.map(s => `${s.district},${s.year},${s.filename},${(s.fileSize / 1024).toFixed(2)}`).join('\n');
    fs.writeFileSync(summaryPathCsv, csvContent);
}

scrapeBPS().catch(console.error);


// const BASE_URL = 'https://searchengine.web.bps.go.id/search?mfd=3509&q=wuluhan+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi';
// const DOWNLOAD_FOLDER = path.join(__dirname, 'wuluhan dalam angka 2020 - 2024');

// if (!fs.existsSync(DOWNLOAD_FOLDER)) {
//     fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
// }

// async function scrapeBPS() {
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();

//     console.log('Mengakses halaman pencarian...');
//     await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

//     // Ambil semua link publikasi dengan header yang sesuai
//     const publications = await page.evaluate(() => {
//         return Array.from(document.querySelectorAll('h5.fw-medium.text-dark.mb-1')).map(header => {
//             const title = header.innerText.trim();
//             const linkElement = header.parentElement.querySelector('a.text-body-tertiary');
//             return linkElement ? { title, url: linkElement.href } : null;
//         }).filter(item => item && /^Kecamatan Wuluhan Dalam Angka \d{4}$/.test(item.title));
//     });

//     console.log(`Ditemukan ${publications.length} publikasi yang sesuai.`);

//     for (const { title, url } of publications) {
//         console.log(`Mengakses publikasi: ${title}`);
//         await page.goto(url, { waitUntil: 'domcontentloaded' });

//         // Cari tombol unduh PDF
//         const pdfUrl = await page.evaluate(() => {
//             const downloadBtn = document.querySelector('a.download-product');
//             return downloadBtn ? downloadBtn.href : null;
//         });

//         if (pdfUrl) {
//             const yearMatch = title.match(/\d{4}/);
//             const year = yearMatch ? yearMatch[0] : 'unknown';
//             const filename = `wuluhan dalam angka ${year}.pdf`;
//             const filepath = path.join(DOWNLOAD_FOLDER, filename);

//             console.log(`Mengunduh: ${filename}`);
//             await downloadFile(pdfUrl, filepath);
//         } else {
//             console.log(`Tidak ditemukan tautan unduhan untuk ${title}.`);
//         }
//     }

//     await browser.close();
//     console.log('Selesai!');
// }

// async function downloadFile(url, filepath) {
//     return new Promise((resolve, reject) => {
//         const file = fs.createWriteStream(filepath);
//         https.get(url, response => {
//             response.pipe(file);
//             file.on('finish', () => {
//                 file.close(resolve);
//             });
//         }).on('error', error => {
//             fs.unlink(filepath, () => {});
//             reject(error);
//         });
//     });
// }

// scrapeBPS().catch(console.error);