export function getJwtSubject(token: string): string | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;
    const json = JSON.parse(
      atob(segment.replace(/-/g, '+').replace(/_/g, '/')),
    ) as { sub?: unknown };
    return typeof json.sub === 'string' ? json.sub : null;
  } catch {
    return null;
  }
}
