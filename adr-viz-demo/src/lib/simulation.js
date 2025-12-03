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
    L0: 'L0: Sources',
    L1: 'L1: Ingestion',
    L1_5: 'L1.5: Data Minimization',
    L2: 'L2: Orchestration',
    L3A: 'L3.a: Cognitive Plane',
    L3B: 'L3.b: Control Plane',
    L6: 'L6: Connectivity',
};

export const STATES = {
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
    };
};

// --- State Machine Logic ---

export const advanceException = (exception, killSwitchActive = false) => {
    const next = { ...exception, history: [...exception.history, { status: exception.status, timestamp: new Date().toISOString() }] };

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
            next.data.decision = "APPROVED";
            next.status = STATES.ACT;
            next.layer = LAYERS.L6;
            next.agent = "Policy Enforcer";
            next.activePattern = 'P7';
            addLog(`[L3.b] Control Plane received proposal.`, 'control', "Policy Enforcer", 'P6');
            addLog(`[L3.b] OPA Guardrail: Amount < $10,000 (PASS)`, 'control', "Policy Enforcer", 'P6');
            addLog(`[L3.b] DECISION: APPROVED. Signing Manifest.`, 'success', "Policy Enforcer", 'P7');
            addLog(`[L3.b] Cryptographic Signature Generated.`, 'success', "Policy Enforcer", 'P8');
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
