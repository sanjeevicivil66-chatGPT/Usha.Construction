import test from "node:test";
import assert from "node:assert/strict";
import { openDatabase } from "./db.js";
import { buildApp } from "./app.js";

const enquiry = {
  name: "Sample Enquirer",
  mobile: "9876543210",
  email: "sample@example.test",
  service: "New house construction",
  location: "Erode",
  budgetBand: "₹25–35 lakh",
  area: "1200 sqft",
  notes: "Please call after 5 PM.",
  utmSource: "instagram",
  utmMedium: "social",
  utmCampaign: "sample-campaign",
  consent: true
};
const key = "public-enquiry-test-0001";

async function setup() {
  const db = openDatabase(":memory:");
  const app = await buildApp({ db });
  return { db, app };
}

test("consented public enquiry persists customer, lead, activity and idempotency atomically", async () => {
  const { db, app } = await setup();
  const response = await app.inject({
    method: "POST", url: "/api/v1/public/enquiries",
    headers: { "idempotency-key": key }, payload: enquiry
  });
  assert.equal(response.statusCode, 202);
  assert.equal(response.json().accepted, true);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM customers").get() as {count:number}).count, 1);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM leads").get() as {count:number}).count, 1);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM activity_events WHERE event_type='enquiry.received'").get() as {count:number}).count, 1);
  const customer = db.prepare("SELECT phone_normalized, email_normalized FROM customers").get() as {phone_normalized:string;email_normalized:string};
  assert.equal(customer.phone_normalized, "+919876543210");
  assert.equal(customer.email_normalized, "sample@example.test");
  await app.close(); db.close();
});

test("same idempotency key replays the original receipt without duplicating records", async () => {
  const { db, app } = await setup();
  const headers = { "idempotency-key": key };
  const first = await app.inject({ method: "POST", url: "/api/v1/public/enquiries", headers, payload: enquiry });
  const replay = await app.inject({ method: "POST", url: "/api/v1/public/enquiries", headers, payload: enquiry });
  assert.equal(replay.statusCode, 202);
  assert.equal(replay.json().confirmationCode, first.json().confirmationCode);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM leads").get() as {count:number}).count, 1);
  await app.close(); db.close();
});

test("reusing an idempotency key for different content returns conflict", async () => {
  const { db, app } = await setup();
  await app.inject({ method: "POST", url: "/api/v1/public/enquiries", headers: { "idempotency-key": key }, payload: enquiry });
  const response = await app.inject({
    method: "POST", url: "/api/v1/public/enquiries",
    headers: { "idempotency-key": key }, payload: { ...enquiry, name: "Different Enquirer" }
  });
  assert.equal(response.statusCode, 409);
  assert.equal(response.json().error.code, "idempotency_conflict");
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM leads").get() as {count:number}).count, 1);
  await app.close(); db.close();
});

test("missing consent and invalid mobile are rejected", async () => {
  const { db, app } = await setup();
  const noConsent = await app.inject({ method: "POST", url: "/api/v1/public/enquiries", headers: { "idempotency-key": key }, payload: { ...enquiry, consent: false } });
  assert.equal(noConsent.statusCode, 400);
  const invalidMobile = await app.inject({ method: "POST", url: "/api/v1/public/enquiries", headers: { "idempotency-key": key }, payload: { ...enquiry, mobile: "123" } });
  assert.equal(invalidMobile.statusCode, 400);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM leads").get() as {count:number}).count, 0);
  await app.close(); db.close();
});

test("honeypot submissions are safely acknowledged but not persisted", async () => {
  const { db, app } = await setup();
  const response = await app.inject({
    method: "POST", url: "/api/v1/public/enquiries",
    headers: { "idempotency-key": key }, payload: { ...enquiry, website: "spam-filled" }
  });
  assert.equal(response.statusCode, 202);
  assert.equal(response.json().accepted, true);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM leads").get() as {count:number}).count, 0);
  await app.close(); db.close();
});
