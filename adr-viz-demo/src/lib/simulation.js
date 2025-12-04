import { v4 as uuidv4 } from 'uuid';

// --- Constants ---

export const INDUSTRIES = {
    INSURANCE: 'Insurance',
    MANUFACTURING: 'Manufacturing',
    HEALTHCARE: 'Healthcare',
    FINANCE: 'Finance',
    RETAIL: 'Retail',
};

export const EXCEPTION_TYPES = {
    [INDUSTRIES.HEALTHCARE]: ['Prior Authorization Denial', 'Provider Credentialing Delay'],
    [INDUSTRIES.FINANCE]: ['Invoice Reconciliation Gap', 'Month-End Close Delay'],
    [INDUSTRIES.RETAIL]: ['Tariff Compliance Leak', 'Vendor Deduction Dispute'],
};

export const LAYERS = {
    L_MINUS_1: 'L-1: Pre-Dispute Radar',
    L0: 'L0: Sources',
    L1: 'L1: Ingestion',
    L1_5: 'L1.5: Data Minimization',
    L2: 'L2: Orchestration',
    L3A: 'L3.a: Cognitive Plane',
    L3B: 'L3.b: Control Plane',
    L6: 'L6: Connectivity',
};

export const STATES = {
    PRE_DISPUTE: 'PRE_DISPUTE',
    DETECT: 'DETECT',
    PERCEIVE: 'PERCEIVE',
    REASON: 'REASON',
    DECIDE: 'DECIDE',
    ACT: 'ACT',
    ASSURE: 'ASSURE',
    COMPLETED: 'COMPLETED',
};

export const PATTERNS = {
    P1: { id: 'P1', name: 'Ingest', desc: 'Normalize & Validate' },
    P2: { id: 'P2', name: 'Secure', desc: 'Redact & Tokenize' },
    P3: { id: 'P3', name: 'Context', desc: 'Enrich & Retrieve' },
    P4: { id: 'P4', name: 'Match', desc: 'Fuzzy Logic & Rules' },
    P5: { id: 'P5', name: 'Synthesize', desc: 'GenAI Reasoning' },
    P6: { id: 'P6', name: 'Policy', desc: 'OPA Guardrails' },
    P7: { id: 'P7', name: 'Decide', desc: 'Deterministic Choice' },
    P8: { id: 'P8', name: 'Sign', desc: 'Crypto Manifest' },
    P9: { id: 'P9', name: 'Act', desc: 'Write-Back' },
    P10: { id: 'P10', name: 'Audit', desc: 'Immutable Log' },
};

// --- Generators ---

// --- Generators ---

const SOURCES = {
    [INDUSTRIES.HEALTHCARE]: ['Epic EHR', 'Cerner', 'Allscripts', 'Workday HCM'],
    [INDUSTRIES.FINANCE]: ['SAP S/4HANA', 'Oracle NetSuite', 'Coupa', 'Workday Finance'],
    [INDUSTRIES.RETAIL]: ['Salesforce Commerce', 'Shopify Plus', 'Manhattan WMS', 'SAP ERP'],
};

export const generateSignal = (industry) => {
    const types = ['Sentiment Drop', 'Inventory Mismatch', 'Payment Delay Risk', 'Policy Drift'];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = uuidv4();

    return {
        id,
        industry,
        type: `[SIGNAL] ${type}`,
        timestamp: new Date().toISOString(),
        status: STATES.PRE_DISPUTE,
        layer: LAYERS.L_MINUS_1,
        priority: 'LOW',
        tenantId: uuidv4().split('-')[0],
        sourceSystem: 'Predictive Engine',
        data: {
            risk_score: Math.floor(Math.random() * 100),
            confidence: 0.65,
            prediction_window: '48h'
        },
        manifest: {
            id: uuidv4(),
            exception_id: id,
            bom: {},
            snapshots: [],
            hashes: []
        },
        activePattern: null,
        history: [],
        logs: [{
            timestamp: new Date().toISOString(),
            message: `[L-1] Detected upstream signal: ${type}. Risk Score: ${Math.floor(Math.random() * 100)}`,
            type: 'warning',
            agent: 'Predictive Engine',
            pattern: PATTERNS.P3
        }]
    };
};

