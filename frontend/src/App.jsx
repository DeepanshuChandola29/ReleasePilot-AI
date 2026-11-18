
import React, { useEffect, useState } from "react";
import { checkBackendHealth } from "./services/api";
import ReleaseAnalysis from "./components/ReleaseAnalysis";

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Cloud,
  Code2,
  GitBranch,
  GitCommit,
  LayoutDashboard,
  Menu,
  Play,
  RefreshCw,
  Rocket,
  Settings,
  ShieldCheck,
  Terminal,
  X,
  Zap,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./index.css";

// Sample deployment data
const deploymentData = [
  {
    id: "#DEP-1082",
    name: "Frontend Production",
    branch: "main",
    risk: "LOW",
    status: "SUCCESS",
    time: "10 minutes ago",
    commit: "a83f21c",
  },
  {
    id: "#DEP-1081",
    name: "Backend API",
    branch: "develop",
    risk: "MEDIUM",
    status: "SUCCESS",
    time: "45 minutes ago",
    commit: "b72e19d",
  },
  {
    id: "#DEP-1080",
    name: "Payment Service",
    branch: "feature/payment",
    risk: "HIGH",
    status: "FAILED",
    time: "2 hours ago",
    commit: "c91a42e",
  },
  {
    id: "#DEP-1079",
    name: "Authentication Service",
    branch: "main",
    risk: "LOW",
    status: "SUCCESS",
    time: "4 hours ago",
    commit: "d45b11a",
  },
];

// Sample activity chart data
const activityData = [
  { day: "Mon", deployments: 12 },
  { day: "Tue", deployments: 18 },
  { day: "Wed", deployments: 14 },
  { day: "Thu", deployments: 24 },
  { day: "Fri", deployments: 19 },
  { day: "Sat", deployments: 28 },
  { day: "Sun", deployments: 22 },
];

// Sample risk distribution data
const riskData = [
  { name: "Low Risk", value: 65 },
  { name: "Medium Risk", value: 25 },
  { name: "High Risk", value: 10 },
];

