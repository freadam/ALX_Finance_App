// local api
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";
// remote api
// const api = "https://api.example.com/";

// api endpoints
export const budgets = "budgets/progress";
export const categories = "categories/";
export const transactions = "transactions/";
export const transactionsSummary = "transactions/summary/";
export const forecast13week = "forecasts/summary13week/";