export const generateException = (industry, forcePriority = null) => {
    const types = EXCEPTION_TYPES[industry] || ['Generic Exception'];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = uuidv4();
    const sourceList = SOURCES[industry] || ['Legacy System'];
    const sourceSystem = sourceList[Math.floor(Math.random() * sourceList.length)];

    // Generate Rich Industry-Specific Data
    let businessData = {};
    if (industry === INDUSTRIES.HEALTHCARE) {
        businessData = {
            patient_id: `PT-${Math.floor(Math.random() * 100000)}`,
            diagnosis_code: ['E11.9', 'I10', 'J45.909', 'M54.5'][Math.floor(Math.random() * 4)],
            provider_npi: `NPI-${Math.floor(Math.random() * 1000000000)}`,
            claim_amount: `$${(Math.random() * 5000).toFixed(2)}`,
            service_date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0]
        };
    } else if (industry === INDUSTRIES.FINANCE) {
        businessData = {
            invoice_id: `INV-${Math.floor(Math.random() * 100000)}`,
            vendor_id: `VEND-${Math.floor(Math.random() * 1000)}`,
            gl_code: `GL-${Math.floor(Math.random() * 900)}-${Math.floor(Math.random() * 90)}`,
            po_match_status: ['Partial Match', 'No Match', 'Price Variance'][Math.floor(Math.random() * 3)],
            payment_terms: 'Net 30'
        };
    } else if (industry === INDUSTRIES.RETAIL) {
        businessData = {
            sku: `SKU-${Math.floor(Math.random() * 100000)}`,
            location_id: `WH-${['NA', 'EU', 'APAC'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 100)}`,
            carrier: ['FedEx', 'UPS', 'DHL', 'Maersk'][Math.floor(Math.random() * 4)],
            manifest_id: `MAN-${Math.floor(Math.random() * 100000)}`,
            compliance_check: 'Pending'
        };
    }

    const generateThoughtStream = (type, industry) => {
        const steps = [
            { stage: "PERCEIVE", action: "Scanning document...", detail: "Extracted 14 fields from PDF invoice.", duration: 150 },
            { stage: "PERCEIVE", action: "Validating schema...", detail: "Field 'VendorID' matches format V-[0-9]{4}.", duration: 100 },
            { stage: "REASON", action: "Contextual lookup...", detail: `Retrieving ${industry} policy pack v4.2.`, duration: 300 },
            { stage: "REASON", action: "Pattern matching...", detail: `Detected '${type}' pattern with 94% confidence.`, duration: 400 },
            { stage: "DECIDE", action: "Checking guardrails...", detail: "Amount < $10k threshold. Auto-approval candidate.", duration: 200 },
            { stage: "ACT", action: "Drafting resolution...", detail: "Prepared ERP write-back payload.", duration: 150 }
        ];
        return steps;
    };

    return {
        id,
        industry,
        type,
        timestamp: new Date().toISOString(),
        status: STATES.DETECT,
        layer: LAYERS.L0,
        priority: forcePriority || (Math.random() > 0.8 ? 'HIGH' : 'MEDIUM'),
        tenantId: uuidv4().split('-')[0],
        sourceSystem,
        data: {
            amount: Math.floor(Math.random() * 10000),
            confidence: 0.0,
            pii_redacted: false,
            policy_version: 'v3.3.1',
            ai_proposal: null,
            decision: null,
            ...businessData // Merge rich data
        },
        // Structured Sealed Manifest (Low-Level Spec 1.3)
        manifest: {
            id: uuidv4(),
            exception_id: id,
            bom: {
                policy_engine: "OPA v0.61",
                ai_model: "Gemini 1.5 Pro",
                orchestrator: "Temporal v1.24"
            },
            snapshots: [],
            hashes: []
        },
        activePattern: null,
        history: [],
        thoughtStream: generateThoughtStream(type, industry), // Add thought stream
    };
};

// --- State Machine Logic ---

