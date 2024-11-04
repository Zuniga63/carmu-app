interface ClientData {
  ip?: string | undefined;
  userAgent?: string | undefined;
}

export function getClientDataFromReq(req?: Request): ClientData {
  if (!req) return {};
  const clientIp = req.headers.get('x-forwarded-for') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  return { ip: clientIp, userAgent };
}
