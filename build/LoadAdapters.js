"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadAdapters = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class LoadAdapters {
    constructor(baseDir = './src/adapters') {
        this.baseDir = baseDir;
        this.adapterStore = {};
        this.loadAdapters();
    }
    loadAdapters() {
        fs.readdirSync(this.baseDir, { withFileTypes: true }).forEach(companyDir => {
            if (companyDir.isDirectory()) {
                const companyPath = path.join(this.baseDir, companyDir.name);
                this.adapterStore[companyDir.name] = {};
                fs.readdirSync(companyPath, { withFileTypes: true }).forEach(productDir => {
                    if (productDir.isDirectory()) {
                        const productPath = path.join(companyPath, productDir.name);
                        this.adapterStore[companyDir.name][productDir.name] = {};
                        fs.readdirSync(productPath, { withFileTypes: true }).forEach((versionDir) => __awaiter(this, void 0, void 0, function* () {
                            if (versionDir.isDirectory()) {
                                const versionPath = path.join(productPath, versionDir.name);
                                const adapterPath = `${__dirname}/adapters/${companyDir.name}/${productDir.name}/${versionDir.name}/`;
                                fs.readdir(adapterPath, (err, files) => {
                                    files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                                        console.log(file);
                                        console.log("Current directory:", __dirname);
                                        if (!file.includes('.map')) {
                                            const withFileName = `${adapterPath}${file}`;
                                            const AdapterClass = require(withFileName).default; // Assuming each version directory has a default export of the adapter class
                                            this.adapterStore[companyDir.name][productDir.name][versionDir.name] = new AdapterClass();
                                        }
                                    }));
                                });
                            }
                        }));
                    }
                });
            }
        });
    }
    getAdapter(company, product, version) {
        var _a, _b;
        return ((_b = (_a = this.adapterStore[company]) === null || _a === void 0 ? void 0 : _a[product]) === null || _b === void 0 ? void 0 : _b[version]) || null;
    }
}
exports.LoadAdapters = LoadAdapters;
//# sourceMappingURL=LoadAdapters.js.map