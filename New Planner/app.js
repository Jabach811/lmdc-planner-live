const STORAGE_KEY = "lmdcPlanner:v1:plans";
const SELECTED_KEY = "lmdcPlanner:v1:selectedPlanId";

const PHASES = [
  { id: "pre_start", label: "Pre-Start" },
  { id: "setup", label: "Setup" },
  { id: "payroll", label: "Payroll" },
  { id: "prk", label: "PRK" },
  { id: "preparation", label: "Preparation" },
  { id: "wire_day", label: "Wire Day" },
  { id: "post_wire", label: "Post Wire" },
  { id: "data_load", label: "Data Load" },
  { id: "closeout", label: "Closeout / Go-Live" }
];

const TASKS = [
  task("pre-check-vendor-workflow", "pre_start", "Check Vendor Workflow", { planTypes: ["conversion", "merger"] }, { description: "Make sure the workflow exists and inputs/outputs are good." }),

  task("setup-all-docs", "setup", "Obtain All Documents", { planTypes: ["startup", "conversion", "merger"] }, { allowNA: false, description: "PRD/Onboarding + TOA. Track status in the note." }),
  task("setup-base-template", "setup", "Base Template", { planTypes: ["startup", "conversion", "merger"] }, { warning: "Usually waits for PRD/Onboarding + TOA." }),
  task("setup-payroll-template", "setup", "Payroll Template", { planTypes: ["startup", "conversion", "merger"] }, { warning: "Usually waits for PRD/Onboarding + TOA." }),
  task("setup-re-registration", "setup", "Re-Registration", { planTypes: ["conversion", "merger"], strategiesAny: ["tik"] }, { supportsWorking: true }),
  task("setup-ftp-connection", "setup", "FTP Connection", { planTypes: ["startup", "conversion", "merger"] }, { supportsWorking: true }),
  task("setup-eds-layouts", "setup", "EDS Setup", { planTypes: ["startup", "conversion", "merger"] }),
  task("setup-vendor-workflow-confirm", "setup", "Vendor Workflow Confirm", { planTypes: ["conversion", "merger"] }),
  task("setup-informatica-prep", "setup", "Informatica Prep", { planTypes: ["conversion", "merger"] }),
  task("setup-wire-instructions-prk", "setup", "Wire Instructions to PRK", { planTypes: ["conversion", "merger"] }),

  task("payroll-complete-template", "payroll", "Complete Template", { planTypes: ["startup", "conversion", "merger"] }, { warning: "Template work can start early, but PRD/Onboarding being late can bite." }),
  task("payroll-ftp-setup", "payroll", "Confirm FTP Setup", { planTypes: ["startup", "conversion", "merger"] }),
  task("payroll-obf-confirm", "payroll", "Confirm OBF Details", { planTypes: ["startup", "conversion", "merger"] }, { description: "Confirm custom vs existing payroll layout." }),
  task("payroll-receive-test-file", "payroll", "Receive Test File", { planTypes: ["startup", "conversion", "merger"] }),
  task("payroll-validate-test-file", "payroll", "Validate Test File", { planTypes: ["startup", "conversion", "merger"] }),
  task("payroll-one-payroll", "payroll", "One Payroll Validation", { planTypes: ["startup", "conversion", "merger"] }),
  task("payroll-finalize", "payroll", "Payroll Handoff / Finalize", { planTypes: ["startup", "conversion", "merger"] }, { allowNA: false }),

  task("prk-wire-instructions", "prk", "Wire Instructions", { planTypes: ["conversion", "merger"] }),
  task("prk-all-details-dates", "prk", "Get All Asset Transfer Details", { planTypes: ["conversion", "merger"] }),
  task("prk-test-files", "prk", "Coordinate Conversion Files and Asset Transfer Details", { planTypes: ["conversion", "merger"] }),
  task("prk-tik-account-details", "prk", "TIK Account Details", { planTypes: ["conversion", "merger"], strategiesAny: ["tik"] }),

  task("prep-source-mapping", "preparation", "Source Mapping", { planTypes: ["conversion", "merger"] }),
  task("prep-fund-mapping", "preparation", "Fund Mapping", { planTypes: ["conversion", "merger"], excludeCashOnly: true }, { warning: "Fund Mapping normally needs TOA/doc readiness." }),
  task("prep-informatica", "preparation", "Informatica Workflow Testing", { planTypes: ["conversion", "merger"] }),
  task("prep-fmc", "preparation", "Fund Management Calendar Entry", { planTypes: ["conversion", "merger"] }),
  task("prep-tik", "preparation", "TIK Follow-Up with Matt", { planTypes: ["conversion", "merger"], strategiesAny: ["tik"] }),
  task("prep-pre-wire-emails", "preparation", "Pre-Wire Emails", { planTypes: ["conversion", "merger"] }, { due: { anchor: "wireDate", offsetDays: -5 } }),

  task("wire-morning-emails", "wire_day", "Morning Emails", { planTypes: ["conversion", "merger"] }, { due: { anchor: "wireDate", offsetDays: 0 } }),
  task("wire-receive-wire", "wire_day", "Receive Wire", { planTypes: ["conversion", "merger"] }, { due: { anchor: "wireDate", offsetDays: 0 } }),
  task("wire-move-process-wire", "wire_day", "Move / Process Wire", { planTypes: ["conversion", "merger"], excludeTikOnly: true }, { due: { anchor: "wireDate", offsetDays: 0 }, dynamicLabel: true }),

  task("post-receive-final-files", "post_wire", "Receive Final Files", { planTypes: ["conversion", "merger"] }, { due: { anchor: "wireDate", offsetDays: 7 } }),
  task("post-liquidate-ae", "post_wire", "Liquidate Advanced Employer", { planTypes: ["conversion", "merger"], strategiesAny: ["cash"] }, { due: { anchor: "finalFiles", offsetDays: 0 } }),
  task("post-check-tik-shares", "post_wire", "Check TIK Spreadsheet for incoming shares", { planTypes: ["conversion", "merger"], strategiesAll: ["tik"], strategiesNone: ["cash", "mapping"] }, { supportsWorking: true, due: { anchor: "finalFiles", offsetDays: 0 } }),
  task("post-ppt-balances", "post_wire", "Participant Balances", { planTypes: ["conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 0 } }),

  task("p5-extra-participants", "data_load", "Census", { planTypes: ["startup", "conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-elections", "data_load", "Elections", { planTypes: ["startup", "conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-def", "data_load", "Deferrals", { planTypes: ["startup", "conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-elig", "data_load", "Eligibility", { planTypes: ["startup", "conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-loans", "data_load", "Loans", { planTypes: ["startup", "conversion", "merger"], characteristics: { loans: true } }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-basis-roth", "data_load", "Basis/Roth", { planTypes: ["startup", "conversion", "merger"], characteristics: { roth: true } }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-yos", "data_load", "Years of Service", { planTypes: ["conversion", "merger"], excludeOneOne: true }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-ytd-comp", "data_load", "Year-to-Date Compensation", { planTypes: ["conversion", "merger"], excludeOneOne: true }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-ytd-contrib", "data_load", "Year-to-Date Contributions", { planTypes: ["conversion", "merger"], excludeOneOne: true }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-ytd-hours", "data_load", "Year-to-Date Hours", { planTypes: ["conversion", "merger"], excludeOneOne: true }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-ben", "data_load", "Beneficiaries", { planTypes: ["conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-py-comp", "data_load", "Prior Year Compensation", { planTypes: ["conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-py-hours", "data_load", "Prior Year Hours", { planTypes: ["conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("p5-py-end-balance", "data_load", "Prior Year End Balance", { planTypes: ["conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 7 } }),
  task("post-final-check", "data_load", "Final Check", { planTypes: ["conversion", "merger"] }, { due: { anchor: "finalFiles", offsetDays: 14 } }),

  task("close-go-live-meeting", "closeout", "Go-Live Meeting Complete", { planTypes: ["startup", "conversion", "merger"] }, { allowNA: false })
];

let plans = loadPlans();
let selectedPlanId = localStorage.getItem(SELECTED_KEY) || "";

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  render();
});

function task(id, phaseId, label, applies, options = {}) {
  return {
    id,
    phaseId,
    label,
    applies,
    allowNA: options.allowNA !== false,
    supportsWorking: !!options.supportsWorking,
    description: options.description || "",
    warning: options.warning || "",
    due: options.due || null,
    dynamicLabel: !!options.dynamicLabel
  };
}

function bindElements() {
  [
    "dashboard", "detailPanel", "summaryChips", "newPlanBtn", "archiveBtn", "exportBtn", "importInput",
    "planModal", "closeModalBtn", "cancelFormBtn", "planForm", "planModalTitle", "planId",
    "planName", "caseNumber", "planType", "mergerType", "effectiveDate", "firstPayrollTaDate",
    "wireDate", "isOneOnePlan", "autoEnroll", "loans", "roth", "nonQual", "payrollVendor",
    "payrollName", "payrollEmail", "priorVendor", "priorName", "priorEmail", "clientFolderUrl",
    "dcFileCoordinator", "planNotes"
  ].forEach(id => els[id] = document.getElementById(id));
}

function bindEvents() {
  els.newPlanBtn.addEventListener("click", () => openPlanModal());
  els.archiveBtn.addEventListener("click", showArchive);
  els.exportBtn.addEventListener("click", exportJson);
  els.importInput.addEventListener("change", importJson);
  els.closeModalBtn.addEventListener("click", closePlanModal);
  els.cancelFormBtn.addEventListener("click", closePlanModal);
  els.planModal.addEventListener("click", event => {
    if (event.target === els.planModal) closePlanModal();
  });
  els.planForm.addEventListener("submit", savePlanFromForm);
  els.planType.addEventListener("change", syncPlanTypeVisibility);
}

function loadPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Could not parse saved plans", error);
    return [];
  }
}

let persistFailureNotified = false;

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    if (selectedPlanId) localStorage.setItem(SELECTED_KEY, selectedPlanId);
    persistFailureNotified = false;
  } catch (error) {
    console.warn("Could not save plans", error);
    if (!persistFailureNotified) {
      persistFailureNotified = true;
      alert("Could not save your changes — browser storage is full or blocked. Export your plans to avoid losing work.");
    }
  }
}

function render() {
  normalizeSelection();
  renderSummary();
  renderDashboard();
  renderDetail();
}

function normalizeSelection() {
  if (selectedPlanId && plans.some(plan => plan.id === selectedPlanId)) return;
  const visible = visiblePlans();
  selectedPlanId = visible[0]?.id || "";
}

function visiblePlans() {
  return plans.filter(plan => plan.status !== "complete" && plan.status !== "on_hold");
}

function renderSummary() {
  const visible = visiblePlans();
  const payrollWatchCount = visible.filter(plan => getPayrollWatch(plan)).length;
  const overdueCount = visible.reduce((sum, plan) => sum + dashboardBuckets(plan).overdue.length, 0);
  els.summaryChips.innerHTML = [
    chip(`${visible.length} visible`),
    chip(`${overdueCount} overdue`),
    chip(`${payrollWatchCount} payroll watch`)
  ].join("");
}

function chip(text) {
  return `<span class="chip">${escapeHtml(text)}</span>`;
}

function renderDashboard() {
  const visible = visiblePlans();
  if (!visible.length) {
    els.dashboard.innerHTML = `<div class="empty-state">
      <h2>No active plans yet</h2>
      <p>Create the first plan shell. You can add details as the plan gets real.</p>
      <button class="btn btn-primary" type="button" onclick="openPlanModal()">New Plan</button>
    </div>`;
    return;
  }

  els.dashboard.innerHTML = visible.map(plan => renderPlanCard(plan)).join("");
}

function renderPlanCard(plan) {
  const buckets = dashboardBuckets(plan);
  const warnings = getPlanWarnings(plan);
  const payrollWatch = getPayrollWatch(plan);
  const warningHtml = [...warnings, ...(payrollWatch ? [payrollWatch] : [])]
    .map(w => `<div class="warning${w.urgent ? " urgent" : ""}">${escapeHtml(w.message)}</div>`)
    .join("");

  return `<article class="plan-card${plan.id === selectedPlanId ? " active" : ""}">
    <div class="plan-card-head">
      <div>
        <div class="plan-title">
          <button type="button" onclick="selectPlan('${plan.id}')">${escapeHtml(plan.intake.planName || "Untitled Plan")}</button>
          <span class="status-pill">${statusLabel(plan.status)}</span>
        </div>
        <div class="plan-meta">
          <span>${escapeHtml(plan.intake.caseNumber || "No case")}</span>
          <span>Effective ${formatDate(plan.intake.effectiveDate)}</span>
          <span>First payroll ${formatDate(plan.intake.firstPayrollTaDate)}</span>
          ${plan.intake.wireDate ? `<span>Wire ${formatDate(plan.intake.wireDate)}</span>` : ""}
        </div>
      </div>
      <div class="plan-card-actions">
        <button class="mini-btn" type="button" onclick="openPlanModal('${plan.id}')">Edit</button>
        <button class="mini-btn" type="button" onclick="toggleHold('${plan.id}')">Hold</button>
        <button class="mini-btn dark" type="button" onclick="selectPlan('${plan.id}')">Open</button>
      </div>
    </div>
    ${warningHtml ? `<div class="warning-list">${warningHtml}</div>` : ""}
    <div class="dash-sections">
      ${renderDashSection("Overdue", buckets.overdue)}
      ${renderDashSection("This Week", buckets.thisWeek)}
      ${renderDashSection("Next Steps", buckets.nextSteps)}
      ${payrollWatch ? renderPayrollWatch(payrollWatch) : ""}
    </div>
  </article>`;
}

function renderDashSection(label, items) {
  if (!items.length) return "";
  return `<section class="dash-section">
    <h4>${label}</h4>
    <div class="task-list">${items.map(renderDashTask).join("")}</div>
  </section>`;
}

function renderDashTask(item) {
  return `<div class="dash-task">
    <div>
      <strong>${escapeHtml(item.label)}</strong>
      <span>${escapeHtml(item.phaseLabel)}${item.dueDate ? " / due " + formatDate(item.dueDate) : ""}</span>
    </div>
    <span class="status-pill">${escapeHtml(item.status)}</span>
  </div>`;
}

function renderPayrollWatch(watch) {
  return `<section class="dash-section">
    <h4>Payroll Watch</h4>
    <div class="warning${watch.urgent ? " urgent" : ""}">${escapeHtml(watch.message)}</div>
  </section>`;
}

function renderDetail() {
  const plan = plans.find(p => p.id === selectedPlanId);
  if (!plan) {
    els.detailPanel.innerHTML = `<div class="empty-detail">
      <h2>Select or create a plan</h2>
      <p>Plans start in Pre-Start. Checking Obtain All Documents moves them to Active.</p>
    </div>`;
    return;
  }

  const applicable = getApplicableTasks(plan);
  const grouped = PHASES.map(phase => ({
    ...phase,
    tasks: applicable.filter(taskDef => taskDef.phaseId === phase.id)
  })).filter(phase => phase.tasks.length);

  const history = (plan.dateHistory || []).slice(-5).reverse();

  els.detailPanel.innerHTML = `<div class="detail-head">
    <div class="detail-head-top">
      <div>
        <h2>${escapeHtml(plan.intake.planName)}</h2>
        <p>${escapeHtml(plan.intake.caseNumber)} / ${escapeHtml(plan.intake.planType)}</p>
      </div>
      <button class="btn btn-outline" type="button" onclick="openPlanModal('${plan.id}')">Edit Intake</button>
    </div>
    <div class="detail-meta">
      <span class="chip">${statusLabel(plan.status)}</span>
      <span class="chip">Effective ${formatDate(plan.intake.effectiveDate)}</span>
      <span class="chip">First Payroll ${formatDate(plan.intake.firstPayrollTaDate)}</span>
      ${plan.intake.wireDate ? `<span class="chip">Wire ${formatDate(plan.intake.wireDate)}</span>` : ""}
    </div>
  </div>
  <div class="note-box">
    <label for="detailPlanNotes">Plan Notes</label>
    <textarea id="detailPlanNotes" rows="3" oninput="updatePlanNotes('${plan.id}', this.value)">${escapeHtml(plan.notes || "")}</textarea>
  </div>
  ${history.length ? `<div class="history-box">
    <div class="form-section-title">Date history</div>
    <p>${history.map(h => `${fieldLabel(h.field)} changed to ${formatDate(h.newDate)}`).join("<br>")}</p>
  </div>` : ""}
  <div class="phase-list">${grouped.map(phase => renderPhase(plan, phase)).join("")}</div>`;
}

function renderPhase(plan, phase) {
  const done = phase.tasks.filter(taskDef => taskState(plan, taskDef.id).status === "done").length;
  const eligible = phase.tasks.filter(taskDef => taskState(plan, taskDef.id).status !== "na").length;
  return `<section class="phase">
    <div class="phase-head">
      <h3>${escapeHtml(phase.label)}</h3>
      <div class="phase-count">${done} / ${eligible} done</div>
    </div>
    ${phase.tasks.map(taskDef => renderTaskRow(plan, taskDef)).join("")}
  </section>`;
}

function renderTaskRow(plan, taskDef) {
  const state = taskState(plan, taskDef.id);
  const dueDate = getTaskDueDate(plan, taskDef);
  const warnings = getTaskWarnings(plan, taskDef);
  const label = taskLabel(plan, taskDef);
  return `<div class="task-row">
    <div class="task-main">
      <div>
        <div class="task-name">${escapeHtml(label)}</div>
        <div class="task-sub">${escapeHtml(taskDef.description || phaseLabel(taskDef.phaseId))}${dueDate ? " / due " + formatDate(dueDate) : ""}</div>
        ${warnings.map(w => `<div class="task-warning">${escapeHtml(w)}</div>`).join("")}
      </div>
      <div class="task-controls">
        ${statusButton(plan.id, taskDef.id, state.status, "open", "Open")}
        ${statusButton(plan.id, taskDef.id, state.status, "working", "Working")}
        ${statusButton(plan.id, taskDef.id, state.status, "done", "Done")}
        ${taskDef.allowNA ? statusButton(plan.id, taskDef.id, state.status, "na", "N/A") : ""}
      </div>
    </div>
    <div class="task-note">
      <label>Task note</label>
      <textarea rows="2" placeholder="Two sentences max, future-you will thank you." oninput="updateTaskNote('${plan.id}', '${taskDef.id}', this.value)">${escapeHtml(state.note || "")}</textarea>
    </div>
  </div>`;
}

function statusButton(planId, taskId, current, status, label) {
  return `<button class="status-btn ${status}${current === status ? " active" : ""}" type="button" onclick="setTaskStatus('${planId}', '${taskId}', '${status}')">${label}</button>`;
}

function openPlanModal(planId = "") {
  const plan = plans.find(p => p.id === planId);
  els.planForm.reset();
  els.planId.value = plan?.id || "";
  els.planModalTitle.textContent = plan ? "Edit Plan" : "New Plan";

  if (plan) fillForm(plan);
  else {
    els.planType.value = "startup";
    const today = toDateInput(new Date());
    els.effectiveDate.value = today;
    els.firstPayrollTaDate.value = today;
  }

  syncPlanTypeVisibility();
  els.planModal.classList.add("open");
  els.planModal.setAttribute("aria-hidden", "false");
  setTimeout(() => els.planName.focus(), 0);
}

function closePlanModal() {
  els.planModal.classList.remove("open");
  els.planModal.setAttribute("aria-hidden", "true");
}

function fillForm(plan) {
  els.planName.value = plan.intake.planName || "";
  els.caseNumber.value = plan.intake.caseNumber || "";
  els.planType.value = plan.intake.planType || "startup";
  els.mergerType.value = plan.intake.mergerType || "";
  els.effectiveDate.value = plan.intake.effectiveDate || "";
  els.firstPayrollTaDate.value = plan.intake.firstPayrollTaDate || "";
  els.wireDate.value = plan.intake.wireDate || "";
  document.querySelectorAll("[name='strategy']").forEach(input => {
    input.checked = (plan.intake.strategies || []).includes(input.value);
  });
  els.isOneOnePlan.checked = !!plan.characteristics.isOneOnePlan;
  els.autoEnroll.checked = !!plan.characteristics.autoEnroll;
  els.loans.checked = !!plan.characteristics.loans;
  els.roth.checked = !!plan.characteristics.roth;
  els.nonQual.checked = !!plan.characteristics.nonQual;
  els.payrollVendor.value = plan.intake.contacts.payroll?.vendorName || "";
  els.payrollName.value = plan.intake.contacts.payroll?.name || "";
  els.payrollEmail.value = plan.intake.contacts.payroll?.email || "";
  els.priorVendor.value = plan.intake.contacts.priorRecordKeeper?.vendorName || "";
  els.priorName.value = plan.intake.contacts.priorRecordKeeper?.name || "";
  els.priorEmail.value = plan.intake.contacts.priorRecordKeeper?.email || "";
  els.clientFolderUrl.value = plan.intake.clientFolderUrl || "";
  els.dcFileCoordinator.value = plan.intake.dcFileCoordinator || "";
  els.planNotes.value = plan.notes || "";
}

function syncPlanTypeVisibility() {
  const nonStartup = els.planType.value !== "startup";
  const merger = els.planType.value === "merger";
  document.querySelectorAll(".non-startup-only").forEach(el => el.classList.toggle("hidden", !nonStartup));
  document.querySelectorAll(".merger-only").forEach(el => el.classList.toggle("hidden", !merger));
}

function makePlanId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function savePlanFromForm(event) {
  event.preventDefault();
  const id = els.planId.value || makePlanId();
  const existing = plans.find(plan => plan.id === id);
  const oldIntake = existing?.intake || {};
  const now = new Date().toISOString();
  const strategies = [...document.querySelectorAll("[name='strategy']:checked")].map(input => input.value);
  const planType = els.planType.value;

  if (planType !== "startup" && !strategies.length) {
    alert("Pick at least one conversion strategy.");
    return;
  }
  if (planType === "merger" && !els.mergerType.value) {
    alert("Pick a merger type.");
    return;
  }

  const next = existing ? structuredClone(existing) : {
    id,
    createdAt: now,
    status: "pre_start",
    tasks: {},
    dateHistory: []
  };

  next.updatedAt = now;
  next.intake = {
    planName: els.planName.value.trim(),
    caseNumber: els.caseNumber.value.trim(),
    planType,
    mergerType: planType === "merger" ? els.mergerType.value : "",
    strategies: planType === "startup" ? [] : strategies,
    effectiveDate: els.effectiveDate.value,
    firstPayrollTaDate: els.firstPayrollTaDate.value,
    wireDate: planType === "startup" ? "" : els.wireDate.value,
    clientFolderUrl: els.clientFolderUrl.value.trim(),
    dcFileCoordinator: els.dcFileCoordinator.value,
    contacts: {
      clientExtras: [],
      payrollExtras: [],
      priorExtras: [],
      payroll: {
        vendorName: els.payrollVendor.value.trim(),
        name: els.payrollName.value.trim(),
        email: els.payrollEmail.value.trim()
      },
      priorRecordKeeper: {
        vendorName: els.priorVendor.value.trim(),
        name: els.priorName.value.trim(),
        email: els.priorEmail.value.trim()
      }
    }
  };
  next.characteristics = {
    isOneOnePlan: els.isOneOnePlan.checked || isJanOne(next.intake.effectiveDate),
    autoEnroll: els.autoEnroll.checked,
    loans: els.loans.checked,
    roth: els.roth.checked,
    nonQual: els.nonQual.checked
  };
  next.notes = els.planNotes.value;
  next.dateHistory = [
    ...(next.dateHistory || []),
    ...dateChanges(oldIntake, next.intake, now)
  ];

  ensureTaskStates(next);
  updateLifecycle(next);

  const index = plans.findIndex(plan => plan.id === id);
  if (index >= 0) plans[index] = next;
  else plans.push(next);
  selectedPlanId = next.id;

  persist();
  closePlanModal();
  render();
}

function ensureTaskStates(plan) {
  getApplicableTasks(plan).forEach(taskDef => {
    if (!plan.tasks[taskDef.id]) {
      plan.tasks[taskDef.id] = {
        taskId: taskDef.id,
        status: "open",
        note: "",
        updatedAt: new Date().toISOString()
      };
    }
  });
}

function dateChanges(oldIntake, nextIntake, changedAt) {
  return ["effectiveDate", "wireDate", "firstPayrollTaDate"]
    .filter(field => oldIntake[field] && oldIntake[field] !== nextIntake[field])
    .map(field => ({ field, newDate: nextIntake[field], changedAt }));
}

function selectPlan(planId) {
  selectedPlanId = planId;
  persist();
  render();
}

function toggleHold(planId) {
  const plan = plans.find(p => p.id === planId);
  if (!plan) return;
  plan.status = plan.status === "on_hold" ? "active" : "on_hold";
  plan.updatedAt = new Date().toISOString();
  persist();
  render();
}

function setTaskStatus(planId, taskId, status) {
  const plan = plans.find(p => p.id === planId);
  if (!plan) return;
  const state = taskState(plan, taskId);
  state.status = status;
  state.updatedAt = new Date().toISOString();
  state.completedAt = status === "done" ? state.updatedAt : "";
  plan.tasks[taskId] = state;
  plan.updatedAt = state.updatedAt;
  updateLifecycle(plan);
  persist();
  render();
}

function updateTaskNote(planId, taskId, note) {
  const plan = plans.find(p => p.id === planId);
  if (!plan) return;
  const state = taskState(plan, taskId);
  state.note = note;
  state.updatedAt = new Date().toISOString();
  plan.tasks[taskId] = state;
  plan.updatedAt = state.updatedAt;
  persist();
}

function updatePlanNotes(planId, notes) {
  const plan = plans.find(p => p.id === planId);
  if (!plan) return;
  plan.notes = notes;
  plan.updatedAt = new Date().toISOString();
  persist();
}

function updateLifecycle(plan) {
  if (taskState(plan, "setup-all-docs").status === "done" && plan.status === "pre_start") {
    plan.status = "active";
  }
  if (taskState(plan, "setup-all-docs").status !== "done" && plan.status === "active") {
    plan.status = "pre_start";
  }
  if (taskState(plan, "close-go-live-meeting").status === "done" && taskState(plan, "payroll-finalize").status === "done") {
    plan.status = "complete";
    plan.archivedAt = plan.archivedAt || new Date().toISOString();
  }
}

function getApplicableTasks(plan) {
  return TASKS.filter(taskDef => appliesToPlan(taskDef, plan)).map(taskDef => ({
    ...taskDef,
    label: taskLabel(plan, taskDef)
  }));
}

function appliesToPlan(taskDef, plan) {
  const rule = taskDef.applies;
  if (rule.planTypes && !rule.planTypes.includes(plan.intake.planType)) return false;
  const strategies = plan.intake.strategies || [];
  if (rule.strategiesAny && !rule.strategiesAny.some(s => strategies.includes(s))) return false;
  if (rule.strategiesAll && !rule.strategiesAll.every(s => strategies.includes(s))) return false;
  if (rule.strategiesNone && rule.strategiesNone.some(s => strategies.includes(s))) return false;
  if (rule.excludeCashOnly && strategies.length === 1 && strategies[0] === "cash") return false;
  if (rule.excludeTikOnly && strategies.length === 1 && strategies[0] === "tik") return false;
  if (rule.characteristics) {
    for (const [key, value] of Object.entries(rule.characteristics)) {
      if (!!plan.characteristics[key] !== value) return false;
    }
  }
  if (rule.excludeOneOne && isOneOnePlan(plan)) return false;
  return true;
}

function isOneOnePlan(plan) {
  return !!plan.characteristics.isOneOnePlan || isJanOne(plan.intake.effectiveDate);
}

function taskLabel(plan, taskDef) {
  if (taskDef.id === "wire-move-process-wire") {
    const strategies = plan.intake.strategies || [];
    if (strategies.includes("cash")) return "Transfer wire to Advanced Employer";
    if (strategies.includes("mapping")) return "Map Funds";
  }
  return taskDef.label;
}

function taskState(plan, taskId) {
  return plan.tasks?.[taskId] || {
    taskId,
    status: "open",
    note: "",
    updatedAt: plan.updatedAt || new Date().toISOString()
  };
}

function getTaskDueDate(plan, taskDef) {
  if (!taskDef.due) return null;
  let anchor = "";
  if (taskDef.due.anchor === "wireDate") anchor = plan.intake.wireDate;
  if (taskDef.due.anchor === "firstPayroll") anchor = plan.intake.firstPayrollTaDate;
  if (taskDef.due.anchor === "finalFiles") {
    anchor = taskState(plan, "post-receive-final-files").completedAt?.slice(0, 10) || addDays(plan.intake.wireDate, 7);
  }
  if (!anchor) return null;
  return addDays(anchor, taskDef.due.offsetDays || 0);
}

function dashboardBuckets(plan) {
  const tasks = getApplicableTasks(plan)
    .filter(taskDef => ["open", "working"].includes(taskState(plan, taskDef.id).status))
    .map(taskDef => toDashboardTask(plan, taskDef));
  const today = startOfDay(new Date());
  const end = new Date(today);
  end.setDate(today.getDate() + 7);
  const overdue = tasks.filter(item => item.dueDate && parseDate(item.dueDate) < today);
  const thisWeek = tasks.filter(item => item.dueDate && parseDate(item.dueDate) >= today && parseDate(item.dueDate) <= end);
  const used = new Set([...overdue, ...thisWeek].map(item => item.taskId));
  const nextSteps = tasks.filter(item => !used.has(item.taskId));
  return { overdue, thisWeek, nextSteps };
}

function toDashboardTask(plan, taskDef) {
  const state = taskState(plan, taskDef.id);
  return {
    taskId: taskDef.id,
    label: taskLabel(plan, taskDef),
    phaseLabel: phaseLabel(taskDef.phaseId),
    dueDate: getTaskDueDate(plan, taskDef),
    status: state.status
  };
}

function getPlanWarnings(plan) {
  const warnings = [];
  const payroll = plan.intake.contacts.payroll || {};
  const prior = plan.intake.contacts.priorRecordKeeper || {};
  if (!payroll.vendorName || !payroll.name) {
    warnings.push({ message: "Payroll vendor/contact is missing." });
  }
  if (plan.intake.planType !== "startup" && (!prior.vendorName || !prior.name)) {
    warnings.push({ message: "Prior record keeper/contact is missing." });
  }
  if ((plan.intake.strategies || []).includes("tik") && plan.intake.wireDate) {
    const days = daysBetween(new Date(), parseDate(plan.intake.wireDate));
    if (days <= 7 && days >= 0 && taskState(plan, "prk-tik-account-details").status !== "done") {
      warnings.push({ message: "Wire is within 7 days and TIK Account Details are not done.", urgent: true });
    }
  }
  return warnings;
}

function getTaskWarnings(plan, taskDef) {
  const warnings = [];
  const docsDone = taskState(plan, "setup-all-docs").status === "done";
  if (!docsDone && ["setup-base-template", "setup-payroll-template", "payroll-complete-template", "prep-fund-mapping"].includes(taskDef.id)) {
    warnings.push(taskDef.warning || "This usually waits for Obtain All Documents.");
  }
  return warnings;
}

function getPayrollWatch(plan) {
  if (!plan.intake.firstPayrollTaDate) return null;
  if (taskState(plan, "payroll-finalize").status === "done") return null;
  const days = daysBetween(new Date(), parseDate(plan.intake.firstPayrollTaDate));
  if (days > 14) return null;
  const overdue = days < 0;
  const urgent = days <= 7;
  return {
    urgent,
    message: overdue
      ? `First payroll passed ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago and payroll is not handed off.`
      : `First payroll is in ${days} day${days === 1 ? "" : "s"} and Payroll Handoff / Finalize is not done.`
  };
}

function showArchive() {
  const archived = plans.filter(plan => plan.status === "complete");
  if (!archived.length) {
    alert("No completed plans in archive yet.");
    return;
  }
  alert(archived.map(plan => `${plan.intake.planName} / ${plan.intake.caseNumber}`).join("\n"));
}

function exportJson() {
  const payload = {
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    appName: "LMDC Planner",
    plans
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lmdc-planner-export-${toDateInput(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || data.exportVersion !== 1 || !Array.isArray(data.plans)) {
        throw new Error("Invalid export");
      }
      if (plans.length) {
        const proceed = confirm(`Import ${data.plans.length} plan(s)? Plans with matching IDs will be updated and your other ${plans.length} existing plan(s) will be kept.`);
        if (!proceed) return;
      }
      const byId = new Map(plans.map(plan => [plan.id, plan]));
      data.plans.forEach(plan => byId.set(plan.id, plan));
      plans = [...byId.values()];
      selectedPlanId = visiblePlans()[0]?.id || "";
      persist();
      render();
    } catch (error) {
      alert("Could not import that JSON file.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function statusLabel(status) {
  return ({ pre_start: "Pre-Start", active: "Active", on_hold: "On Hold", complete: "Complete" })[status] || status;
}

function phaseLabel(phaseId) {
  return PHASES.find(phase => phase.id === phaseId)?.label || phaseId;
}

function fieldLabel(field) {
  return ({ effectiveDate: "Effective Date", wireDate: "Wire Date", firstPayrollTaDate: "First Payroll" })[field] || field;
}

function formatDate(value) {
  if (!value) return "-";
  const date = parseDate(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function toDateInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(value, days) {
  if (!value) return "";
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysBetween(from, to) {
  return Math.ceil((startOfDay(to) - startOfDay(from)) / 86400000);
}

function isJanOne(value) {
  if (!value) return false;
  const date = parseDate(value);
  return date.getMonth() === 0 && date.getDate() === 1;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
