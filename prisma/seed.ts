// prisma/seed.ts — Seeds method catalog data and bootstraps the Platform Administrator.
// Run with: npm run db:seed
//
// All values are verbatim from authoritative sources:
//   - Roles → TrustScaleAI Participant Guide, Chapter 6
//   - Engagement Variants → Participant Guide §4.8 / §4.9 / §4.10
//   - 35 Templates → "TrustScaleAI Templates - 12Mar2026.pdf"
//
// Bootstrap admin: balaramaraju.vatsavai@qualizeal.com → Platform Administrator (PA)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PLATFORM_ADMIN_EMAIL = "balaramaraju.vatsavai@qualizeal.com";

/* ============== 11 ROLES — Participant Guide Chapter 6 ============== */
const ROLES = [
  { code: "PA",  name: "Platform Administrator",          orgScope: "Any",
    description: "Full platform access — manage all Organizations, users, billing, feature flags, system settings, and master data.",
    permissions: ["admin.*","organization.*","user.*","engagement.*","audit.read","billing.*","flags.*","master.*"] },
  { code: "EL",  name: "Engagement Lead",                 orgScope: "Own",
    description: "Owns the overall success of the engagement — client confidence, delivery quality, scope discipline, team coordination, and executive-readout readiness. Primary integrator of consulting judgment. (PG §6.4)",
    permissions: ["engagement.*","template.*","gate.sign","output.publish","engagement.vfr.edit"] },
  { code: "SC",  name: "AI Strategy Consultant",          orgScope: "Own",
    description: "Drives the strategy logic — use-case framing, prioritization (V×F×R), value storyline, and the recommendation logic that flows into the board pack. (PG §6.5)",
    permissions: ["template.edit","evidence.write","record.*","usecases.*"] },
  { code: "EA",  name: "Enterprise Architect (Advisory)", orgScope: "Own",
    description: "Validates data, integration and platform feasibility; owns the reference architecture and technology-readiness dimensions. (PG §6.6)",
    permissions: ["template.edit","evidence.write","architecture.*"] },
  { code: "RG",  name: "Risk / Governance Lead",          orgScope: "Own",
    description: "Owns the risk register, governance posture (EU AI Act / ISO 42001), approvals, and mitigation plans. (PG §6.7)",
    permissions: ["risk.*","governance.*","approval.*","audit.read"] },
  { code: "QE",  name: "QE / EvalOps Advisory Lead",      orgScope: "Own",
    description: "Runs T-G1 Completeness, T-G2 Coherence, and T-G3 Consequence quality gates; can veto a gate ceremony on QA grounds. (PG §6.8)",
    permissions: ["qa.run","qa.approve","gate.veto"] },
  { code: "BA",  name: "Analyst / Business Analyst",      orgScope: "Own",
    description: "Captures requirements, value mapping, and stakeholder insight; maintains use-case and evidence detail. (PG §6.9)",
    permissions: ["template.edit","evidence.write","record.*"] },
  { code: "PMO", name: "PMO / Engagement Coordinator",    orgScope: "Own",
    description: "Runs the engagement cadence — scheduling, actions log, minutes, gate-pack assembly; does not sign off artifacts. (PG §6.10)",
    permissions: ["engagement.view","schedule.*","comment.write","record.read"] },
  { code: "AI",  name: "Artifact Integrator",             orgScope: "Own",
    description: "Assembles final Word / PowerPoint / Excel / PDF outputs from approved templates; owns formatting, branding, and publish step. (PG §6.11)",
    permissions: ["output.publish","template.read","evidence.read"] },
  { code: "ES",  name: "Executive Sponsor",               orgScope: "Own",
    description: "Client-side executive sponsor — approves decisions, attends gate ceremonies, receives final outputs.",
    permissions: ["engagement.view","gate.approve","output.view","comment.write"] },
  { code: "ST",  name: "Stakeholder",                     orgScope: "Own",
    description: "Client-side stakeholder interviewed for use cases, evidence, and gate alignment; read access to their engagement assets.",
    permissions: ["engagement.view","output.view","comment.write"] },
];

