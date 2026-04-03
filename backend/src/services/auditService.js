import { db } from "../models/store.js";

export function recordAudit(action, actor, details = {}) {
  db.auditLogs.unshift({
    id: `${Date.now()}`,
    action,
    actor,
    details,
    timestamp: new Date().toISOString()
  });
}

export function getAuditLogs() {
  return db.auditLogs.slice(0, 50);
}
