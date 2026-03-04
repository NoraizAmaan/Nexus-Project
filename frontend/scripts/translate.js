import fs from 'fs';
import path from 'path';
import { translate } from 'google-translate-api-x';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const SOURCE_FILE = 'en.json';

async function translateWithRetry(text, targetLang, retries = 3) {
    // Add a small delay between requests to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < retries; i++) {
        try {
            const res = await translate(text, { to: targetLang });
            return res.text;
        } catch (err) {
            if (i === retries - 1) throw err;
            console.log(`Retrying translation for "${text}" to ${targetLang}... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000)); // Exponential backoff
        }
    }
    throw new Error(`Failed to translate "${text}" after ${retries} retries.`);
}

async function translateObject(obj, targetLang) {
    const result = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = await translateObject(obj[key], targetLang);
        } else {
            try {
                console.log(`Translating: "${obj[key]}" to ${targetLang}...`);
                // Handle i18next interpolation variables like {{count}}
                result[key] = await translateWithRetry(obj[key], targetLang);
            } catch (err) {
                console.error(`Error translating "${obj[key]}":`, err.message);
                result[key] = obj[key]; // Fallback to source
            }
        }
    }
    return result;
}

/**
 * Deep merge source into target only for missing keys
 */
async function syncAndTranslate(source, target, targetLang) {
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = Array.isArray(source[key]) ? [] : {};
            }
            await syncAndTranslate(source[key], target[key], targetLang);
        } else {
            if (!target[key]) {
                try {
                    console.log(`[${targetLang}] Translating missing key: "${source[key]}"`);
                    target[key] = await translateWithRetry(source[key], targetLang);
                } catch (err) {
                    console.error(`Error translating:`, err.message);
                    target[key] = source[key];
                }
            }
        }
    }
}

async function run() {
    try {
        const sourcePath = path.join(LOCALES_DIR, SOURCE_FILE);
        const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

        const files = fs.readdirSync(LOCALES_DIR);

        for (const file of files) {
            if (file === SOURCE_FILE || !file.endsWith('.json')) continue;

            const langCode = file.replace('.json', '');
            const filePath = path.join(LOCALES_DIR, file);

            let targetData = {};
            if (fs.existsSync(filePath)) {
                try {
                    targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (e) {
                    targetData = {};
                }
            }

            console.log(`\n--- Processing ${file} ---`);
            await syncAndTranslate(sourceData, targetData, langCode);

            fs.writeFileSync(filePath, JSON.stringify(targetData, null, 2), 'utf8');
            console.log(`Finished updating ${file}`);
        }

        console.log('\n✅ All translations synchronized successfully.');
    } catch (err) {
        console.error('Translation process failed:', err);
    }
}

run();
