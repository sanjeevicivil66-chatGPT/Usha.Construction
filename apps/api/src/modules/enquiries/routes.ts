import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type Database from "better-sqlite3";
import { IdempotencyKeySchema, PublicEnquirySchema } from "@usha/contracts";
import { zodToJsonSchema } from "zod-to-json-schema";
import { HttpError } from "../../lib/http-error.js";

const bodySchema = zodToJsonSchema(PublicEnquirySchema);
const responseSchema = {
  type: "object", additionalProperties: false, required: ["accepted", "confirmationCode"],
  properties: { accepted: { type: "boolean", const: true }, confirmationCode: { type: "string" } }
};

function normalizeIndianMobile(value: string): string {
  const digits = value.replace(/[\s()-]/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return "+91" + digits;
  if (/^\+91[6-9]\d{9}$/.test(digits)) return digits;
  if (/^91[6-9]\d{9}$/.test(digits)) return "+" + digits;
  throw new HttpError(400, "invalid_mobile", "Enter a valid 10-digit Indian mobile number.");
}

export async function registerEnquiryRoutes(app: FastifyInstance, db: Database.Database): Promise<void> {
  app.post("/api/v1/public/enquiries", {
    config: { rateLimit: { max: 4, timeWindow: 10 * 60 * 1000 } },
    schema: {
      tags: ["public-enquiries"],
      summary: "Submit a consented construction enquiry",
      body: bodySchema,
      response: { 202: responseSchema }
    }
  }, async (request, reply) => {
    const parsed = PublicEnquirySchema.safeParse(request.body);
    if (!parsed.success) throw new HttpError(400, "invalid_enquiry", "Check the required enquiry fields and consent.");
    const enquiry = parsed.data;
    if (enquiry.website?.trim()) {
      return reply.code(202).send({ accepted: true, confirmationCode: randomBytes(12).toString("base64url") });
    }
    const keyHeader = request.headers["idempotency-key"];
    const keyParsed = IdempotencyKeySchema.safeParse(keyHeader);
    if (!keyParsed.success) throw new HttpError(400, "idempotency_key_required", "A valid Idempotency-Key header is required.");
    const mobile = normalizeIndianMobile(enquiry.mobile);
    const normalized = { ...enquiry, mobile, email: enquiry.email?.toLowerCase() };
    const requestHash = createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const result = db.transaction(() => {
      db.prepare("DELETE FROM idempotency_keys WHERE scope = ? AND key = ? AND expires_at <= ?")
        .run("public-enquiry", keyParsed.data, now.toISOString());
      const existing = db.prepare("SELECT request_hash, response_json, response_status FROM idempotency_keys WHERE scope = ? AND key = ?")
        .get("public-enquiry", keyParsed.data) as { request_hash: string; response_json: string | null; response_status: number | null } | undefined;
      if (existing) {
        if (existing.request_hash !== requestHash) throw new HttpError(409, "idempotency_conflict", "This request key was already used for a different enquiry.");
        if (!existing.response_json) throw new HttpError(409, "request_in_progress", "This enquiry is already being processed.");
        return { response: JSON.parse(existing.response_json) as { accepted: true; confirmationCode: string }, status: existing.response_status ?? 202 };
      }

      const customerId = randomUUID();
      const leadId = randomUUID();
      const confirmationCode = randomBytes(12).toString("base64url");
      const attribution = {
        source: enquiry.utmSource ?? "website",
        medium: enquiry.utmMedium ?? null,
        campaign: enquiry.utmCampaign ?? null,
        referrer: enquiry.referrer ?? null
      };
      const customerRecord = {
        name: enquiry.name,
        mobile,
        email: normalized.email ?? null,
        location: enquiry.location,
        consentedAt: now.toISOString()
      };
      const leadRecord = {
        service: enquiry.service,
        budgetBand: enquiry.budgetBand ?? null,
        area: enquiry.area ?? null,
        notes: enquiry.notes ?? null,
        confirmationCode,
        consent: true,
        consentedAt: now.toISOString()
      };

      db.prepare("INSERT INTO customers(id, display_name, email_normalized, phone_normalized, record_json) VALUES (?, ?, ?, ?, ?)")
        .run(customerId, enquiry.name, normalized.email ?? null, mobile, JSON.stringify(customerRecord));
      db.prepare("INSERT INTO leads(id, customer_id, stage, source, record_json, attribution_json) VALUES (?, ?, 'new', ?, ?, ?)")
        .run(leadId, customerId, attribution.source, JSON.stringify(leadRecord), JSON.stringify(attribution));
      db.prepare("INSERT INTO activity_events(id, entity_type, entity_id, event_type, summary, metadata_json, correlation_id) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(randomUUID(), "lead", leadId, "enquiry.received", "New website enquiry received", JSON.stringify({ source: attribution.source }), request.id);
      const response = { accepted: true as const, confirmationCode };
      db.prepare("INSERT INTO idempotency_keys(scope, key, request_hash, response_json, response_status, expires_at) VALUES (?, ?, ?, ?, ?, ?)")
        .run("public-enquiry", keyParsed.data, requestHash, JSON.stringify(response), 202, expiresAt);
      return { response, status: 202 };
    })();

    return reply.code(202).send(result.response);
  });
}
