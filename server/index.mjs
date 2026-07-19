import path from "node:path";
import { loadConfig, projectRoot } from "./config.mjs";
import { SqliteAssetStore } from "./sqlite-store.mjs";
import { AssetService } from "./asset-service.mjs";
import { createApp } from "./app.mjs";

const config = loadConfig();
const store = new SqliteAssetStore({
    databasePath: config.databasePath,
    schemaPath: path.join(projectRoot, "database", "library_schema.sqlite.sql")
});
const service = new AssetService(store);
const server = createApp({ config, service });

server.listen(config.port, config.host, () => {
    console.log(`Technical Asset Library: http://${config.host}:${config.port}/team_technical_assets_library.html`);
    console.log(`Reviewer queue: http://${config.host}:${config.port}/team_technical_assets_reviews.html`);
    console.log(`Database: ${config.databasePath}`);
});

function shutdown() {
    server.close(() => {
        store.close();
        process.exit(0);
    });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
