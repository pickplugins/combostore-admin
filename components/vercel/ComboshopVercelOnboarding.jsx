"use client";

import { useState, useCallback } from "react";

const STOREFRONT_REPO = "pickplugins/comboshop.com.bd-storefront";
const DASHBOARD_REPO = "pickplugins/comboshop.com.bd-dashboard";

function StepBar({ step }) {
  const cls = (n) => {
    if (step > n) return "h-1 flex-1 rounded-full bg-emerald-500 transition-all duration-300";
    if (step === n) return "h-1 flex-1 rounded-full bg-blue-500 transition-all duration-300";
    return "h-1 flex-1 rounded-full bg-gray-200 transition-all duration-300";
  };
  return (
    <div className="flex gap-1.5 mb-6">
      <div className={cls(1)} />
      <div className={cls(2)} />
      <div className={cls(3)} />
    </div>
  );
}

function Badge({ children, color = "blue" }) {
  const variants = {
    teal: "bg-emerald-50 text-emerald-800",
    blue: "bg-blue-50 text-blue-800",
    purple: "bg-violet-50 text-violet-800",
    amber: "bg-amber-50 text-amber-800",
  };
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${variants[color] || variants.blue}`}>
      {children}
    </span>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-xs font-medium text-gray-500 mb-1">{children}</label>;
}

function TextInput({ value, onChange, placeholder, type = "text", readOnly = false, mono = false, className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full text-sm px-3 py-2 rounded-lg border outline-none transition
        ${readOnly
          ? "border-gray-100 bg-gray-50 text-gray-400 cursor-default"
          : "border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        }
        ${mono ? "font-mono" : ""}
        ${className}`}
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
    >
      {children}
    </select>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 mb-4 ${className}`}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border border-gray-200 hover:bg-gray-50 active:scale-95 text-gray-700 text-sm px-4 py-2 rounded-lg transition-all"
    >
      {children}
    </button>
  );
}

function SectionHeading({ children }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
      {children}
    </p>
  );
}

function EnvVarEditor({ envs, onChange }) {
  const addRow = () => onChange([...envs, { key: "", value: "" }]);
  const removeRow = (i) => onChange(envs.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) =>
    onChange(envs.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));

  return (
    <div>
      {envs.map((row, i) => (
        <div key={i} className="flex gap-2 mb-2 items-center">
          <input
            className="w-36 text-xs font-mono px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="KEY"
            value={row.key}
            onChange={(e) => updateRow(i, "key", e.target.value)}
          />
          <input
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="value"
            value={row.value}
            onChange={(e) => updateRow(i, "value", e.target.value)}
          />
          <button
            onClick={() => removeRow(i)}
            className="text-gray-300 hover:text-red-400 text-xl leading-none px-1 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
      >
        + add variable
      </button>
    </div>
  );
}

function ProjectCard({
  badge, color, repoUrl, repo,
  projectName, onProjectNameChange,
  domain, domainLabel,
  buildCmd, onBuildCmd,
  outputDir, onOutputDir,
  installCmd, onInstallCmd,
  rootDir, onRootDir,
  envs, onEnvsChange,
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start gap-2 mb-4">
        <Badge color={color}>{badge}</Badge>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{projectName}</div>
          <div className="text-xs text-gray-400 mt-0.5 truncate">
            <a href={repoUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
              {repo}
            </a>
          </div>
        </div>
        <Badge color={domainLabel === "main domain" ? "purple" : "amber"}>
          {domainLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <FieldLabel>Project name in Vercel</FieldLabel>
          <TextInput value={projectName} onChange={(e) => onProjectNameChange(e.target.value)} />
        </div>
        <div>
          <FieldLabel>Assigned domain</FieldLabel>
          <TextInput value={domain} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <FieldLabel>Root directory</FieldLabel>
          <TextInput value={rootDir} onChange={(e) => onRootDir(e.target.value)} placeholder="/ (default)" />
        </div>
        <div>
          <FieldLabel>Build command</FieldLabel>
          <TextInput value={buildCmd} onChange={(e) => onBuildCmd(e.target.value)} placeholder="npm run build" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Output directory</FieldLabel>
          <TextInput value={outputDir} onChange={(e) => onOutputDir(e.target.value)} placeholder=".next / dist" />
        </div>
        <div>
          <FieldLabel>Install command</FieldLabel>
          <TextInput value={installCmd} onChange={(e) => onInstallCmd(e.target.value)} placeholder="npm install" />
        </div>
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4">
        <SectionHeading>Environment variables</SectionHeading>
        <EnvVarEditor envs={envs} onChange={onEnvsChange} />
      </div>
    </Card>
  );
}

export default function ComboshopVercelOnboarding() {
  const [step, setStep] = useState(1);
  const [tokenVisible, setTokenVisible] = useState(false);
  const [vercelToken, setVercelToken] = useState("");
  const [teamId, setTeamId] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [mainDomain, setMainDomain] = useState("");

  const [sfName, setSfName] = useState("comboshop-storefront");
  const [sfBuild, setSfBuild] = useState("");
  const [sfOutput, setSfOutput] = useState("");
  const [sfInstall, setSfInstall] = useState("");
  const [sfRoot, setSfRoot] = useState("");
  const [sfEnvs, setSfEnvs] = useState([
    { key: "NEXT_PUBLIC_SERVER_URL", value: "" },
    { key: "NEXT_PUBLIC_APP_URL", value: "" },
  ]);

  const [dbName, setDbName] = useState("comboshop-dashboard");
  const [dbBuild, setDbBuild] = useState("");
  const [dbOutput, setDbOutput] = useState("");
  const [dbInstall, setDbInstall] = useState("");
  const [dbRoot, setDbRoot] = useState("");
  const [dbEnvs, setDbEnvs] = useState([
    { key: "NEXT_PUBLIC_STORE_URL", value: "" },
    { key: "NEXT_PUBLIC_SERVER_URL", value: "" },
    { key: "NEXT_PUBLIC_APP_URL", value: "" },

  ]);

  const [logs, setLogs] = useState([]);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [deployError, setDeployError] = useState("");

  const addLog = useCallback((msg, type = "info") => {
    setLogs((prev) => [...prev, { msg, type }]);
  }, []);

  const goStep2 = () => {
    if (!vercelToken.trim()) { alert("Please enter your Vercel API token."); return; }
    if (!mainDomain.trim()) { alert("Please enter your main domain."); return; }
    setStep(2);
  };

  const buildEnvPayload = (envs) =>
    envs
      .filter((e) => e.key.trim())
      .map((e) => ({
        key: e.key.trim(),
        value: e.value,
        type: "plain",
        target: ["production", "preview", "development"],
      }));

  const deploy = async () => {
    setDeploying(true);
    setLogs([]);
    setDeployError("");

    const headers = {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    };
    const teamParam = teamId.trim() ? `?teamId=${teamId.trim()}` : "";

    try {
      addLog("→ Creating storefront project...", "info");
      const sfRes = await fetch(`https://api.vercel.com/v10/projects${teamParam}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: sfName,
          framework: framework || null,
          gitRepository: { type: "github", repo: STOREFRONT_REPO },
          environmentVariables: buildEnvPayload(sfEnvs),
          ...(sfBuild && { buildCommand: sfBuild }),
          ...(sfOutput && { outputDirectory: sfOutput }),
          ...(sfInstall && { installCommand: sfInstall }),
          ...(sfRoot && { rootDirectory: sfRoot }),
        }),
      });
      const sfData = await sfRes.json();
      if (!sfRes.ok) throw new Error(`Storefront: ${sfData.error?.message || JSON.stringify(sfData)}`);
      addLog(`✓ Storefront created — id: ${sfData.id}`, "ok");

      addLog(`→ Assigning ${mainDomain} to storefront...`, "info");
      const sfDomRes = await fetch(`https://api.vercel.com/v10/projects/${sfData.id}/domains${teamParam}`, {
        method: "POST", headers, body: JSON.stringify({ name: mainDomain }),
      });
      const sfDomData = await sfDomRes.json();
      if (!sfDomRes.ok) throw new Error(`Storefront domain: ${sfDomData.error?.message || JSON.stringify(sfDomData)}`);
      addLog(`✓ ${mainDomain} assigned to storefront`, "ok");

      addLog("→ Creating dashboard project...", "info");
      const dbRes = await fetch(`https://api.vercel.com/v10/projects${teamParam}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: dbName,
          framework: framework || null,
          gitRepository: { type: "github", repo: DASHBOARD_REPO },
          environmentVariables: buildEnvPayload(dbEnvs),
          ...(dbBuild && { buildCommand: dbBuild }),
          ...(dbOutput && { outputDirectory: dbOutput }),
          ...(dbInstall && { installCommand: dbInstall }),
          ...(dbRoot && { rootDirectory: dbRoot }),
        }),
      });
      const dbData = await dbRes.json();
      if (!dbRes.ok) throw new Error(`Dashboard: ${dbData.error?.message || JSON.stringify(dbData)}`);
      addLog(`✓ Dashboard created — id: ${dbData.id}`, "ok");

      addLog(`→ Assigning dashboard.${mainDomain}...`, "info");
      const dbDomRes = await fetch(`https://api.vercel.com/v10/projects/${dbData.id}/domains${teamParam}`, {
        method: "POST", headers, body: JSON.stringify({ name: `dashboard.${mainDomain}` }),
      });
      const dbDomData = await dbDomRes.json();
      if (!dbDomRes.ok) throw new Error(`Dashboard domain: ${dbDomData.error?.message || JSON.stringify(dbDomData)}`);
      addLog(`✓ dashboard.${mainDomain} assigned`, "ok");
      addLog("✓ All done!", "ok");

      setTimeout(() => { setDeploying(false); setDeployed(true); }, 700);
    } catch (err) {
      addLog(`✗ ${err.message}`, "err");
      setDeployError(err.message);
      setDeploying(false);
    }
  };

  const reset = () => {
    setStep(1);
    setDeployed(false);
    setDeploying(false);
    setVercelToken("");
    setMainDomain("");
    setLogs([]);
    setDeployError("");
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  /* ── Success screen ── */
  if (deployed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 font-sans">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl mx-auto mb-4">
            ✓
          </div>
          <h1 className="text-2xl font-medium text-gray-900">Projects deployed</h1>
          <p className="text-sm text-gray-500 mt-1">Both Vercel projects are live and domains are assigned.</p>
        </div>

        <Card>
          <SectionHeading>Project URLs</SectionHeading>

          <p className="text-xs text-gray-400 mb-1">Storefront</p>
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs text-gray-700 mb-3">
            <span>https://{mainDomain}</span>
            <button
              onClick={() => copyToClipboard(`https://${mainDomain}`)}
              className="text-blue-500 hover:text-blue-700 text-xs ml-4 transition-colors"
            >
              copy
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-1">Dashboard</p>
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 font-mono text-xs text-gray-700">
            <span>https://dashboard.{mainDomain}</span>
            <button
              onClick={() => copyToClipboard(`https://dashboard.${mainDomain}`)}
              className="text-blue-500 hover:text-blue-700 text-xs ml-4 transition-colors"
            >
              copy
            </button>
          </div>
        </Card>

        <div className="flex justify-end">
          <SecondaryButton onClick={reset}>Deploy another</SecondaryButton>
        </div>
      </div>
    );
  }

  /* ── Deploying screen ── */
  if (deploying) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 font-sans">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Deploying…</h1>
        <p className="text-sm text-gray-500 mb-6">Creating projects and assigning domains via Vercel API.</p>

        <Card>
          <SectionHeading>Deploy log</SectionHeading>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto space-y-1">
            {logs.map((l, i) => (
              <div
                key={i}
                className={
                  l.type === "ok" ? "text-emerald-600" :
                    l.type === "err" ? "text-red-500" :
                      "text-blue-500"
                }
              >
                {l.msg}
              </div>
            ))}
            {logs.length === 0 && <div className="text-gray-400">Starting…</div>}
          </div>

          {deployError && (
            <div className="mt-4 flex justify-start">
              <SecondaryButton onClick={() => { setDeploying(false); setStep(3); }}>
                ← Back to review
              </SecondaryButton>
            </div>
          )}
        </Card>
      </div>
    );
  }

  /* ── Main wizard ── */
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-sans">

      {/* Step 1 — Credentials & Domain */}
      {step === 1 && (
        <>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Deploy ComboStore to Vercel</h1>
          <p className="text-sm text-gray-500 mb-6">
            Set up storefront and dashboard projects from your GitHub repos in one go.
          </p>
          <StepBar step={1} />

          {/* Vercel credentials */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L1 14h14L8 1z" fill="#3B82F6" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Vercel credentials</div>
                <div className="text-xs text-gray-400">Required to create and manage projects via API</div>
              </div>
            </div>

            <div className="mb-4">
              <FieldLabel>Vercel API token</FieldLabel>
              <div className="flex gap-2">
                <input
                  type={tokenVisible ? "text" : "password"}
                  value={vercelToken}
                  onChange={(e) => setVercelToken(e.target.value)}
                  placeholder="paste your Vercel token…"
                  className="flex-1 text-sm font-mono px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
                <button
                  onClick={() => setTokenVisible((v) => !v)}
                  className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 hover:bg-gray-50 transition whitespace-nowrap"
                >
                  {tokenVisible ? "hide" : "show"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Get it from{" "}
                <a
                  href="https://vercel.com/account/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  vercel.com/account/tokens
                </a>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel>
                  Team ID{" "}
                  <span className="font-normal text-gray-300">(optional)</span>
                </FieldLabel>
                <TextInput
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  placeholder="team_xxxxxxxxxxxx"
                  mono
                />
              </div>
              <div>
                <FieldLabel>Framework preset</FieldLabel>
                <SelectInput value={framework} onChange={(e) => setFramework(e.target.value)}>
                  <option value="nextjs">Next.js</option>
                  <option value="nuxtjs">Nuxt.js</option>
                  <option value="remix">Remix</option>
                  <option value="vite">Vite</option>
                  <option value="">Other / auto-detect</option>
                </SelectInput>
              </div>
            </div>
          </Card>

          {/* Domain */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Main domain</div>
                <div className="text-xs text-gray-400">Your customer's root domain</div>
              </div>
            </div>

            <FieldLabel>Domain name</FieldLabel>
            <TextInput
              value={mainDomain}
              onChange={(e) => setMainDomain(e.target.value)}
              placeholder="e.g. mystore.com"
            />
            {mainDomain && (
              <p className="text-xs text-gray-400 mt-2">
                Storefront →{" "}
                <span className="text-blue-500 font-medium">{mainDomain}</span>
                <span className="mx-1.5">·</span>
                Dashboard →{" "}
                <span className="text-blue-500 font-medium">dashboard.{mainDomain}</span>
              </p>
            )}
          </Card>

          <div className="flex justify-end">
            <PrimaryButton className="text-white!" onClick={goStep2}>Continue →</PrimaryButton>
          </div>
        </>
      )}

      {/* Step 2 — Configure projects */}
      {step === 2 && (
        <>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Configure projects</h1>
          <p className="text-sm text-gray-500 mb-6">
            Each repo becomes a separate Vercel project with its own domain and build settings.
          </p>
          <StepBar step={2} />

          <ProjectCard
            badge="Storefront" color="teal"
            repo={STOREFRONT_REPO}
            repoUrl={`https://github.com/${STOREFRONT_REPO}`}
            projectName={sfName} onProjectNameChange={setSfName}
            domain={mainDomain} domainLabel="main domain"
            buildCmd={sfBuild} onBuildCmd={setSfBuild}
            outputDir={sfOutput} onOutputDir={setSfOutput}
            installCmd={sfInstall} onInstallCmd={setSfInstall}
            rootDir={sfRoot} onRootDir={setSfRoot}
            envs={sfEnvs} onEnvsChange={setSfEnvs}
          />

          <ProjectCard
            badge="Dashboard" color="blue"
            repo={DASHBOARD_REPO}
            repoUrl={`https://github.com/${DASHBOARD_REPO}`}
            projectName={dbName} onProjectNameChange={setDbName}
            domain={`dashboard.${mainDomain}`} domainLabel="dashboard subdomain"
            buildCmd={dbBuild} onBuildCmd={setDbBuild}
            outputDir={dbOutput} onOutputDir={setDbOutput}
            installCmd={dbInstall} onInstallCmd={setDbInstall}
            rootDir={dbRoot} onRootDir={setDbRoot}
            envs={dbEnvs} onEnvsChange={setDbEnvs}
          />

          <div className="flex justify-end gap-2.5">
            <SecondaryButton onClick={() => setStep(1)}>← Back</SecondaryButton>
            <PrimaryButton onClick={() => setStep(3)}>Review & Deploy →</PrimaryButton>
          </div>
        </>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Review & deploy</h1>
          <p className="text-sm text-gray-500 mb-6">
            Confirm the details before Vercel projects are created via API.
          </p>
          <StepBar step={3} />

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800 mb-4 space-y-1.5">
            <div>
              <span className="font-medium">Storefront:</span>{" "}
              <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{sfName}</code>
              {" → "}
              <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{mainDomain}</code>
            </div>
            <div>
              <span className="font-medium">Dashboard:</span>{" "}
              <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{dbName}</code>
              {" → "}
              <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">dashboard.{mainDomain}</code>
            </div>
            <div>
              <span className="font-medium">GitHub org:</span>{" "}
              <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">pickplugins</code>
              {" · Framework: "}
              <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{framework || "auto-detect"}</code>
            </div>
          </div>

          <Card>
            <SectionHeading>What will happen</SectionHeading>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                {
                  icon: "✓", color: "text-emerald-500",
                  text: <>Create storefront project from <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{STOREFRONT_REPO}</code> and assign to main domain</>
                },
                {
                  icon: "✓", color: "text-emerald-500",
                  text: <>Create dashboard project from <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{DASHBOARD_REPO}</code> and assign to <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">dashboard.*</code> subdomain</>
                },
                {
                  icon: "→", color: "text-blue-400",
                  text: "Environment variables will be injected into each project before first deploy"
                },
                {
                  icon: "→", color: "text-blue-400",
                  text: "Vercel will trigger initial deployments automatically on project creation"
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className={`${item.color} font-semibold mt-0.5 shrink-0`}>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex justify-end gap-2.5">
            <SecondaryButton onClick={() => setStep(2)}>← Edit</SecondaryButton>
            <PrimaryButton onClick={deploy}>Deploy both projects</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
