function orderReferenceFromSessionId(sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length < 8) {
    return 'UNKNOWN';
  }
  return sessionId.slice(-8).toUpperCase();
}

module.exports = { orderReferenceFromSessionId };
