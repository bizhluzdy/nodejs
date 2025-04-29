"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const autocomplete_1 = require("./autocomplete");
const dataPath = path_1.default.join(__dirname, 'data.json');
let data = [];
let lastModified = fs_1.default.statSync(dataPath).mtime.toUTCString();
data = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const autoComplete = (0, autocomplete_1.createAutoComplete)(data);
const server = http_1.default.createServer((req, res) => {
    const parsedUrl = url_1.default.parse(req.url ?? '', true);
    const method = req.method ?? 'GET';
    if (method === 'GET' && parsedUrl.pathname === '/') {
        const query = parsedUrl.query;
        const word = query.complete || '';
        const ifModifiedSince = req.headers['if-modified-since'];
        if (ifModifiedSince &&
            new Date(ifModifiedSince).getTime() >= new Date(lastModified).getTime()) {
            res.writeHead(304);
            res.end();
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.setHeader('Last-Modified', lastModified);
        const suggestions = autoComplete(word);
        res.writeHead(200);
        res.end(JSON.stringify(suggestions));
        return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server started");
});
