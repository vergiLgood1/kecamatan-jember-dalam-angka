const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const districts = [
    { id: 1, name: 'Ajung' },
    { id: 2, name: 'Ambulu' },
    { id: 3, name: 'Arjasa' },
    { id: 4, name: 'Balung' },
    { id: 5, name: 'Bangsalsari' },
    { id: 6, name: 'Gumuk mas' },
    { id: 7, name: 'Jelbuk' },
    { id: 8, name: 'Jenggawah' },
    { id: 9, name: 'Jombang' },
    { id: 10, name: 'Kalisat' },
    { id: 11, name: 'Kaliwates' },
    { id: 12, name: 'Kencong' },
    { id: 13, name: 'Ledokombo' },
    { id: 14, name: 'Mayang' },
    { id: 15, name: 'Mumbulsari' },
    { id: 16, name: 'Pakusari' },
    { id: 17, name: 'Panti' },
    { id: 18, name: 'Patrang' },
    { id: 19, name: 'Puger' },
    { id: 20, name: 'Rambipuji' },
    { id: 21, name: 'Semboro' },
    { id: 22, name: 'Silo' },
    { id: 23, name: 'Sukorambi' },
    { id: 24, name: 'Sukowono' },
    { id: 25, name: 'Sumber baru' },
    { id: 26, name: 'Sumberjambe' },
    { id: 27, name: 'Sumbersari' },
    { id: 28, name: 'Tanggul' },
    { id: 29, name: 'Tempurejo' },
    { id: 30, name: 'Umbulsari' },
    { id: 31, name: 'Wuluhan' }
];

const BASE_URL = (district) => {
   
    const formattedDistrict = district
        .toLowerCase()                
        .trim()                      
        .replace(/\s+/g, '+');       
    
    return `https://searchengine.web.bps.go.id/search?mfd=3509&q=${formattedDistrict}+dalam+angka&content=all&page=1&title=0&from=2020&to=2025&sort=relevansi`;
};

console.log(BASE_URL('Gumuk mas'));

const summary = [];

// Helper function untuk delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeBPS() {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);

        for (const district of districts) {
            try {
                const url = BASE_URL(district.name);
                console.log(`Mengakses halaman pencarian untuk ${district.name}...`);
                console.log(`URL: ${url}`);  // Added for debugging
                
                await page.goto(url, { 
                    waitUntil: ['domcontentloaded', 'networkidle0'],
                    timeout: 60000 
                });

                await delay(2000); // Menggunakan fungsi delay yang baru

                const publications = await page.evaluate((districtName) => {
                    // Remove any extra spaces from district name for comparison
                    const formattedDistrictName = districtName.replace(/\s+/g, ' ').trim();
                    
                    return Array.from(document.querySelectorAll('h5.fw-medium.text-dark.mb-1')).map(header => {
                        const title = header.innerText.trim();
                        const linkElement = header.parentElement.querySelector('a.text-body-tertiary');
                        return linkElement && new RegExp(`^Kecamatan ${formattedDistrictName} Dalam Angka \\d{4}$`, 'i').test(title) 
                        ? { title, url: linkElement.href } 
                        : null;
                    }).filter(item => item);
                }, district.name).catch(error => {
                    console.error(`Error saat mengekstrak data untuk ${district.name}:`, error);
                    return [];
                });
                

                console.log(`Ditemukan ${publications.length} publikasi untuk ${district.name}.`);

                const downloadFolder = path.join(__dirname, `${district.name} dalam angka 2020-2024`);
                if (!fs.existsSync(downloadFolder)) {
                    fs.mkdirSync(downloadFolder, { recursive: true });
                }

                for (const publication of publications) {
                    try {
                        console.log(`Mengakses publikasi: ${publication.title}`);
                        await page.goto(publication.url, { 
                            waitUntil: ['domcontentloaded', 'networkidle0'],
                            timeout: 60000 
                        });

                        await delay(2000); // Menggunakan fungsi delay yang baru

                        const pdfUrl = await page.evaluate(() => {
                            const downloadBtn = document.querySelector('a.download-product');
                            return downloadBtn ? downloadBtn.href : null;
                        });

                        if (pdfUrl) {
                            const yearMatch = publication.title.match(/\d{4}/);
                            const year = yearMatch ? yearMatch[0] : 'unknown';
                            const filename = `${district.name} dalam angka ${year}.pdf`;
                            const filepath = path.join(downloadFolder, filename);

                            console.log(`Mengunduh: ${filename}`);
                            const fileSize = await downloadFile(pdfUrl, filepath);
                            summary.push({ district: district.name, year, filename, fileSize });
                            
                            await delay(1000); // Menggunakan fungsi delay yang baru
                        } else {
                            console.log(`Tidak ditemukan tautan unduhan untuk ${publication.title}.`);
                        }
                    } catch (error) {
                        console.error(`Error saat memproses publikasi ${publication.title}:`, error);
                        continue;
                    }
                }
            } catch (error) {
                console.error(`Error saat memproses kecamatan ${district.name}:`, error);
                continue;
            }
        }
    } finally {
        await browser.close();
        generateSummary();
        console.log('Selesai!');
    }
}

async function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        let fileSize = 0;

        https.get(url, response => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => {});
                reject(new Error(`Server responded with status code: ${response.statusCode}`));
                return;
            }

            response.on('data', chunk => fileSize += chunk.length);
            response.pipe(file);
            
            file.on('finish', () => {
                file.close(() => resolve(fileSize));
            });

            file.on('error', error => {
                fs.unlink(filepath, () => {});
                reject(error);
            });
        }).on('error', error => {
            fs.unlink(filepath, () => {});
            reject(error);
        });
    });
}

function generateSummary() {
    const summaryPathTxt = path.join(__dirname, 'downloads/summary.txt');
    const summaryPathCsv = path.join(__dirname, 'downloads/summary.csv');
    
    // Pastikan folder downloads ada
    if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
        fs.mkdirSync(path.join(__dirname, 'downloads'), { recursive: true });
    }

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

scrapeBPS().catch(error => {
    console.error('Error utama:', error);
    process.exit(1);
});