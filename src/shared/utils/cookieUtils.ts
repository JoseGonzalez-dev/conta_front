/**
 * Cookie utility functions for managing browser cookies
 */

/**
 * Set a cookie with optional expiration days
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 7)
 * @param secure - Whether to set Secure flag (default: true in production)
 */
export function setCookie(name: string, value: string, days: number = 7, secure: boolean = true): void {
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;

        // Build cookie string
        let cookieString = `${name}=${encodeURIComponent(value)};${expires};path=/`;

        // Add Secure flag in production (requires HTTPS)
        if (secure && window.location.protocol === 'https:') {
            cookieString += ';Secure';
        }

        // Add SameSite for CSRF protection
        cookieString += ';SameSite=Strict';

        document.cookie = cookieString;
        console.log(`✅ Cookie '${name}' set successfully`);
    } catch (error) {
        console.error(`❌ Error setting cookie '${name}':`, error);
    }
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
    try {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }
        return null;
    } catch (error) {
        console.error(`❌ Error getting cookie '${name}':`, error);
        return null;
    }
}

/**
 * Delete a cookie by name
 * @param name - Cookie name
 */
export function deleteCookie(name: string): void {
    try {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        console.log(`✅ Cookie '${name}' deleted successfully`);
    } catch (error) {
        console.error(`❌ Error deleting cookie '${name}':`, error);
    }
}

/**
 * Check if a cookie exists
 * @param name - Cookie name
 * @returns true if cookie exists, false otherwise
 */
export function cookieExists(name: string): boolean {
    return getCookie(name) !== null;
}

/**
 * Get all cookies as an object
 * @returns Object with cookie names as keys and values
 */
export function getAllCookies(): Record<string, string> {
    try {
        const cookies: Record<string, string> = {};
        const cookieArray = document.cookie.split(';');

        for (const cookie of cookieArray) {
            const [name, value] = cookie.split('=').map(c => c.trim());
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        }

        return cookies;
    } catch (error) {
        console.error('❌ Error getting all cookies:', error);
        return {};
    }
}