/* ============== 3 ENGAGEMENT VARIANTS — PG §4.8 / §4.9 / §4.10 ============== */
const VARIANTS = [
  { code: "VA", label: "Variant A · 2-Week Fast Start", durationWeeks: 2,
    description: "Provide a fast, structured decision frame for organizations early in AI exploration. Creates direction and prioritization, not complete execution readiness. (PG §4.8)",
    templateCodes: ["T-A1","T-A2","T-A3","T-A4","T-A5","T-B1","T-B2","T-B3","T-B4","T-G1","T-G3"],
    gateCodes: ["scope","shortlist"] },
  { code: "VB", label: "Variant B · 4-Week Board-Ready Package", durationWeeks: 4,
    description: "Boardroom-grade advisory package combining prioritization, readiness, governance, value framing, and executive decision support. Most common variant. (PG §4.9)",
    templateCodes: ["T-A1","T-A2","T-A3","T-A4","T-A5","T-B1","T-B2","T-B3","T-B4","T-B5","T-C1","T-C2","T-C3","T-C4","T-D1","T-D2","T-D3","T-D4","T-E1","T-E2","T-E3","T-E4","T-F1","T-F2","T-F3","T-G1","T-G2","T-G3"],
    gateCodes: ["scope","shortlist","evidence","decision"] },
  { code: "VC", label: "Variant C · 6-Week Scale-Ready Package", durationWeeks: 6,
    description: "Extends the board-ready foundation into deeper, near-build-ready planning for selected priority use cases. (PG §4.10)",
    templateCodes: ["T-A1","T-A2","T-A3","T-A4","T-A5","T-B1","T-B2","T-B3","T-B4","T-B5","T-C1","T-C2","T-C3","T-C4","T-D1","T-D2","T-D3","T-D4","T-E1","T-E2","T-E3","T-E4","T-E5","T-E6","T-E7","T-E8","T-F1","T-F2","T-F3","T-F4","T-F5","T-F6","T-G1","T-G2","T-G3"],
    gateCodes: ["scope","shortlist","evidence","decision"] },
];

/* ============== 35 TEMPLATES — TrustScaleAI Templates 12Mar2026.pdf ============== */
const TEMPLATES = [
  // Folder A — Discovery (5)
  { code:"T-A1", folder:"A", title:"Stakeholder Map + Interview Plan",                        phase:1, purpose:"Identify who decides, blocks, uses or sponsors and plan the interview sequence." },
  { code:"T-A2", folder:"A", title:"Role-Based Interview Guide Set",                          phase:1, purpose:"Interview guides by role (C-Level, Function Head, Data Owner, Operations)." },
  { code:"T-A3", folder:"A", title:"Interview Notes + Evidence Capture",                      phase:1, purpose:"Capture interview notes with inline evidence tagging and contradictions." },
  { code:"T-A4", folder:"A", title:"Contradiction Log + Assumption Register",                 phase:1, purpose:"Track conflicting positions and document assumptions surfacing during discovery." },
  { code:"T-A5", folder:"A", title:"Document Request Checklist",                              phase:1, purpose:"Ensure required documents and evidence are requested early." },
  // Folder B — Use Case (5)
  { code:"T-B1", folder:"B", title:"Use Case Intake Form",                                    phase:1, purpose:"Bounded workflow capture for a candidate AI use case." },
  { code:"T-B2", folder:"B", title:"Use Case Catalog Sheet",                                  phase:1, purpose:"Catalog of all candidate use cases before scoring." },
  { code:"T-B3", folder:"B", title:"Prioritization Matrix + Scoring Guide",                   phase:1, purpose:"V×F×R scoring matrix with sub-criteria per Participant Guide §8." },
  { code:"T-B4", folder:"B", title:"Use-Case Shortlist Summary",                              phase:1, purpose:"Now / Next / Park / Reject categorization with rationale." },
  { code:"T-B5", folder:"B", title:"Use-Case Execution Card (Pilot-Ready)",                   phase:2, purpose:"Pilot-ready card for shortlisted use cases (Variant B+)." },
  // Folder C — Value (4)
  { code:"T-C1", folder:"C", title:"AI Value Ledger™",                                        phase:2, purpose:"Drivers / Enablers / Constraints / Shocks with Low/Expected/High envelope." },
  { code:"T-C2", folder:"C", title:"Baseline Capture Sheet",                                  phase:2, purpose:"Document KPI baselines used to compute value claims." },
  { code:"T-C3", folder:"C", title:"Benefits Realization Plan (Starter)",                     phase:2, purpose:"Starter benefits realization plan tied to KPIs." },
  { code:"T-C4", folder:"C", title:"Value Story Slide Template",                              phase:4, purpose:"Slide template translating Value Ledger into board narrative." },
  // Folder D — Readiness (4)
  { code:"T-D1", folder:"D", title:"Readiness Rubric + Evidence Notes",                       phase:2, purpose:"8-dimension readiness rubric (BUG/DKR/AIR/PTR/SRR/QER/OMR/ACS) with evidence tiers." },
  { code:"T-D2", folder:"D", title:"Readiness Heatmap",                                       phase:2, purpose:"One-slide readiness heatmap across 8 dimensions." },
  { code:"T-D3", folder:"D", title:"Remediation Backlog",                                     phase:2, purpose:"Now / Next / Later remediation actions with owners and dependencies." },
  { code:"T-D4", folder:"D", title:"Readiness-to-Roadmap Mapping Sheet",                      phase:2, purpose:"Map readiness gaps to sequenced roadmap items." },
  // Folder E — Governance (8)
  { code:"T-E1", folder:"E", title:"Governance Policy v1",                                    phase:3, purpose:"Scope-proportionate AI Use Policy v1." },
  { code:"T-E2", folder:"E", title:"Governance + Delivery + EvalOps RACI",                    phase:3, purpose:"RACI for AI use approval, gate sign-off, EvalOps runs, policy ownership." },
  { code:"T-E3", folder:"E", title:"Approval Workflow Diagram",                               phase:3, purpose:"Structured approval workflow across stages." },
  { code:"T-E4", folder:"E", title:"Risk Register",                                           phase:3, purpose:"Risk items with category, likelihood, impact, mitigation, residual." },
  { code:"T-E5", folder:"E", title:"EvalOps Metrics Model",                                   phase:3, purpose:"Metrics model — accuracy, hallucination rate, latency thresholds." },
  { code:"T-E6", folder:"E", title:"Evaluation Plan",                                         phase:3, purpose:"Evaluation plan with judges, baselines, pass thresholds." },
  { code:"T-E7", folder:"E", title:"Monitoring Signals + Cadence",                            phase:3, purpose:"Production monitoring signals and review cadence." },
  { code:"T-E8", folder:"E", title:"Evidence Pack",                                           phase:3, purpose:"Consolidated evidence pack referenced by gate ceremonies." },
  // Folder F — Exec Pack & Handoff (6)
  { code:"T-F1", folder:"F", title:"Board Pack Slide Shell",                                  phase:4, purpose:"12-slide shell for the board-ready decision pack." },
  { code:"T-F2", folder:"F", title:"Decision Ask Slide",                                      phase:4, purpose:"Up to 5 decision asks with explicit options." },
  { code:"T-F3", folder:"F", title:"Annex Evidence Index",                                    phase:4, purpose:"Annex pointer to all supporting evidence." },
  { code:"T-F4", folder:"F", title:"Sponsor Checkpoint Deck for Scale-Ready",                 phase:4, purpose:"Sponsor checkpoint deck (Variant C only)." },
  { code:"T-F5", folder:"F", title:"Delivery Handoff Kit Checklist",                          phase:4, purpose:"Handoff checklist for delivery teams post-engagement." },
  { code:"T-F6", folder:"F", title:"Pilot Kickoff Agenda + Cadence",                          phase:4, purpose:"Pilot kickoff agenda (Variant C only)." },
  // Folder G — Internal QA (3)
  { code:"T-G1", folder:"G", title:"Gate Review Checklist",                                   phase:0, purpose:"Completeness checklist applied at every gate ceremony." },
  { code:"T-G2", folder:"G", title:"Artifact Scoring Rubric Pack",                            phase:0, purpose:"Coherence rubric pack — cross-template consistency." },
  { code:"T-G3", folder:"G", title:"Must-Fix Issue Log",                                      phase:0, purpose:"Consequence log — must-fix items before publish." },
];

