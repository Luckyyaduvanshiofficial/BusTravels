import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Platform settings – stored in a simple key/value table when available,
// otherwise falls back to hardcoded defaults.
const DEFAULTS: Record<string, string> = {
  platform_name: 'Bus Booking Platform',
  support_email: 'support@busbooking.com',
  support_phone: '+91-1800-123-4567',
  default_commission_rate: '10',
  commission_free: '15',
  commission_pro: '10',
  commission_enterprise: '5',
  max_passengers: '60',
  cancellation_window_hours: '24',
  auto_approve_operators: 'false',
  auto_approve_buses: 'false',
  maintenance_mode: 'false',
  booking_enabled: 'true',
};

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('supabase_uid', user.id)
      .single();

    if (dbUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Try to read from platform_settings table
    const { data: settings, error } = await supabase
      .from('platform_settings')
      .select('key, value');

    if (error) {
      // Table doesn't exist yet – return defaults
      return NextResponse.json({ settings: DEFAULTS, source: 'defaults' });
    }

    // Merge DB settings over defaults
    const merged = { ...DEFAULTS };
    for (const row of settings) {
      merged[row.key] = row.value;
    }

    return NextResponse.json({ settings: merged, source: 'database' });
  } catch (err) {
    console.error('Settings GET error:', err);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('supabase_uid', user.id)
      .single();

    if (dbUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json() as Record<string, string>;

    // Try to upsert into platform_settings
    const upsertRows = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('platform_settings')
      .upsert(upsertRows, { onConflict: 'key' });

    if (error) {
      // Table may not exist — return success with warning
      return NextResponse.json({
        message: 'Settings acknowledged (table not yet provisioned)',
        settings: body,
        persisted: false,
      });
    }

    return NextResponse.json({
      message: 'Settings saved successfully',
      settings: body,
      persisted: true,
    });
  } catch (err) {
    console.error('Settings PUT error:', err);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 },
    );
  }
}
