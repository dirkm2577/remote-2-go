"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupabaseConfigured = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// Debug: Uncomment for troubleshooting
// console.log('Supabase URL:', supabaseUrl)
// console.log('Supabase Key exists:', !!supabaseKey)
// console.log('Supabase Key length:', supabaseKey?.length)
// For development, allow the backend to work without Supabase configuration
exports.supabase = supabaseUrl && supabaseKey
    ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey)
    : null;
const isSupabaseConfigured = () => Boolean(exports.supabase);
exports.isSupabaseConfigured = isSupabaseConfigured;
//# sourceMappingURL=supabase.js.map