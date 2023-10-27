export function jwtExtractorWS(request: any) {
  return request?.handshake?.headers?.authorization?.replace('Bearer ', '');
}
