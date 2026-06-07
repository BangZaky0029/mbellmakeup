import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// SHA-256 hash of developer access code — plain text NOT stored here
// Verified via Web Crypto API at runtime
// ─────────────────────────────────────────────────────────────────────────────
const EXPECTED_HASH = 'd7879b1949e8685589b911facb2a539c21ac4606fecabf910356ceacc3094a82';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type LicenseStatus =
  | 'loading'
  | 'active'
  | 'inactive'   // is_active = false di Supabase
  | 'expired'    // is_active = true tapi expires_at sudah lewat
  | 'error';

export interface LicenseData {
  status: LicenseStatus;
  expiresAt: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Check license status — no cache, always real-time from Supabase
// ─────────────────────────────────────────────────────────────────────────────
export async function checkLicenseStatus(): Promise<LicenseData> {
  try {
    const { data, error } = await supabase
      .from('site_license')
      .select('is_active, expires_at')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('[SiteGuard] Failed to fetch license:', error?.message);
      return { status: 'error', expiresAt: null };
    }

    if (!data.is_active) {
      return { status: 'inactive', expiresAt: data.expires_at };
    }

    if (!data.expires_at) {
      return { status: 'inactive', expiresAt: null };
    }

    const expiry = new Date(data.expires_at);
    const now = new Date();

    if (now > expiry) {
      return { status: 'expired', expiresAt: data.expires_at };
    }

    return { status: 'active', expiresAt: data.expires_at };
  } catch (err) {
    console.warn('[SiteGuard] Unexpected error:', err);
    return { status: 'error', expiresAt: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Verify developer password via SHA-256 hash comparison
// ─────────────────────────────────────────────────────────────────────────────
export async function verifyAccessCode(input: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex === EXPECTED_HASH;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Activate license for 30 days — called after password verified or
// manually set from Supabase dashboard
// ─────────────────────────────────────────────────────────────────────────────
export async function activateLicense(): Promise<boolean> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 hari

    const { error } = await supabase
      .from('site_license')
      .update({
        is_active: true,
        activated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', 1);

    if (error) {
      console.error('[SiteGuard] Activation failed:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[SiteGuard] Activation error:', err);
    return false;
  }
}
