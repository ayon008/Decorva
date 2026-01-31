/**
 * Normalizes a string to slug format: lowercase, only a-z, 0-9, and hyphens.
 * Example: "Outdoor Plants" -> "outdoor-plants"
 * No leading slash, no leading/trailing hyphens, no consecutive hyphens.
 */
export function normalizeSlug(value: string): string {
    return value
        .trim()
        .replace(/^\/+/, "") // strip leading slashes
        .toLowerCase()
        .replace(/\s+/g, "-") // spaces to hyphen
        .replace(/_/g, "-") // underscores to hyphen
        .replace(/[^a-z0-9-]/g, "") // keep only letters, digits, hyphen
        .replace(/-+/g, "-") // collapse multiple hyphens to one
        .replace(/^-|-$/g, ""); // strip leading/trailing hyphens
}
