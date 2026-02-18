"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/styles/admin.css";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/ssociety_login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;

    const headers = [
      "Name",
      "WhatsApp",
      "Email",
      "Entries",
      "Total",
      "Message",
      "Date",
    ];
    const csvRows = data.map((d: any) => [
      `"${d.fullName}"`,
      `"${d.whatsappNumber}"`,
      `"${d.email}"`,
      `"${d.interest}"`,
      `"${d.totalPrice}"`,
      `"${(d.message || "").replace(/"/g, '""')}"`,
      `"${new Date(d.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((r: any) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `registrations_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetch("/api/auth/registrations")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch registrations:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin-page">
      {/* HEADER */}
      <header className="admin-header">
        <div className="admin-title">SSOCIETY Dashboard</div>

        <div className="admin-actions">
          <button className="btn-outline" onClick={downloadCSV}>
            Download CSV
          </button>
          <button className="btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="admin-container">
        <div className="table-card">
          <div className="table-header">
            <h3>Registrations</h3>
            <span className="count-badge">{data.length} entries</span>
          </div>

          {loading ? (
            <div className="loading">Loading registrations...</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>WhatsApp</th>
                    <th>Email</th>
                    <th>Entries</th>
                    <th>Total</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((d: any) => (
                    <tr key={d._id}>
                      <td>{d.fullName}</td>
                      <td>{d.whatsappNumber}</td>
                      <td>{d.email}</td>
                      <td>{d.interest}</td>
                      <td>₹{d.totalPrice}</td>
                      <td>
                        {d.message ? (
                          <button
                            className="msg-btn"
                            onClick={() => setSelectedMessage(d.message)}
                          >
                            View
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>{new Date(d.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedMessage && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Message</h3>

            <p>{selectedMessage}</p>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
