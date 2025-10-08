import fs from "node:fs/promises";

const manifest = `{
	"url": "${import.meta.env.VITE_APP_BASE_URL}",
	"name": "${import.meta.env.VITE_PROJECT_NAME}",
	"iconUrl": "${import.meta.env.VITE_APP_BASE_URL}/tonconnect-icon.png"
}`;

if (!(await fs.exists(`${__dirname}/../dist/`))) {
	await fs.mkdir(`${__dirname}/../dist/`);
}

await fs.writeFile(`${__dirname}/../dist/tonconnect-manifest.json`, manifest);