export const advanceException = (exception, killSwitchActive = false, policyConfig = { approvalThreshold: 10000 }) => {
    // 1. Create a Deep Copy of the CURRENT state to store in history
    // We store the state *before* the transition so we can roll back to it.
    const snapshot = JSON.parse(JSON.stringify(exception));
    // Remove history from the snapshot to avoid recursion/bloat
    delete snapshot.history;

    const next = {
        ...exception,
        history: [...exception.history, snapshot]
    };

    // Helper to add a log entry with Pattern ID
    const addLog = (msg, type = 'info', agent = null, patternId = null) => {
        if (!next.logs) next.logs = [];
        const entry = {
            timestamp: new Date().toISOString(),
            message: msg,
            type,
            agent,
            pattern: patternId ? PATTERNS[patternId] : null
        };
        next.logs.push(entry);

        // Update Manifest Hash (Simulated)
        if (patternId) {
            next.manifest.hashes.push({
                step: patternId,
                hash: uuidv4().split('-')[4], // Fake hash
                timestamp: entry.timestamp
            });
        }
    };

    // Global Kill Switch Check
    if (killSwitchActive && exception.status === STATES.DECIDE) {
        addLog(`[L3.b] ⚠️ GLOBAL KILL SWITCH ACTIVE. Routing to Human Review.`, 'security', "System Override", 'P6');
        next.status = STATES.MANUAL_HOLD;
        next.layer = LAYERS.L2;
        next.data.decision = "MANUAL_REVIEW";
        next.activePattern = 'P6';
        return next;
    }

    switch (exception.status) {
        case STATES.PRE_DISPUTE:
            // 30% chance to fade out (avoided), 70% chance to escalate
            if (Math.random() > 0.7) {
                // Fade out / Avoided
                next.status = STATES.COMPLETED; // Or a new 'AVOIDED' state? Let's just complete it for now or remove it.
                // Actually, if we mark it completed, it stays in the view but green.
                // Let's mark it as 'AVOIDED' for visual distinction if we had that state, but COMPLETED is fine.
                // Or better: effectively remove it by making it COMPLETED and maybe the UI filters it out or shows it as resolved.
                next.data.decision = "AVOIDED_UPSTREAM";
                addLog(`[L-1] Signal faded. Risk mitigated automatically.`, 'success', "Predictive Engine", 'P5');
            } else {
                // Escalate to L0
                next.status = STATES.DETECT;
                next.layer = LAYERS.L0;
                next.agent = "Ingestion Bot";
                addLog(`[L-1] Risk Threshold Breached. Escalating to Exception.`, 'warning', "Predictive Engine", 'P1');
            }
            break;
        case STATES.DETECT:
            next.status = STATES.PERCEIVE;
            next.layer = LAYERS.L1;
            next.agent = "Ingestion Bot";
            next.activePattern = 'P1';
            addLog(`[L1] Ingested signal from ${exception.sourceSystem} (Kafka).`, 'system', "Ingestion Bot", 'P1');
            addLog(`[L1] Normalized to Canonical Schema v3.3.`, 'system', "Ingestion Bot", 'P1');
            break;
        case STATES.PERCEIVE:
            next.data.pii_redacted = true;
            next.status = STATES.REASON;
            next.layer = LAYERS.L3A;
            next.agent = "Privacy Guardian";
            next.activePattern = 'P2';
            addLog(`[L1.5] OPA Policy Check: PII Detected (Patient Name).`, 'warning', "Privacy Guardian", 'P6');
            addLog(`[L1.5] Presidio Redaction applied. Data safe for L3.`, 'security', "Privacy Guardian", 'P2');
            break;
        case STATES.REASON:
            next.data.confidence = 0.85 + (Math.random() * 0.14);
            next.data.ai_proposal = "Approve with Conditions";
            next.status = STATES.DECIDE;
            next.layer = LAYERS.L3B;

            let agentName = "General Analyst";
            if (exception.industry === INDUSTRIES.HEALTHCARE) agentName = "Clinical Reviewer";
            if (exception.industry === INDUSTRIES.FINANCE) agentName = "AP Specialist";
            if (exception.industry === INDUSTRIES.RETAIL) agentName = "Compliance Officer";
            next.agent = agentName;

            next.activePattern = 'P5';

            addLog(`[L2] Temporal Workflow: Executing "Standard ${exception.type} Playbook"`, 'system', "Orchestrator", 'P3');
            addLog(`[L3.a] LangGraph Agent "${agentName}" analyzing context...`, 'ai', agentName, 'P3');
            addLog(`[L3.a] RAG Retrieval: Found matching policy docs. Confidence: ${(next.data.confidence * 100).toFixed(1)}%`, 'ai', agentName, 'P4');
            addLog(`[L3.a] PROPOSAL: ${next.data.ai_proposal}`, 'ai', agentName, 'P5');
            break;
        case STATES.DECIDE:
            // Dynamic Policy Check
            const threshold = policyConfig.approvalThreshold;
            const amount = next.data.amount || 0;

            if (amount < threshold) {
                next.data.decision = "APPROVED";
                next.status = STATES.ACT;
                next.layer = LAYERS.L6;
                next.agent = "Policy Enforcer";
                next.activePattern = 'P7';
                addLog(`[L3.b] Control Plane received proposal.`, 'control', "Policy Enforcer", 'P6');
                addLog(`[L3.b] OPA Guardrail: Amount $${amount} < $${threshold} (PASS)`, 'control', "Policy Enforcer", 'P6');
                addLog(`[L3.b] DECISION: APPROVED. Signing Manifest.`, 'success', "Policy Enforcer", 'P7');
                addLog(`[L3.b] Cryptographic Signature Generated.`, 'success', "Policy Enforcer", 'P8');
            } else {
                next.data.decision = "MANUAL_REVIEW";
                next.status = STATES.MANUAL_HOLD;
                next.layer = LAYERS.L2;
                next.agent = "System Override";
                next.activePattern = 'P6';
                addLog(`[L3.b] Control Plane received proposal.`, 'control', "Policy Enforcer", 'P6');
                addLog(`[L3.b] OPA Guardrail: Amount $${amount} >= $${threshold} (FAIL)`, 'warning', "Policy Enforcer", 'P6');
                addLog(`[L3.b] DECISION: ROUTED TO MANUAL REVIEW.`, 'warning', "Policy Enforcer", 'P7');
            }
            break;
        case STATES.ACT:
            next.status = STATES.ASSURE;
            next.layer = LAYERS.L5;
            next.agent = "System Connector";
            next.activePattern = 'P9';
            addLog(`[L6] MuleSoft: Executing write-back to ${exception.sourceSystem}.`, 'system', "System Connector", 'P9');
            break;
        case STATES.ASSURE:
            next.status = STATES.COMPLETED;
            next.layer = LAYERS.L0;
            next.agent = "Auditor";
            next.activePattern = 'P10';
            addLog(`[L5] QLDB: Sealed Manifest archived. Audit trail complete.`, 'system', "Auditor", 'P10');
            break;
        default:
            break;
    }
    return next;
};

