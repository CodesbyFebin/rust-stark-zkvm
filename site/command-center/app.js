(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const state = {
    connected: false,
    hasStark: false,
    proofBase64: null,
    proofProgram: null,
    proving: false,
    verifying: false,
  };

  const clanInfo = {
    recon: ["RECON CLAN", "⌖", "Surface mapping and authorized asset inventory adapters. No scanner is invoked by this dashboard."],
    web: ["WEB CLAN", "◎", "Web application review adapters. No target is contacted by selecting this clan."],
    api: ["API CLAN", "</>", "API schema and contract review adapters. Tool execution is not connected."],
    identity: ["IDENTITY CLAN", "◇", "Authentication and access-control review adapters. No identity provider is connected."],
    source: ["SOURCE CLAN", "⌘", "Static analysis and source-review adapters. Repository scanning is not triggered here."],
    dependencies: ["DEPENDENCIES CLAN", "⬡", "SBOM and dependency-risk review adapters. No package registry is queried."],
    config: ["CONFIG CLAN", "⚙", "Configuration validation adapters. No host configuration is read."],
    cloud: ["CLOUD CLAN", "☁", "Cloud posture review adapters. No cloud account is connected."],
    defense: ["DEFENSE CLAN", "⬢", "Policy and detection engineering adapters. No firewall or sensor is attached."],
    evidence: ["EVIDENCE CLAN", "▤", "Receipt formatting and proof-binding adapters. Only the proof API is callable in this build."],
  };

  function log(message, kind = "LOCAL") {
    const list = $("event-log");
    const item = document.createElement("li");
    const time = document.createElement("time");
    const text = document.createElement("span");
    const label = document.createElement("b");
    const now = new Date();
    time.textContent = now.toLocaleTimeString([], { hour12: false });
    text.textContent = message;
    label.textContent = kind;
    item.append(time, text, label);
    list.prepend(item);
    while (list.children.length > 30) list.lastElementChild.remove();
  }

  function setDot(id, mode) {
    const dot = $(id);
    dot.classList.remove("online", "offline", "warning");
    dot.classList.add(mode);
  }

  function setConnection(connected, hasStark = false) {
    state.connected = connected;
    state.hasStark = hasStark;
    $("api-status").textContent = connected ? "CONNECTED" : "DISCONNECTED";
    $("stark-status").textContent = hasStark ? "AVAILABLE" : connected ? "NOT REGISTERED" : "NOT CHECKED";
    $("connection-badge").textContent = connected ? "API CONNECTED" : "DISCONNECTED";
    setDot("api-dot", connected ? "online" : "offline");
    setDot("stark-dot", hasStark ? "online" : connected ? "warning" : "offline");
    $("prove-button").disabled = !connected || !hasStark || state.proving || state.verifying;
    $("verify-button").disabled = !state.proofBase64 || !connected || state.proving || state.verifying;
    $("connect-button").textContent = connected ? "REFRESH" : "CONNECT";
  }

  function baseUrl() {
    const raw = $("api-url").value.trim();
    if (!raw) throw new Error("Enter the HTTP API base URL.");
    const parsed = new URL(raw);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("The API URL must use HTTP or HTTPS.");
    }
    if (parsed.username || parsed.password) {
      throw new Error("Do not embed credentials in the API URL.");
    }
    return parsed.href.replace(/\/+$/, "");
  }

  async function readJson(response) {
    const raw = await response.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { error: raw || "The API returned a non-JSON response." };
    }
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    return data;
  }

  async function postJson(path, payload) {
    const base = baseUrl();
    const response = await fetch(base + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(65000),
    });
    return readJson(response);
  }

  function renderBackends(backends) {
    const list = $("backend-list");
    list.replaceChildren();
    const known = new Set(backends);
    const rows = [
      ["stark", known.has("stark") ? "REAL WINTERFELL BACKEND" : "NOT REGISTERED", known.has("stark")],
      ["mock-echo", known.has("mock-echo") ? "NON-CRYPTOGRAPHIC STUB · ALWAYS REJECTS" : "NOT REGISTERED", false],
    ];
    for (const [name, status, real] of rows) {
      const row = document.createElement("div");
      row.className = "backend-row";
      const label = document.createElement("span");
      const value = document.createElement("b");
      label.textContent = name;
      value.textContent = status;
      if (real) value.style.color = "var(--green)";
      row.append(label, value);
      list.append(row);
    }
  }

  async function connect() {
    const button = $("connect-button");
    button.disabled = true;
    button.textContent = "CHECKING…";
    try {
      const base = baseUrl();
      const health = await fetch(base + "/healthz", { signal: AbortSignal.timeout(10000) });
      if (!health.ok || (await health.text()).trim() !== "ok") {
        throw new Error("The API health check did not return HTTP 200 with body 'ok'.");
      }
      const backendResponse = await fetch(base + "/v1/backends", { signal: AbortSignal.timeout(10000) });
      const data = await readJson(backendResponse);
      const backends = Array.isArray(data.backends) ? data.backends : [];
      renderBackends(backends);
      setConnection(true, backends.includes("stark"));
      log("Connected to " + base + "; registered backends: " + (backends.join(", ") || "none"), "API");
      if (!backends.includes("stark")) {
        showError("The API is reachable, but no real 'stark' backend is registered. Proof generation remains disabled.");
      } else {
        clearError();
      }
    } catch (error) {
      setConnection(false, false);
      renderBackends([]);
      showError(error.message + " Check the URL, server availability, TLS, and ZKVM_ALLOWED_ORIGINS CORS configuration.");
      log("API connection failed: " + error.message, "ERROR");
    } finally {
      button.disabled = false;
      button.textContent = state.connected ? "REFRESH" : "CONNECT";
    }
  }

  function showError(message) {
    const box = $("proof-error");
    box.textContent = message;
    box.classList.remove("hidden");
  }

  function clearError() {
    $("proof-error").textContent = "";
    $("proof-error").classList.add("hidden");
  }

  function clearProof() {
    state.proofBase64 = null;
    state.proofProgram = null;
    $("proof-status").textContent = "NO PROOF";
    $("receipt-empty").classList.remove("hidden");
    $("receipt-data").classList.add("hidden");
    $("verify-button").disabled = true;
    $("dragon-proof-state").textContent = "AWAITING VERIFIER";
  }

  function currentProgram() {
    return $("program-input").value.trim();
  }

  function updateInstructionCount() {
    const count = $("program-input").value.split(/\r?\n/).filter((line) => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith("#");
    }).length;
    $("instruction-count").textContent = count + " instruction line" + (count === 1 ? "" : "s");
  }

  function decodeBase64(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function sha256Fingerprint(base64) {
    if (!window.crypto?.subtle) return "Unavailable in this browser context";
    const digest = await crypto.subtle.digest("SHA-256", decodeBase64(base64));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function prove() {
    if (!state.connected || !state.hasStark || state.proving || state.verifying) return;
    const program = currentProgram();
    if (!program) {
      showError("Enter a .zkasm program before requesting a proof.");
      return;
    }
    clearError();
    clearProof();
    state.proving = true;
    $("prove-button").disabled = true;
    $("prove-button").textContent = "PROVING…";
    log("Submitting .zkasm source to the real Stark backend.", "REQUEST");
    try {
      const data = await postJson("/v1/proofs", { program });
      if (!data.proof_base64 || !Number.isFinite(data.proof_bytes)) {
        throw new Error("The prover response did not contain proof bytes.");
      }
      state.proofBase64 = data.proof_base64;
      state.proofProgram = program;
      $("receipt-empty").classList.add("hidden");
      $("receipt-data").classList.remove("hidden");
      $("proof-status").textContent = "GENERATED · UNVERIFIED";
      $("verification-result").textContent = "GENERATED · NOT VERIFIED";
      $("proof-result").textContent = data.result ?? "Not supplied";
      $("proof-size").textContent = Number(data.proof_bytes).toLocaleString() + " bytes";
      $("proof-security").textContent = (data.security_bits ?? "Unknown") + " bits";
      $("proof-min-security").textContent = (data.minimum_security_bits ?? "Unknown") + " bits";
      $("proof-hash").textContent = await sha256Fingerprint(data.proof_base64);
      $("dragon-proof-state").textContent = "PROOF GENERATED";
      log("STARK proof returned (" + data.proof_bytes + " bytes; " + (data.security_bits ?? "unknown") + " conjectured bits). Verification is still pending.", "PROOF");
    } catch (error) {
      showError("Proof generation failed: " + error.message);
      log("Proof generation failed: " + error.message, "ERROR");
      clearProof();
    } finally {
      state.proving = false;
      $("prove-button").textContent = "GENERATE STARK PROOF";
      setConnection(state.connected, state.hasStark);
    }
  }

  async function verify() {
    if (!state.proofBase64 || !state.connected || state.verifying || state.proving) return;
    if (currentProgram() !== state.proofProgram) {
      showError("The source changed after proof generation. Generate a new proof for the current program.");
      clearProof();
      return;
    }
    clearError();
    state.verifying = true;
    $("verify-button").disabled = true;
    $("verify-button").textContent = "VERIFYING…";
    log("Submitting proof bytes and current source to the independent verification endpoint.", "REQUEST");
    try {
      const data = await postJson("/v1/verify", {
        program: state.proofProgram,
        proof_base64: state.proofBase64,
      });
      const result = $("verification-result");
      const resultWrap = document.querySelector(".receipt-result");
      if (data.valid === true) {
        result.textContent = "VALID · WINTERFELL VERIFIED";
        result.style.color = "var(--green)";
        resultWrap.classList.add("verified");
        $("proof-status").textContent = "VERIFIED";
        $("dragon-proof-state").textContent = "STARK VERIFIED";
        log("Verifier accepted the proof for the submitted public program. Security estimate: " + (data.security_bits ?? "unknown") + " bits.", "VERIFIED");
      } else {
        result.textContent = "REJECTED · INVALID";
        result.style.color = "var(--red)";
        resultWrap.classList.remove("verified");
        $("proof-status").textContent = "REJECTED";
        $("dragon-proof-state").textContent = "PROOF REJECTED";
        showError(data.error || "The verifier rejected this proof.");
        log("Verifier rejected the proof: " + (data.error || "no reason supplied"), "REJECTED");
      }
    } catch (error) {
      showError("Verification request failed: " + error.message);
      log("Verification request failed: " + error.message, "ERROR");
    } finally {
      state.verifying = false;
      $("verify-button").textContent = "VERIFY PROOF";
      setConnection(state.connected, state.hasStark);
    }
  }

  function initClans() {
    document.querySelectorAll(".clan-card").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".clan-card").forEach((item) => item.classList.remove("selected"));
        card.classList.add("selected");
        const [title, symbol, description] = clanInfo[card.dataset.clan];
        $("clan-title").textContent = title;
        $("clan-symbol").textContent = symbol;
        $("clan-description").textContent = description;
        log("Selected " + title + ". No worker or tool was started.", "UI");
      });
    });
  }

  $("connect-button").addEventListener("click", connect);
  $("prove-button").addEventListener("click", prove);
  $("verify-button").addEventListener("click", verify);
  $("program-input").addEventListener("input", () => {
    updateInstructionCount();
    if (state.proofBase64 && currentProgram() !== state.proofProgram) {
      clearProof();
      $("proof-status").textContent = "SOURCE CHANGED";
      $("verification-result").textContent = "STALE PROOF CLEARED";
      log("Program source changed; previous proof cleared to prevent stale verification.", "UI");
    }
  });
  $("clear-log").addEventListener("click", () => {
    $("event-log").replaceChildren();
    log("Journal cleared by operator.", "LOCAL");
  });

  initClans();
  updateInstructionCount();
  setConnection(false, false);
  renderBackends([]);
})();