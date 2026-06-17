import React, { useState, useEffect, useCallback } from 'react';
import { reportAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PrintReport, { exportCSV } from '../components/PrintReport';
import './ReportsPage.css';
 
const MONTHS = ['April','May','June','July','August','September','October','November','December','January','February','March'];
const BRANCH_NAMES = [
  'Barmer Main','VDR Barmer','Gudamalani','Balotra','Jaisalmer','Pokaran',
  'Jalore','Bhinmal','Ahore','Sayala','Sanchore Main','VU Sanchore',
  'Jodhpur Main','Jodhpur Marwar','Nandanvan','Saraswati Nagar','Ratanada','Paota',
  'Suryanagari','Mathaniya','Osian','Pipar Nagar','Bap','Phalodi',
  'Pali','Sojat','Sumerpur Sheoganj','Falna Bali','Sadri','Vivekanand Shakha Pali',
  'Devnagri Sirohi','Pindwara','Aburoad','Mount Abu',
];
 
const PROJECT_LABELS = {
  'sanskarGatividhi.nsgc': 'NSGC',
  'sanskarGatividhi.bharatKoJano': 'Bharat Ko Jano',
  'sanskarGatividhi.gvca': 'GVCA',
  'sanskarGatividhi.interCollege': 'Inter College',
  'sanskarGatividhi.yuvaSanskar': 'Yuva Sanskar',
  'sewaGatividhi.medicalCamp': 'Medical Camp',
  'sewaGatividhi.healthAwareness': 'Health Awareness',
  'sewaGatividhi.bloodDonation': 'Blood Donation',
  'sewaGatividhi.divyangSahayta': 'Divyang Sahayta',
  'sewaGatividhi.vanvasiSahayta': 'Vanvasi Sahayta',
  'sewaGatividhi.gramVikas': 'Gram Vikas',
  'sewaGatividhi.helpingNeedy': 'Helping Needy',
  'environmentGatividhi': 'Environment',
  'mahilaSahbhagita.betiPadhao': 'Beti Padhao',
  'mahilaSahbhagita.anemiaMukt': 'Anemia Mukt',
  'mahilaSahbhagita.atmnirbhar': 'Atmnirbhar',
  'mahilaSahbhagita.baalSanskar': 'Baal Sanskar',
  'mahilaSahbhagita.familyAdoption': 'Family Adoption',
  'samparkGatividhi.sankritSaptah': 'Sanskriti Saptah',
  'samparkGatividhi.samuhikVivah': 'Samuhik Vivah',
  'samparkGatividhi.bvpSthapnaDiwas': 'BVP Sthapna Diwas',
  'samparkGatividhi.vichargosthi': 'Vichar Gosthi',
  'samparkGatividhi.navVarsh': 'Nav Varsh',
  'samparkGatividhi.ekShakha': 'Ek Shakha Ek Gaon',
};
 
function getFinancialYear() {
  const now = new Date();
  const m = now.getMonth();
  return m >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

function deepSum(target, source) {
  for (const key of Object.keys(source)) {
    const sv = source[key];
    if (typeof sv === 'number') {
      target[key] = (target[key] || 0) + sv;
    } else if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
      if (!target[key]) target[key] = {};
      deepSum(target[key], sv);
    }
  }
}

function buildPrantTotal(reports, month, year) {
  const prant = {
    branchName: 'PRANT TOTAL',
    prantName: 'Rajasthan Pashchim',
    districtName: 'All Districts',
    reportMonth: month,
    reportYear: year,
    primaryInfo: {},
    sanskarGatividhi: {},
    sewaGatividhi: {},
    environmentGatividhi: {},
    mahilaSahbhagita: {},
    samparkGatividhi: {},
    permanentSewa: [],
    meetings: { executive: [], generalBody: [], workingGroup: [] },
  };

  for (const r of reports) {
    if (r.primaryInfo) deepSum(prant.primaryInfo, r.primaryInfo);
    if (r.sanskarGatividhi) deepSum(prant.sanskarGatividhi, r.sanskarGatividhi);
    if (r.sewaGatividhi) deepSum(prant.sewaGatividhi, r.sewaGatividhi);
    if (r.environmentGatividhi) deepSum(prant.environmentGatividhi, r.environmentGatividhi);
    if (r.mahilaSahbhagita) deepSum(prant.mahilaSahbhagita, r.mahilaSahbhagita);
    if (r.samparkGatividhi) deepSum(prant.samparkGatividhi, r.samparkGatividhi);

    (r.permanentSewa || []).forEach(ps => {
      if (!ps.service) return;
      const existing = prant.permanentSewa.find(p => p.service === ps.service);
      if (existing) {
        existing.prev_projects += (ps.prev_projects || 0);
        existing.prev_beneficiary += (ps.prev_beneficiary || 0);
        existing.prev_cost += (ps.prev_cost || 0);
        existing.curr_projects += (ps.curr_projects || 0);
        existing.curr_beneficiary += (ps.curr_beneficiary || 0);
        existing.curr_cost += (ps.curr_cost || 0);
      } else {
        prant.permanentSewa.push({ ...ps });
      }
    });
  }

  return prant;
}
 
export default function ReportsPage() {
  const { user, isPrant, isBranch } = useAuth();
  const [tab, setTab] = useState(isBranch ? 'branch' : 'consolidated');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [selectedYear, setSelectedYear] = useState(getFinancialYear());
  const [reports, setReports] = useState([]);
  const [consolidated, setConsolidated] = useState(null);
  const [projectWise, setProjectWise] = useState(null);
  const [branchHistory, setBranchHistory] = useState([]);
  const [selectedProject, setSelectedProject] = useState('sanskarGatividhi.gvca');
  const [loading, setLoading] = useState(false);
  const [viewReport, setViewReport] = useState(null);
  const [printReport, setPrintReport] = useState(null);
 
  const fetchBranchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportAPI.getBranchHistory({ branch: user?.branchName, year: selectedYear });
      setBranchHistory(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load branch history');
    }
    setLoading(false);
  }, [user?.branchName, selectedYear]);
 
  const fetchConsolidated = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportAPI.getConsolidated({ month: selectedMonth, year: selectedYear });
      setConsolidated(res.data.data);
    } catch (err) {
      toast.error('Failed to load consolidated report');
    }
    setLoading(false);
  }, [selectedMonth, selectedYear]);
 
  const fetchProjectWise = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportAPI.getProjectWise({ month: selectedMonth, year: selectedYear });
      setProjectWise(res.data.data);
    } catch (err) {
      toast.error('Failed to load project-wise report');
    }
    setLoading(false);
  }, [selectedMonth, selectedYear]);
 
  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportAPI.getAll({ month: selectedMonth, year: selectedYear });
      setReports(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load reports');
    }
    setLoading(false);
  }, [selectedMonth, selectedYear]);
 
  useEffect(() => {
    if (tab === 'branch') fetchBranchHistory();
    else if (tab === 'consolidated') fetchConsolidated();
    else if (tab === 'projectwise') fetchProjectWise();
    else if (tab === 'all') fetchAllReports();
  }, [tab, fetchBranchHistory, fetchConsolidated, fetchProjectWise, fetchAllReports]);
 
  const handlePrint = () => {
    if (viewReport) {
      setPrintReport(viewReport);
      setViewReport(null);
    } else {
      window.print();
    }
  };
 
  const handleDownloadCSV = (data, filename) => {
    if (!data || data.length === 0) { toast.error('No data to download'); return; }
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(row => headers.map(h => {
      const val = row[h];
      return typeof val === 'object' ? JSON.stringify(val) : `"${val}"`;
    }).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
 
  const viewFullReport = async (id) => {
    try {
      const res = await reportAPI.getById(id);
      setViewReport(res.data.data);
    } catch (err) {
      toast.error('Failed to load report');
    }
  };
 
  const renderProjectValue = (val) => {
    if (val === undefined || val === null) return '—';
    if (typeof val === 'object') return JSON.stringify(val);
    return val;
  };
 
  return (
    <div className="reports-page">
      <div className="reports-hero">
        <div className="reports-hero-inner">
          <h1>Reports & Analysis</h1>
          <p>Bharat Vikas Parishad — Rajasthan Pashchim</p>
        </div>
      </div>
 
      <div className="reports-container">
        {/* Filters */}
        <div className="reports-filters">
          <div className="filter-group">
            <label>Month</label>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Year (FY Start)</label>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}-{String(y+1).slice(2)}</option>)}
            </select>
          </div>
          <div className="filter-actions">
            <button className="print-btn" onClick={handlePrint}>Print Report</button>
          </div>
        </div>
 
        {/* Tab Navigation */}
        <div className="report-tabs">
          {isBranch && (
            <button className={`report-tab ${tab === 'branch' ? 'active' : ''}`} onClick={() => setTab('branch')}>
              My Branch Reports
            </button>
          )}
          {isPrant && (
            <>
              <button className={`report-tab ${tab === 'consolidated' ? 'active' : ''}`} onClick={() => setTab('consolidated')}>
                Consolidated Report
              </button>
              <button className={`report-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
                All Branch Reports
              </button>
              <button className={`report-tab ${tab === 'projectwise' ? 'active' : ''}`} onClick={() => setTab('projectwise')}>
                Project-wise Report
              </button>
            </>
          )}
        </div>
 
        {loading && <div className="reports-loading">Loading...</div>}
 
        {/* Branch History (Branch Secretary View) */}
        {tab === 'branch' && !loading && (
          <div className="report-section printable">
            <div className="section-title-bar">
              <h2>Monthly Reports — {user?.branchName}</h2>
              <button className="download-btn" onClick={() => handleDownloadCSV(
                branchHistory.map(r => ({
                  Month: r.reportMonth, Year: r.reportYear,
                  Members: r.primaryInfo?.tillDate_members || 0,
                  Contribution: r.primaryInfo?.tillDate_contribution || 0,
                  Submitted: new Date(r.submittedAt).toLocaleDateString('en-IN'),
                })),
                `${user?.branchName}_reports.csv`
              )}>
                Download CSV
              </button>
            </div>
            {branchHistory.length === 0 ? (
              <div className="empty-state">No reports submitted yet for this year.</div>
            ) : (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Members</th>
                    <th>Contribution</th>
                    <th>Submitted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branchHistory.map((r, i) => (
                    <tr key={r._id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td>{r.reportMonth}</td>
                      <td>{r.reportYear}</td>
                      <td>{(r.primaryInfo?.tillDate_members || 0).toLocaleString()}</td>
                      <td>&#8377;{(r.primaryInfo?.tillDate_contribution || 0).toLocaleString()}</td>
                      <td>{new Date(r.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button className="view-btn" onClick={() => viewFullReport(r._id)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
 
        {/* Consolidated Prant Report */}
        {tab === 'consolidated' && !loading && consolidated && (
          <div className="report-section printable">
            <div className="section-title-bar">
              <h2>Consolidated Prant Report — {selectedMonth} {selectedYear}</h2>
              <div className="title-bar-stats">
                <span className="stat-badge green">{consolidated.totalSubmitted} Submitted</span>
                <span className="stat-badge red">{consolidated.totalMissing} Missing</span>
                <span className="stat-badge blue">{consolidated.totalBranches} Total</span>
              </div>
            </div>
 
            {/* Missing Branches */}
            {consolidated.missingBranches.length > 0 && (
              <div className="missing-branches">
                <h3>Branches Not Submitted</h3>
                <div className="missing-list">
                  {consolidated.missingBranches.map(b => (
                    <span key={b} className="missing-tag">{b}</span>
                  ))}
                </div>
              </div>
            )}
 
            {/* Summary Table */}
            {consolidated.reports.length > 0 && (
              <>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Branch</th>
                      <th>District</th>
                      <th>Members</th>
                      <th>Contribution</th>
                      <th>Medical</th>
                      <th>Trees</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolidated.reports.map((r, i) => (
                      <tr key={r._id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td>{i + 1}</td>
                        <td><strong>{r.branchName}</strong></td>
                        <td>{r.districtName}</td>
                        <td>{(r.primaryInfo?.tillDate_members || 0).toLocaleString()}</td>
                        <td>&#8377;{(r.primaryInfo?.tillDate_contribution || 0).toLocaleString()}</td>
                        <td>{((r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0)).toLocaleString()}</td>
                        <td>{(r.environmentGatividhi?.treePlantation_curr || 0).toLocaleString()}</td>
                        <td><button className="view-btn" onClick={() => setViewReport(r)}>View</button></td>
                      </tr>
                    ))}
                    {/* Prant Total Row */}
                    <tr className="total-row">
                      <td></td>
                      <td><strong>PRANT TOTAL</strong></td>
                      <td></td>
                      <td><strong>{consolidated.reports.reduce((s, r) => s + (r.primaryInfo?.tillDate_members || 0), 0).toLocaleString()}</strong></td>
                      <td><strong>&#8377;{consolidated.reports.reduce((s, r) => s + (r.primaryInfo?.tillDate_contribution || 0), 0).toLocaleString()}</strong></td>
                      <td><strong>{consolidated.reports.reduce((s, r) => s + (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0), 0).toLocaleString()}</strong></td>
                      <td><strong>{consolidated.reports.reduce((s, r) => s + (r.environmentGatividhi?.treePlantation_curr || 0), 0).toLocaleString()}</strong></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
                <div style={{marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                  <button className="download-btn" onClick={() => handleDownloadCSV(
                    consolidated.reports.map((r, i) => ({
                      SNo: i + 1, Branch: r.branchName, District: r.districtName,
                      Members: r.primaryInfo?.tillDate_members || 0,
                      Contribution: r.primaryInfo?.tillDate_contribution || 0,
                      Medical: (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0),
                      Trees: r.environmentGatividhi?.treePlantation_curr || 0,
                    })),
                    `consolidated_summary_${selectedMonth}_${selectedYear}.csv`
                  )}>
                    Download Summary CSV
                  </button>
                  <button className="download-btn" onClick={() => exportCSV(buildPrantTotal(consolidated.reports, selectedMonth, selectedYear))}>
                    Download Full Prant CSV
                  </button>
                  <button className="print-btn" onClick={() => setPrintReport(buildPrantTotal(consolidated.reports, selectedMonth, selectedYear))}>
                    Print Full Prant Report
                  </button>
                </div>
              </>
            )}
          </div>
        )}
 
        {/* All Branch Reports (individual) */}
        {tab === 'all' && !loading && (
          <div className="report-section printable">
            <div className="section-title-bar">
              <h2>All Branch Reports — {selectedMonth} {selectedYear}</h2>
            </div>
            <div className="branch-filter">
              <label>Filter by Branch: </label>
              <select onChange={e => {
                if (e.target.value) {
                  const filtered = reports.filter(r => r.branchName === e.target.value);
                  setReports(filtered);
                } else {
                  fetchAllReports();
                }
              }}>
                <option value="">All Branches</option>
                {BRANCH_NAMES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {reports.length === 0 ? (
              <div className="empty-state">No reports found for this period.</div>
            ) : (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Branch</th>
                    <th>District</th>
                    <th>Members</th>
                    <th>Contribution</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <tr key={r._id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td>{i + 1}</td>
                      <td><strong>{r.branchName}</strong></td>
                      <td>{r.districtName || '—'}</td>
                      <td>{(r.primaryInfo?.tillDate_members || 0).toLocaleString()}</td>
                      <td>&#8377;{(r.primaryInfo?.tillDate_contribution || 0).toLocaleString()}</td>
                      <td>{new Date(r.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td><button className="view-btn" onClick={() => viewFullReport(r._id)}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
 
        {/* Project-wise Report */}
        {tab === 'projectwise' && !loading && (
          <div className="report-section printable">
            <div className="section-title-bar">
              <h2>Project-wise Report — {selectedMonth} {selectedYear}</h2>
            </div>
            <div className="project-selector">
              <label>Select Project: </label>
              <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                {Object.entries(PROJECT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
 
            {projectWise && projectWise.projectData && projectWise.projectData[selectedProject] && (
              <div className="project-table-wrap">
                <h3>{PROJECT_LABELS[selectedProject]} — Branch-wise Data</h3>
                <table className="report-table project-table">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      {projectWise.projectData[selectedProject].prantTotals &&
                        Object.keys(projectWise.projectData[selectedProject].prantTotals).map(k => (
                          <th key={k}>{k.replace(/prev_|curr_/g, '').replace(/_/g, ' ')}</th>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(projectWise.projectData[selectedProject].branches).map(([branch, data], i) => (
                      <tr key={branch} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td><strong>{branch}</strong></td>
                        {Object.keys(projectWise.projectData[selectedProject].prantTotals).map(k => (
                          <td key={k}>{renderProjectValue(data[k])}</td>
                        ))}
                      </tr>
                    ))}
                    {/* Prant Total */}
                    <tr className="total-row">
                      <td><strong>PRANT TOTAL</strong></td>
                      {Object.entries(projectWise.projectData[selectedProject].prantTotals).map(([k, v]) => (
                        <td key={k}><strong>{v}</strong></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <button className="download-btn" style={{marginTop: 16}} onClick={() => {
                  const totals = projectWise.projectData[selectedProject].prantTotals;
                  const keys = Object.keys(totals);
                  const rows = Object.entries(projectWise.projectData[selectedProject].branches).map(([branch, data]) => {
                    const row = { Branch: branch };
                    keys.forEach(k => { row[k] = data[k] || 0; });
                    return row;
                  });
                  const totalRow = { Branch: 'PRANT TOTAL' };
                  keys.forEach(k => { totalRow[k] = totals[k]; });
                  rows.push(totalRow);
                  handleDownloadCSV(rows, `projectwise_${PROJECT_LABELS[selectedProject]}_${selectedMonth}_${selectedYear}.csv`);
                }}>
                  Download Project CSV
                </button>
              </div>
            )}
          </div>
        )}
 
        {/* Full Report Modal */}
        {viewReport && (
          <div className="modal-overlay" onClick={() => setViewReport(null)}>
            <div className="report-modal" onClick={e => e.stopPropagation()}>
              <div className="report-modal-header">
                <h2>{viewReport.branchName} — {viewReport.reportMonth} {viewReport.reportYear}</h2>
                <div className="report-modal-actions">
                  <button className="print-btn" onClick={handlePrint}>Print Report</button>
                  <button className="download-btn" onClick={() => exportCSV(viewReport)}>Download CSV</button>
                  <button className="close-btn" onClick={() => setViewReport(null)}>Close</button>
                </div>
              </div>
              <div className="report-modal-body printable">
                <PrintReport form={viewReport} onBack={() => setViewReport(null)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-page print view (replaces entire page for clean printing) */}
      {printReport && (
        <div className="print-fullpage-overlay">
          <PrintReport form={printReport} onBack={() => setPrintReport(null)} />
        </div>
      )}
    </div>
  );
}