const riskColors = ["#22c55e", "#f59e0b", "#ef4444"];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [running, setRunning] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pipelineMessage, setPipelineMessage] = useState("");

  const [backendStatus, setBackendStatus] = useState(
    "Checking backend..."
  );

  const [backendOnline, setBackendOnline] = useState(false);

  // Check backend connection
  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const data = await checkBackendHealth();

        if (isMounted) {
          setBackendStatus(data.message);
          setBackendOnline(true);
        }
      } catch (error) {
        if (isMounted) {
          setBackendStatus("Backend offline");
          setBackendOnline(false);
        }
      }
    };

    checkConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  // Demo pipeline simulation
  const startPipeline = () => {
    if (running) return;

    setRunning(true);
    setPipelineMessage("Demo pipeline is running...");

    setTimeout(() => {
      setRunning(false);
      setPipelineMessage(
        "Demo completed. This is a simulated pipeline, not a real Jenkins deployment."
      );
    }, 2500);
  };

  // Sidebar navigation
  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Deployments", icon: Rocket },
    { name: "Risk Analysis", icon: ShieldCheck },
    { name: "Pipelines", icon: GitBranch },
    { name: "Monitoring", icon: Activity },
  ];

  return (
    <div className="app-shell">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-icon">
            <Zap size={23} />
          </div>

          <div>
            <h2>ReleasePilot</h2>
            <span>AI RELEASE INTELLIGENCE</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-icon">
            <Code2 size={18} />
          </div>

          <div className="workspace-text">
            <strong>My Workspace</strong>
            <span>Personal Project</span>
          </div>

          <ChevronDown size={16} />
        </div>

        <div className="nav-label">MAIN MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                  setPipelineMessage("");
                }}
              >
                <Icon size={19} />

                <span>{item.name}</span>

                {item.name === "Deployments" && (
                  <span className="nav-count">4</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="nav-label tools-label">TOOLS</div>

        <nav className="navigation">
          <button
            className={`nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => {
              setActivePage("Settings");
              setSidebarOpen(false);
            }}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className={`nav-item ${
              activePage === "Documentation" ? "active" : ""
            }`}
            onClick={() => {
              setActivePage("Documentation");
              setSidebarOpen(false);
            }}
          >
            <CircleHelp size={19} />
            <span>Documentation</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Zap size={17} />
            </div>

            <strong>AI-powered releases</strong>

            <p>
              Predict risks before they reach production.
            </p>

            <button
              onClick={() => {
                setActivePage("Risk Analysis");
                setSidebarOpen(false);
              }}
            >
              Explore risk analysis
            </button>
          </div>

          <div className="user-profile">
            <div className="avatar">DC</div>

            <div className="user-details">
              <strong>Developer</strong>
              <span>Administrator</span>
            </div>

            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">

        {/* Top navigation bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-separator">/</span>
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="system-status">
              <span
                className="status-dot"
                style={{
                  background: backendOnline
                    ? "#22c55e"
                    : "#ef4444",
                }}
              />

              {backendStatus}
            </div>

            <div className="notification-wrapper">
              <button
                className="icon-button notification-button"
                onClick={() =>
                  setNotificationsOpen(!notificationsOpen)
                }
                aria-label="Notifications"
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <strong>Notifications</strong>
                  <p>All systems are operational.</p>
                  <p>One high-risk deployment needs review.</p>
                </div>
              )}
            </div>

            <div className="topbar-avatar">DC</div>
          </div>
        </header>

        {/* Page content */}
        <div className="dashboard-content">

          {/* Risk Analysis Page */}
          {activePage === "Risk Analysis" ? (
            <ReleaseAnalysis />

          ) : activePage === "Dashboard" ? (

            /* Dashboard Page */
            <>

              <section className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-dot" />
                    INTELLIGENT RELEASE MANAGEMENT
                  </div>

                  <h1>Dashboard</h1>

                  <p>
                    Monitor deployments, predict release risks,
                    and manage your CI/CD pipeline.
                  </p>
                </div>

                <div className="heading-actions">
                  <button className="secondary-button">
                    <RefreshCw size={16} />
                    Refresh
                  </button>

                  <button
                    className="primary-button"
                    onClick={startPipeline}
                    disabled={running}
                  >
                    {running ? (
                      <RefreshCw
                        size={17}
                        className="spin"
                      />
                    ) : (
                      <Play
                        size={16}
                        fill="currentColor"
                      />
                    )}

                    {running
                      ? "Running..."
                      : "Run Pipeline"}
                  </button>
                </div>
              </section>

              {/* Pipeline message */}
              {pipelineMessage && (
                <div className="pipeline-message">
                  <CheckCircle2 size={17} />

                  <span>{pipelineMessage}</span>

                  <button
                    onClick={() => setPipelineMessage("")}
                    aria-label="Dismiss message"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}

              {/* Statistics */}
              <section className="stats-grid">
                <StatCard
                  title="Total Deployments"
                  value="1,284"
                  change="+12.8%"
                  description="vs. last month"
                  icon={Rocket}
                  trend="up"
                />

                <StatCard
                  title="Successful Releases"
                  value="1,196"
                  change="+8.4%"
                  description="vs. last month"
                  icon={CheckCircle2}
                  trend="up"
                />

                <StatCard
                  title="Average Risk Score"
                  value="24.6%"
                  change="-5.2%"
                  description="vs. last month"
                  icon={ShieldCheck}
                  trend="up"
                />

                <StatCard
                  title="Failed Deployments"
                  value="18"
                  change="-2.1%"
                  description="vs. last month"
                  icon={AlertTriangle}
                  trend="up"
                />
              </section>

              {/* Charts */}
              <section className="charts-grid">

                {/* Deployment activity */}
                <div className="panel deployment-chart-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Deployment Activity</h3>
                      <p>
                        Deployment frequency over the last 7 days
                      </p>
                    </div>

                    <button className="select-button">
                      Last 7 days
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="chart-summary">
                    <strong>137</strong>
                    <span>deployments this week</span>

                    <span className="positive-change">
                      <ArrowUpRight size={15} />
                      14.5%
                    </span>
                  </div>

                  <div className="activity-chart">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart
                        data={activityData}
                        margin={{
                          top: 12,
                          right: 8,
                          left: -22,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="activityGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#818cf8"
                              stopOpacity={0.3}
                            />

                            <stop
                              offset="100%"
                              stopColor="#818cf8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#263247"
                          strokeDasharray="4 4"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="day"
                          stroke="#8390a5"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 12 }}
                        />

                        <YAxis
                          stroke="#8390a5"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 12 }}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#111c2e",
                            border: "1px solid #334155",
                            borderRadius: "10px",
                            color: "#fff",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="deployments"
                          stroke="#818cf8"
                          strokeWidth={3}
                          fill="url(#activityGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Risk distribution */}
                <div className="panel risk-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Release Risk Distribution</h3>
                      <p>AI-predicted risk levels</p>
                    </div>

                    <button className="icon-button">
                      <BarChart3 size={18} />
                    </button>
                  </div>

                  <div className="risk-chart">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={riskData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={67}
                          outerRadius={92}
                          paddingAngle={5}
                          stroke="none"
                        >
                          {riskData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={riskColors[index]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            background: "#111c2e",
                            border: "1px solid #334155",
                            borderRadius: "10px",
                            color: "#fff",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="risk-center">
                      <strong>65%</strong>
                      <span>Low Risk</span>
                    </div>
                  </div>

                  <div className="risk-legend">
                    {riskData.map((item, index) => (
                      <div
                        className="legend-item"
                        key={item.name}
                      >
                        <span
                          className="legend-dot"
                          style={{
                            background: riskColors[index],
                          }}
                        />

                        <span>{item.name}</span>
                        <strong>{item.value}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Recent deployments and connected services */}
              <section className="bottom-grid">

                <div className="panel deployments-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Recent Deployments</h3>
                      <p>
                        Latest release activity across your projects
                      </p>
                    </div>

                    <button
                      className="view-all-button"
                      onClick={() => setActivePage("Deployments")}
                    >
                      View all
                      <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>DEPLOYMENT</th>
                          <th>BRANCH</th>
                          <th>RISK LEVEL</th>
                          <th>STATUS</th>
                          <th>TIME</th>
                        </tr>
                      </thead>

                      <tbody>
                        {deploymentData.map((deployment) => (
                          <tr key={deployment.id}>
                            <td>
                              <div className="deployment-name">
                                <div className="deployment-icon">
                                  <GitCommit size={17} />
                                </div>

                                <div>
                                  <strong>{deployment.name}</strong>

                                  <span>
                                    {deployment.id} · {deployment.commit}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="branch-label">
                                <GitBranch size={13} />
                                {deployment.branch}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`risk-badge ${deployment.risk.toLowerCase()}`}
                              >
                                {deployment.risk}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`deployment-status ${deployment.status.toLowerCase()}`}
                              >
                                <span />
                                {deployment.status}
                              </span>
                            </td>

                            <td className="time-cell">
                              <Clock3 size={13} />
                              {deployment.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Connected services */}
                <div className="panel services-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Connected Services</h3>
                      <p>Infrastructure integrations</p>
                    </div>

                    <span className="connected-count">
                      3 connected
                    </span>
                  </div>

                  <ServiceItem
                    icon={GitBranch}
                    name="GitHub"
                    detail="Source code repository"
                    status="Connected"
                  />

                  <ServiceItem
                    icon={Terminal}
                    name="Jenkins"
                    detail="CI/CD automation"
                    status="Connected"
                  />

                  <ServiceItem
                    icon={Cloud}
                    name="Docker"
                    detail="Container deployment"
                    status="Connected"
                  />

                  <button
                    className="manage-services"
                    onClick={() => setActivePage("Settings")}
                  >
                    Manage integrations
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </section>

              {/* Dashboard footer */}
              <footer className="dashboard-footer">
                <span>
                  ReleasePilot AI · Intelligent CI/CD Platform
                </span>

                <span>
                  <span className="footer-dot" />
                  Dashboard preview · Sample data
                </span>
              </footer>

            </>

          ) : (

            /* Other pages */
            <section className="page-heading">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  RELEASEPILOT AI
                </div>

                <h1>{activePage}</h1>

                <p>
                  This section is coming soon.
                </p>
              </div>
            </section>

          )}

        </div>
      </main>
    </div>
  );
}

// Statistics card component
function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  trend,
}) {
  return (
    <div className="panel stat-card">
      <div className="stat-top">
        <span>{title}</span>

        <div className="stat-icon">
          <Icon size={19} />
        </div>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-bottom">
        <span className="stat-change">
          {trend === "up" ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}

          {change}
        </span>

        <span>{description}</span>
      </div>
    </div>
  );
}

// Connected service component
function ServiceItem({
  icon: Icon,
  name,
  detail,
  status,
}) {
  return (
    <div className="service-item">
      <div className="service-icon">
        <Icon size={19} />
      </div>

      <div className="service-details">
        <strong>{name}</strong>
        <span>{detail}</span>
      </div>

      <span className="service-status">
        <span />
        {status}
      </span>
    </div>
  );
}

export default App;
