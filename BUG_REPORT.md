# Bug Report: UptimeRobot Monitoring System
**Generated:** January 12, 2026  
**Status:** Comprehensive Analysis Complete

---

## Executive Summary
This report identifies **15 bugs** across the UptimeRobot application, categorized by severity. The most critical issue is a **TypeScript compilation error** that prevents production builds from succeeding.

---

## 🔴 Critical Bugs (3)

### BUG-001: TypeScript Compilation Failure in SystemSettingsForm
**Severity:** Critical  
**Status:** Prevents Production Build  
**Location:** [`src/app/settings/page.tsx:22`](file:///home/ubuntu/UptimeRobot/src/app/settings/page.tsx#L22)

**Description:**  
Type mismatch when passing `systemSettings` to `SystemSettingsForm`. The database schema includes `lastMonitoringPulse` field, but the form component's type definition doesn't include it.

**Error Message:**
```
Type '{ id: string; ... lastMonitoringPulse: Date | null; }' is not assignable to type 
'{ defaultInterval: number; ... socialFacebook?: string | undefined; }'
```

**Impact:** Build fails completely; cannot deploy to production.

**Fix:**
Update [`SystemSettingsForm`](file:///home/ubuntu/UptimeRobot/src/components/settings/system-form.tsx#L27-L29) to accept all database fields or explicitly exclude `lastMonitoringPulse` when passing data:

```tsx
// Option 1: Exclude the field
<SystemSettingsForm initialData={systemSettings ? {
  defaultInterval: systemSettings.defaultInterval,
  defaultTimeout: systemSettings.defaultTimeout,
  // ... other fields
} : null} />

// Option 2: Update interface to accept it
interface SystemSettingsFormProps {
  initialData?: (SystemSettingsFormValues & { 
    id?: string;
    updatedAt?: Date;
    lastMonitoringPulse?: Date | null;
  }) | null;
}
```

---

### BUG-002: Monitoring Engine Not Checking on Schedule
**Severity:** Critical  
**Status:** Core Functionality Broken  
**Location:** Entire monitoring system

**Description:**  
Users report that monitors show stale "Last Check" times (e.g., showing 02:54 when current time is 03:05). The monitoring engine process is running, but the database is not being updated in real-time.

**Root Cause:**  
The cron job in [`monitoring-server.ts`](file:///home/ubuntu/UptimeRobot/src/monitoring-server.ts#L9) runs every minute, but there's a potential timezone mismatch or the process might be crashing silently.

**Evidence:**
- Database query shows: `Last Check: 2026-01-09T21:36:02.320Z`
- User's local time: `03:05` (IST +5:30)
- Converted DB time: `03:06:02` IST
- UI shows: `02:54:02` (12 minutes behind)

**Fix:**
1. Add error logging to [`monitoring-server.ts`](file:///home/ubuntu/UptimeRobot/src/monitoring-server.ts#L35)
2. Implement process monitoring and auto-restart with PM2
3. Add database connection health checks

---

### BUG-003: Missing Error Boundary for Client Components
**Severity:** Critical  
**Status:** Application Can Crash Without Recovery  
**Location:** [`src/app/layout.tsx`](file:///home/ubuntu/UptimeRobot/src/app/layout.tsx)

**Description:**  
No global error boundary to catch React component errors. If any client component crashes, the entire application becomes unresponsive.

**Impact:** Poor user experience; requires full page reload to recover.

**Fix:**
Add error boundary component:
```tsx
// src/components/error-boundary.tsx
'use client';
export default function ErrorBoundary({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
```

---

## 🟠 High Priority Bugs (5)

### BUG-004: Primitive `alert()` Used for User Feedback
**Severity:** High  
**Status:** Poor UX  
**Locations:** 9 files

Browser `alert()` is used instead of proper toast notifications:
- [`notification-toggle.tsx:17`](file:///home/ubuntu/UptimeRobot/src/components/layout/notification-toggle.tsx#L17)
- [`smtp-form.tsx:47,50`](file:///home/ubuntu/UptimeRobot/src/components/settings/smtp-form.tsx#L47)
- [`system-form.tsx:59,62`](file:///home/ubuntu/UptimeRobot/src/components/settings/system-form.tsx#L59)
- [`monitor-form.tsx:66,81`](file:///home/ubuntu/UptimeRobot/src/components/monitors/monitor-form.tsx#L66)
- [`page-content-form.tsx:21,24`](file:///home/ubuntu/UptimeRobot/src/components/dashboard/page-content-form.tsx#L21)

**Impact:** Unprofessional user experience; blocks UI interaction.

**Fix:**
Implement a toast notification system (e.g., `sonner`, `react-hot-toast`):
```tsx
import { toast } from 'sonner';
// Replace alert() with:
toast.success("Settings saved successfully");
toast.error("Failed to save settings");
```

---

### BUG-005: Production Code Contains Debug Logs
**Severity:** High  
**Status:** Performance & Security Issue  
**Locations:** 7 files

Multiple `console.log` statements in production code:
- [`monitoring-server.ts`](file:///home/ubuntu/UptimeRobot/src/monitoring-server.ts): Lines 6, 10, 30, 41, 50
- [`auto-refresh.tsx:11`](file:///home/ubuntu/UptimeRobot/src/components/layout/auto-refresh.tsx#L11)
- [`notification-listener.tsx:17`](file:///home/ubuntu/UptimeRobot/src/components/layout/notification-listener.tsx#L17)

**Impact:**  
- Performance overhead in production
- Potential information leakage to browser console
- Cluttered browser console for users

**Fix:**
1. Replace with proper logging library (e.g., `pino`, `winston`)
2. Use environment-based logging:
```ts
const isDev = process.env.NODE_ENV === 'development';
if (isDev) console.log('[Debug]', message);
```

---

### BUG-006: Weak Default Password in Seed Script
**Severity:** High  
**Status:** Security Vulnerability  
**Location:** [`prisma/seed.ts:7`](file:///home/ubuntu/UptimeRobot/prisma/seed.ts#L7)

**Description:**  
Default super admin password `123@HelloS` is hardcoded and publicly visible in the seed script.

**Impact:**  
- Security breach if default password not changed
- Password visible in repository/documentation

**Fix:**
1. Generate random password on first seed
2. Force password change on first login
3. Log credentials to console only (not in code)

---

### BUG-007: Missing Input Sanitization in Monitor Form
**Severity:** High  
**Status:** XSS Vulnerability  
**Location:** [`components/monitors/monitor-form.tsx`](file:///home/ubuntu/UptimeRobot/src/components/monitors/monitor-form.tsx)

**Description:**  
Monitor name, URL, and custom headers are not sanitized before storage or display.

**Impact:** Potential XSS attacks if malicious scripts are entered.

**Fix:**
```tsx
import DOMPurify from 'isomorphic-dompurify';
// Sanitize inputs before storage
const sanitizedName = DOMPurify.sanitize(data.name);
```

---

### BUG-008: Email Template Uses `process.env.NEXTAUTH_URL` Without Fallback
**Severity:** High  
**Status:** Broken Links in Production  
**Location:** [`lib/email.ts:86,106,121,135`](file:///home/ubuntu/UptimeRobot/src/lib/email.ts#L86)

**Description:**  
Email links are constructed using `process.env.NEXTAUTH_URL`, which may be undefined in some environments.

**Impact:** Broken links in alert emails.

**Fix:**
```ts
const baseUrl = process.env.NEXTAUTH_URL || 'https://yourdomain.com';
<a href="${baseUrl}/monitors/${monitor.id}">View Monitor Details</a>
```

---

## 🟡 Medium Priority Bugs (4)

### BUG-009: Inconsistent Role Handling in Auth Helpers
**Severity:** Medium  
**Status:** Logic Redundancy  
**Location:** [`lib/auth-helpers.ts:12-18`](file:///home/ubuntu/UptimeRobot/src/lib/auth-helpers.ts#L12-L18)

**Description:**  
In `canAccessMonitor()`, lines 12-14 handle `MANAGER`/`USER` ownership, but line 17 checks assignments for the same roles redundantly.

**Impact:** Confusing code logic; potential for bugs in future modifications.

**Fix:**
Simplify logic:
```ts
if (user.role === 'MANAGER' || user.role === 'USER') {
  return monitor.userId === user.id || 
         monitor.assignments?.some(a => a.userId === user.id) ?? false;
}
```

---

### BUG-010: Missing Null Check in Notification Listener
**Severity:** Medium  
**Status:** Potential Runtime Error  
**Location:** [`components/layout/notification-listener.tsx:26-58`](file:///home/ubuntu/UptimeRobot/src/components/layout/notification-listener.tsx#L26-L58)

**Description:**  
`data.newIncident` is accessed without checking if `data.newIncident.monitor` exists.

**Impact:** Runtime error if incident data is malformed.

**Fix:**
```tsx
if (data.newIncident?.monitor?.name) {
  // Safe to access
}
```

---

### BUG-011: No Loading State for "Check Now" Button
**Severity:** Medium  
**Status:** Poor UX  
**Location:** [`app/monitors/[id]/page.tsx:58-66`](file:///home/ubuntu/UptimeRobot/src/app/monitors/%5Bid%5D/page.tsx#L58-L66)

**Description:**  
"Check Now" button doesn't show loading state while check is in progress.

**Impact:** Users may click multiple times, creating duplicate checks.

**Fix:**
Convert to client component with loading state:
```tsx
const [isChecking, setIsChecking] = useState(false);
<button disabled={isChecking}>
  {isChecking ? 'Checking...' : 'Check Now'}
</button>
```

---

### BUG-012: Hardcoded Alert Cooldown Period
**Severity:** Medium  
**Status:** Not Configurable  
**Location:** [`lib/email.ts:57`](file:///home/ubuntu/UptimeRobot/src/lib/email.ts#L57)

**Description:**  
Alert cooldown is hardcoded to 5 minutes; not configurable per monitor or globally.

**Impact:** Users cannot adjust alert frequency.

**Fix:**
Add `alertCooldown` field to `SystemSettings` or `Monitor` schema.

---

## 🟢 Low Priority Bugs (3)

### BUG-013: Console Warning for `console.warn` in Production
**Severity:** Low  
**Status:** Minor Issue  
**Location:** [`lib/email.ts:11`](file:///home/ubuntu/UptimeRobot/src/lib/email.ts#L11)

**Description:**  
Uses `console.warn` which should be replaced with proper logging.

**Fix:** Replace with structured logging.

---

### BUG-014: Missing Favicon Reference Validation
**Severity:** Low  
**Status:** 404 Error in Browser  
**Location:** [`components/layout/notification-listener.tsx:33`](file:///home/ubuntu/UptimeRobot/src/components/layout/notification-listener.tsx#L33)

**Description:**  
References `/favicon.svg` without verifying it exists.

**Impact:** Browser 404 error; notification icon missing.

**Fix:** Verify file exists or use base64 encoded icon.

---

### BUG-015: Potential Memory Leak in Auto-Refresh
**Severity:** Low  
**Status:** Resource Management Issue  
**Location:** [`components/layout/auto-refresh.tsx:8-16`](file:///home/ubuntu/UptimeRobot/src/components/layout/auto-refresh.tsx#L8-L16)

**Description:**  
If component unmounts and remounts rapidly, old intervals may not be cleared properly.

**Impact:** Multiple intervals running simultaneously.

**Fix:**
Add cleanup verification:
```tsx
useEffect(() => {
  const id = setInterval(/* ... */, intervalMs);
  return () => {
    clearInterval(id);
  };
}, [router, intervalMs]);
```

---

## Summary Statistics

| Severity | Count | % of Total |
|----------|-------|------------|
| Critical | 3     | 20%        |
| High     | 5     | 33%        |
| Medium   | 4     | 27%        |
| Low      | 3     | 20%        |
| **Total**| **15**| **100%**   |

---

## Recommended Action Plan

### Phase 1: Immediate (Block Production)
1. **Fix BUG-001**: Resolve TypeScript compilation error
2. **Fix BUG-002**: Verify monitoring engine is running correctly
3. **Fix BUG-003**: Add error boundary

### Phase 2: High Priority (This Week)
4. Replace `alert()` with toast notifications (BUG-004)
5. Remove debug console.log statements (BUG-005)
6. Change default password (BUG-006)
7. Add input sanitization (BUG-007)
8. Fix email link generation (BUG-008)

### Phase 3: Medium Priority (This Month)
9-12. Address auth helpers, null checks, loading states, and configurable cooldowns

### Phase 4: Low Priority (As Time Permits)
13-15. Polish logging, favicon, and memory management

---

**Report End**
