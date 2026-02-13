import React, { useCallback, useEffect, useState, useMemo } from "react";
import { dashboardStyles } from "../assets/dummyStyles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import KpiCard from "../components/kpiCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const API_BASE = "http://localhost:4000";

/* ---------- Eye Icon ---------- */
const EyeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* helpers */
function currencyFmt(amount = 0, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(Number(amount || 0));
  } catch {
    return `${currency} ${amount}`;
  }
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
}

function getClientName(inv) {
  if (!inv) return "Client";
  if (typeof inv.client === "string") return inv.client;
  if (typeof inv.client === "object")
    return inv.client?.name || inv.client?.company || "Client";
  return "Client";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [storedInvoices, setStoredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtainToken = useCallback(async () => {
    try {
      return await getToken();
    } catch {
      return null;
    }
  }, [getToken]);

  const fetchInvoices = useCallback(async () => {
    if (storedInvoices.length === 0) setLoading(true);
    setError(null);

    try {
      const token = await obtainToken();

      const res = await fetch(`${API_BASE}/api/invoice`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch invoices");

      const json = await res.json();
      setStoredInvoices(json?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [obtainToken, storedInvoices.length]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  /* KPI */
  const kpis = useMemo(() => {
    let totalPaid = 0;
    let totalUnpaid = 0;
    let paidCount = 0;

    storedInvoices.forEach((inv) => {
  const amount = Number(inv.total ?? inv.amount ?? 0);

  if (inv.status?.toLowerCase() === "paid") {
    totalPaid += amount;
    paidCount++;
  } else {
    totalUnpaid += amount;
  }
});


    const totalAmount = totalPaid + totalUnpaid;

    return {
      totalInvoices: storedInvoices.length,
      totalPaid,
      totalUnpaid,
      paidCount,
      paidPercentage: totalAmount ? (totalPaid / totalAmount) * 100 : 0,
    };
  }, [storedInvoices]);

  const recent = storedInvoices.slice(0, 5);

  return (
    <div className={dashboardStyles.pageContainer}>
      <div className={dashboardStyles.headerContainer}>
        <h1 className={dashboardStyles.headerTitle}>Dashboard Overview</h1>
        <p className={dashboardStyles.headerSubtitle}>
          Track your invoice performance and business insights
        </p>
      </div>

      {loading && <div className="p-6">Loading invoices...</div>}
      {error && <div className="p-6 text-red-600">Error: {error}</div>}

      {/* KPI */}
      <div className={dashboardStyles.kpiGrid}>
        <KpiCard title="Total Invoices" value={kpis.totalInvoices} iconType="document" />
        <KpiCard title="Total Paid" value={currencyFmt(kpis.totalPaid)} iconType="revenue" />
        <KpiCard title="Total Unpaid" value={currencyFmt(kpis.totalUnpaid)} iconType="clock" />
      </div>

      <div className={dashboardStyles.mainGrid}>
        <div className={dashboardStyles.sidebarColumn}>
          {/* Quick Stats */}
          <div className={dashboardStyles.quickStatsCard}>
            <h3 className={dashboardStyles.quickStatsTitle}>Quick Stats</h3>

            <div className="space-y-3">
              <div className={dashboardStyles.quickStatsRow}>
                <span>Paid Rate</span>
                <span>
                  {kpis.totalInvoices
                    ? ((kpis.paidCount / kpis.totalInvoices) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>

              <div className={dashboardStyles.quickStatsRow}>
                <span>Avg. Invoice</span>
                <span>
                  {currencyFmt(
                    kpis.totalInvoices
                      ? (kpis.totalPaid + kpis.totalUnpaid) / kpis.totalInvoices
                      : 0
                  )}
                </span>
              </div>

              <div className={dashboardStyles.quickStatsRow}>
                <span>Collection Eff.</span>
                <span>{kpis.paidPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS (restored) */}
          <div className={dashboardStyles.cardContainer}>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className={dashboardStyles.quickActionsContainer}>
                <button
                  onClick={() => navigate("/app/create-invoice")}
                  className={`${dashboardStyles.quickActionButton} ${dashboardStyles.quickActionBlue}`}
                >
                  Create Invoice
                </button>

                <button
                  onClick={() => navigate("/app/invoices")}
                  className={`${dashboardStyles.quickActionButton} ${dashboardStyles.quickActionGray}`}
                >
                  View All Invoices
                </button>

                <button
                  onClick={() => navigate("/app/business")}
                  className={`${dashboardStyles.quickActionButton} ${dashboardStyles.quickActionGray}`}
                >
                  Business Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className={dashboardStyles.contentColumn}>
          <div className={dashboardStyles.cardContainerOverflow}>
            <div className={dashboardStyles.tableContainer}>
              <table className={dashboardStyles.table}>
                <thead>
                  <tr className={dashboardStyles.tableHead}>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {recent.map((inv) => (
                    <tr key={inv._id} className={dashboardStyles.tableRow}>
                      <td className={dashboardStyles.tableCell}>
                        <div className="flex items-center gap-3">
                          <div className={dashboardStyles.clientAvatar}>
                            {getClientName(inv).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={dashboardStyles.clientInfo}>
                              {getClientName(inv)}
                            </div>
                            <div className={dashboardStyles.clientSubInfo}>
                              {inv.invoiceNumber || inv._id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={dashboardStyles.tableCell}>
                        {currencyFmt(inv.total ?? inv.amount)}
                      </td>

                      <td className={dashboardStyles.tableCell}>
                        <StatusBadge status={inv.status} />
                      </td>

                      <td className={dashboardStyles.tableCell}>
                        {formatDate(inv.dueDate)}
                      </td>

                      <td className={dashboardStyles.tableCell}>
                        <button
                          onClick={() => navigate(`/app/invoices/${inv._id}`)}
                          className={dashboardStyles.actionButton}
                        >
                          <EyeIcon />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {recent.length === 0 && !loading && (
                <div className={dashboardStyles.emptyState}>
                  No invoices yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