export const rollbackException = (exception, stepIndex) => {
    if (!exception.history || stepIndex < 0 || stepIndex >= exception.history.length) {
        return exception;
    }

    // Retrieve the snapshot
    const snapshot = exception.history[stepIndex];

    // Create a new object from the snapshot
    // We keep the history up to this point so we don't lose the fact that we rolled back?
    // OR we can just restore the history array to be truncated.
    // Let's truncate the history to simulate a true "rewind".
    const restoredHistory = exception.history.slice(0, stepIndex);

    const restoredException = {
        ...snapshot,
        history: restoredHistory
    };

    // Add a log entry indicating rollback
    if (!restoredException.logs) restoredException.logs = [];
    restoredException.logs.push({
        timestamp: new Date().toISOString(),
        message: `⏪ ROLLED BACK to state: ${snapshot.status}`,
        type: 'warning',
        agent: 'System Admin',
        pattern: PATTERNS.P10
    });

    return restoredException;
};

export const calculateStats = (exceptions) => {
    // Filter for closed cases (COMPLETED or ACT/ASSURE if we consider them 'done' for stats)
    // Let's use COMPLETED and ACT/ASSURE as 'Resolved'
    const resolved = exceptions.filter(e => e.status === STATES.COMPLETED || e.status === STATES.ACT || e.status === STATES.ASSURE);

    let autoCount = 0;
    let manualCount = 0;
    let avoidedCount = 0;

    resolved.forEach(e => {
        if (e.data.decision === "APPROVED" || e.data.decision === "APPROVED (AUTO)") {
            autoCount++;
        } else if (e.data.decision === "MANUAL_REVIEW" || e.data.decision === "APPROVED (MANUAL)" || e.data.decision === "REJECTED (MANUAL)") {
            manualCount++;
        } else if (e.data.decision === "AVOIDED_UPSTREAM") {
            avoidedCount++;
        }
    });

    const totalResolved = autoCount + manualCount + avoidedCount;
    const automationRate = totalResolved > 0 ? ((autoCount + avoidedCount) / totalResolved) * 100 : 0;

    // Assumptions:
    // Manual Review = $50 cost, 20 mins (1200 sec)
    // Auto Review = $0.50 cost, 1 sec
    // Avoided = $0 cost, 0 sec

    const manualCost = manualCount * 50;
    const autoCost = autoCount * 0.50;
    const totalCost = manualCost + autoCost;

    // Baseline (if all were manual)
    const baselineCost = (autoCount + manualCount + avoidedCount) * 50;
    const costSavings = baselineCost - totalCost;

    const manualTime = manualCount * 20; // minutes
    const autoTime = (autoCount * 1) / 60; // minutes
    const totalTime = manualTime + autoTime;

    const baselineTime = (autoCount + manualCount + avoidedCount) * 20;
    const timeSavedHours = (baselineTime - totalTime) / 60;

    return {
        totalVolume: exceptions.length,
        resolvedCount: totalResolved,
        automationRate: Math.round(automationRate),
        costSavings: Math.round(costSavings),
        timeSavedHours: Math.round(timeSavedHours * 10) / 10, // 1 decimal
        avoidedCount
    };
};
