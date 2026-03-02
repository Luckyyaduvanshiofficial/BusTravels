'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Settings,
  DollarSign,
  Users,
  Shield,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_TIER_LABELS,
  SUBSCRIPTION_TIER_PRICES,
} from '@/lib/constants/subscription-tiers';

interface PlatformSettings {
  platform_name: string;
  support_email: string;
  support_phone: string;
  default_commission_rate: string;
  commission_free: string;
  commission_pro: string;
  commission_enterprise: string;
  max_passengers: string;
  cancellation_window_hours: string;
  auto_approve_operators: string;
  auto_approve_buses: string;
  maintenance_mode: string;
  booking_enabled: string;
  [key: string]: string;
}

type SettingsTab = 'general' | 'commission' | 'operations' | 'notifications';

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'commission', label: 'Commission', icon: DollarSign },
  { id: 'operations', label: 'Operations', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const SKELETON_TAB_KEYS = [
  'skeleton-tab-1',
  'skeleton-tab-2',
  'skeleton-tab-3',
  'skeleton-tab-4',
];

const SKELETON_FIELD_KEYS = [
  'skeleton-field-1',
  'skeleton-field-2',
  'skeleton-field-3',
  'skeleton-field-4',
];

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {SKELETON_TAB_KEYS.map((key) => (
          <Skeleton key={key} className="h-10 w-32" />
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          {SKELETON_FIELD_KEYS.map((key) => (
            <div key={key} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [source, setSource] = useState<string>('');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSettings(data.settings);
      setOriginalSettings(data.settings);
      setSource(data.source);
    } catch {
      // Use defaults on error
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const hasChanges = settings && originalSettings
    ? JSON.stringify(settings) !== JSON.stringify(originalSettings)
    : false;

  function updateSetting(key: string, value: string) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  function toggleSetting(key: string) {
    if (!settings) return;
    const current = settings[key] === 'true';
    setSettings({ ...settings, [key]: String(!current) });
  }

  function resetSettings() {
    if (originalSettings) {
      setSettings({ ...originalSettings });
      setSaveStatus('idle');
    }
  }

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    setSaveStatus('idle');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveStatus('error');
        setSaveMessage(data.error || 'Failed to save');
        return;
      }

      if (data.persisted) {
        setSaveStatus('success');
        setSaveMessage('Settings saved successfully');
      } else {
        setSaveStatus('warning');
        setSaveMessage('Settings acknowledged but not persisted — database table not yet provisioned');
      }

      setOriginalSettings({ ...settings });
    } catch {
      setSaveStatus('error');
      setSaveMessage('Network error — could not save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Configure platform behavior and policies</p>
        </div>
        <SettingsSkeleton />
      </div>
    );
  }

  if (!settings) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load settings. Please try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure platform behavior and policies
            {source === 'defaults' && (
              <Badge variant="outline" className="ml-2 text-xs">Using Defaults</Badge>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            disabled={!hasChanges || saving}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={saveSettings}
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Save Status Alert */}
      {saveStatus === 'success' && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}
      {saveStatus === 'warning' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Partial Save</AlertTitle>
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}
      {saveStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <GeneralSettings settings={settings} onUpdate={updateSetting} />
      )}
      {activeTab === 'commission' && (
        <CommissionSettings settings={settings} onUpdate={updateSetting} />
      )}
      {activeTab === 'operations' && (
        <OperationsSettings
          settings={settings}
          onUpdate={updateSetting}
          onToggle={toggleSetting}
        />
      )}
      {activeTab === 'notifications' && <NotificationSettings />}
    </div>
  );
}

/* ─── General Settings ─── */
function GeneralSettings({
  settings,
  onUpdate,
}: Readonly<{
  settings: PlatformSettings;
  onUpdate: (key: string, value: string) => void;
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          General Settings
        </CardTitle>
        <CardDescription>
          Basic platform configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="platform_name">Platform Name</Label>
            <Input
              id="platform_name"
              value={settings.platform_name}
              onChange={(e) => onUpdate('platform_name', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Displayed in the header and emails
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support_email">Support Email</Label>
            <Input
              id="support_email"
              type="email"
              value={settings.support_email}
              onChange={(e) => onUpdate('support_email', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Contact email shown to users
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support_phone">Support Phone</Label>
            <Input
              id="support_phone"
              type="tel"
              value={settings.support_phone}
              onChange={(e) => onUpdate('support_phone', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Commission Settings ─── */
function CommissionSettings({
  settings,
  onUpdate,
}: Readonly<{
  settings: PlatformSettings;
  onUpdate: (key: string, value: string) => void;
}>) {
  const tiers = [
    {
      key: 'commission_free',
      tier: SUBSCRIPTION_TIERS.FREE,
      price: SUBSCRIPTION_TIER_PRICES[SUBSCRIPTION_TIERS.FREE],
    },
    {
      key: 'commission_pro',
      tier: SUBSCRIPTION_TIERS.PRO,
      price: SUBSCRIPTION_TIER_PRICES[SUBSCRIPTION_TIERS.PRO],
    },
    {
      key: 'commission_enterprise',
      tier: SUBSCRIPTION_TIERS.ENTERPRISE,
      price: SUBSCRIPTION_TIER_PRICES[SUBSCRIPTION_TIERS.ENTERPRISE],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Commission Rates
          </CardTitle>
          <CardDescription>
            Platform commission percentage charged on each booking per subscription tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="default_commission_rate">Default Commission Rate (%)</Label>
            <Input
              id="default_commission_rate"
              type="number"
              min="0"
              max="100"
              value={settings.default_commission_rate}
              onChange={(e) => onUpdate('default_commission_rate', e.target.value)}
              className="max-w-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              Applied when no tier-specific rate is set
            </p>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            {tiers.map(({ key, tier, price }) => (
              <Card key={key} className="border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {SUBSCRIPTION_TIER_LABELS[tier]}
                    </CardTitle>
                    <Badge variant={tier === 'enterprise' ? 'default' : 'secondary'}>
                      {price === 0 ? 'Free' : `₹${price}/mo`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={key}>Commission (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={key}
                        type="number"
                        min="0"
                        max="100"
                        value={settings[key]}
                        onChange={(e) => onUpdate(key, e.target.value)}
                        className="max-w-[120px]"
                      />
                      <span className="text-muted-foreground text-sm">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Preview */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Revenue Preview</CardTitle>
          <CardDescription>
            Estimated commission per ₹10,000 booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {tiers.map(({ key, tier }) => {
              const rate = Number(settings[key]) || 0;
              const commission = (10000 * rate) / 100;
              return (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                  <span className="text-sm font-medium">{SUBSCRIPTION_TIER_LABELS[tier]}</span>
                  <span className="font-mono text-sm font-semibold">
                    ₹{commission.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Operations Settings ─── */
function OperationsSettings({
  settings,
  onUpdate,
  onToggle,
}: Readonly<{
  settings: PlatformSettings;
  onUpdate: (key: string, value: string) => void;
  onToggle: (key: string) => void;
}>) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Booking &amp; Capacity
          </CardTitle>
          <CardDescription>
            Control booking behavior and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max_passengers">Max Passengers per Booking</Label>
              <Input
                id="max_passengers"
                type="number"
                min="1"
                max="200"
                value={settings.max_passengers}
                onChange={(e) => onUpdate('max_passengers', e.target.value)}
                className="max-w-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellation_window_hours">Cancellation Window (hours)</Label>
              <Input
                id="cancellation_window_hours"
                type="number"
                min="0"
                max="168"
                value={settings.cancellation_window_hours}
                onChange={(e) => onUpdate('cancellation_window_hours', e.target.value)}
                className="max-w-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Hours before trip when customers can still cancel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Approvals &amp; Access
          </CardTitle>
          <CardDescription>
            Manage automatic approvals and platform access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Auto-approve Operators</Label>
              <p className="text-xs text-muted-foreground">
                New operators are approved automatically without admin review
              </p>
            </div>
            <Switch
              checked={settings.auto_approve_operators === 'true'}
              onCheckedChange={() => onToggle('auto_approve_operators')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Auto-approve Buses</Label>
              <p className="text-xs text-muted-foreground">
                New buses listed by operators are approved automatically
              </p>
            </div>
            <Switch
              checked={settings.auto_approve_buses === 'true'}
              onCheckedChange={() => onToggle('auto_approve_buses')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Booking Enabled</Label>
              <p className="text-xs text-muted-foreground">
                Allow customers to create new bookings
              </p>
            </div>
            <Switch
              checked={settings.booking_enabled === 'true'}
              onCheckedChange={() => onToggle('booking_enabled')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label>Maintenance Mode</Label>
                <Badge variant="destructive" className="text-xs">Caution</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, only admins can access the platform
              </p>
            </div>
            <Switch
              checked={settings.maintenance_mode === 'true'}
              onCheckedChange={() => onToggle('maintenance_mode')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Notification Settings (placeholder) ─── */
function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure email and push notification triggers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label>New Booking Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Send email to admin when a new booking is created
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label>Operator Registration Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Notify admin when a new operator registers
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label>Cancellation Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Notify admin when a booking is cancelled
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label>Payment Failure Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Notify admin on failed payment attempts
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Separator />

        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            Email and push notification integrations are under development. 
            Toggle states will be saved once the notification service is connected.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
