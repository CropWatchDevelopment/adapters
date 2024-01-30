"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
// Create a single supabase client for interacting with your database
exports.supabase = (0, supabase_js_1.createClient)(process.env.PUBLIC_SUPABASE_URL || '', process.env.PUBLIC_SUPABASE_ANON_KEY || '');
//# sourceMappingURL=supabaseClient.js.map