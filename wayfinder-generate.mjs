import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const php = process.env.PHP_BINARY || 'php';

let phpAvailable = false;
try {
    execFileSync(php, ['-v'], { stdio: 'ignore' });
    phpAvailable = true;
} catch {
    phpAvailable = false;
}

if (phpAvailable) {
    execFileSync(php, ['artisan', 'wayfinder:generate', '--with-form'], {
        stdio: 'inherit',
        env: {
            ...process.env,
            DB_DATABASE: ':memory:',
        },
    });
} else {
    process.stdout.write('PHP is not available in current environment. Using existing Wayfinder routes.\n');
}

const helperPath = resolve('resources/js/wayfinder/index.ts');
if (existsSync(helperPath)) {
    const source = readFileSync(helperPath, 'utf8');
    const generatedMethodType =
        'type Method = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";';
    const compatibleMethodType =
        'type Method = "get" | "post" | "put" | "delete" | "patch" | "head" | "options" | "query";';

    if (source.includes(generatedMethodType)) {
        writeFileSync(helperPath, source.replace(generatedMethodType, compatibleMethodType));
        process.stdout.write('Wayfinder helper patched for generated query route types.\n');
    }
}
