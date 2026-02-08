# Specification

## Summary
**Goal:** Make the Internet Identity Sign In / Sign Out flow reliable, responsive, and clear by fixing async/await misuse and adding user-facing error handling and troubleshooting guidance.

**Planned changes:**
- Update the header Sign In / Sign Out button logic to avoid awaiting non-Promise `login()` / `clear()` calls, keep UI state consistent during login/logout, and disable Sign In while `loginStatus === 'logging-in'`.
- Ensure Sign Out reliably clears the React Query cache and returns the app to the signed-out UI state.
- Add visible authentication error feedback (in English) in both the header AuthButton area and the AuthGate screen when `loginStatus === 'loginError'`, including an error message (using `loginError` when available) and a “Try again” action that re-triggers login from a direct click.
- Add a short troubleshooting hints section on the AuthGate login screen (in English) covering common Internet Identity issues like pop-up blockers and third-party cookies.

**User-visible outcome:** Users can sign in and sign out without console async errors, see clear login failure messages with a one-click “Try again” option, and get basic tips to resolve common Internet Identity login issues.