async function main() {
  console.log("Seeding role catalog (11 rows)…");
  for (const r of ROLES) {
    await prisma.role.upsert({ where: { code: r.code }, update: r, create: r });
  }

  console.log("Seeding engagement variant catalog (3 rows)…");
  for (const v of VARIANTS) {
    await prisma.engagementVariant.upsert({ where: { code: v.code }, update: v, create: v });
  }

  console.log("Seeding method template catalog (35 rows)…");
  for (const t of TEMPLATES) {
    await prisma.methodTemplate.upsert({ where: { code: t.code }, update: t, create: t });
  }

  console.log("Seeding QualiZeal Platform organization…");
  const qz = await prisma.organization.upsert({
    where: { domain: "qualizeal.com" },
    update: {},
    create: {
      name: "QualiZeal (Platform)",
      type: "Platform",
      domain: "qualizeal.com",
      plan: "Enterprise",
      status: "Active",
      region: "EU-Central",
      seats: 250,
    },
  });

  console.log(`Bootstrapping Platform Administrator: ${PLATFORM_ADMIN_EMAIL}…`);
  await prisma.user.upsert({
    where: { email: PLATFORM_ADMIN_EMAIL },
    update: { platformRoleCode: "PA" },
    create: {
      email: PLATFORM_ADMIN_EMAIL,
      name: "Balaramaraju Vatsavai",
      initials: "BV",
      organizationId: qz.id,
      platformRoleCode: "PA",
      status: "Active",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
