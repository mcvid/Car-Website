// lib/supabase.js
// Supabase configuration
const supabaseUrl = "https://ijjwzplbkbletuhhwboa.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqand6cGxia2JsZXR1aGh3Ym9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDI5NTMsImV4cCI6MjA4MTcxODk1M30.ECuQ9nEYv7bsaSmu2Nac1qL56wK2hkPO8FDyTKE8DIM";

// Initialize the Supabase client
// For browser usage, we assume the Supabase CDN script is loaded in HTML
const _supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Make it globally available
window.supabase = _supabaseClient;
var supabase = _supabaseClient; // Use var to make it globally accessible
