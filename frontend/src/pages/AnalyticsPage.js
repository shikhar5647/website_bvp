import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { reportAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './AnalyticsPage.css';

const COLORS = ['#FF6B00', '#D4AF37', '#1B2A3B', '#2ECC71', '#E74C3C', '#9B59B6', '#3498DB', '#F39C12'];
const MONTHS_ORDER = ['April','May','June','July','August','September','October','November','December','January','February','March'];
const BRANCH_NAMES_ALL = [
  'Barmer Main','VDR Barmer','Gudamalani','Balotra','Jaisalmer','Pokaran',
  'Jalore','Bhinmal','Ahore','Sayala','Sanchore Main','VU Sanchore',
  'Jodhpur Main','Jodhpur Marwar','Nandanvan','Saraswati Nagar','Ratanada','Paota',
  'Suryanagari','Mathaniya','Osian','Pipar Nagar','Bap','Phalodi',
  'Pali','Sojat','Sumerpur Sheoganj','Falna Bali','Sadri','Vivekanand Shakha Pali',
  'Devnagri Sirohi','Pindwara','Aburoad','Mount Abu',
];

const DISTRICT_MAP = {};
[
  ['Barmer', ['Barmer Main','VDR Barmer','Gudamalani']],
  ['Balotra', ['Balotra']],
  ['Jaisalmer', ['Jaisalmer','Pokaran']],
  ['Jalore', ['Jalore','Bhinmal','Ahore','Sayala','Sanchore Main','VU Sanchore']],
  ['Jodhpur', ['Jodhpur Main','Jodhpur Marwar','Nandanvan','Saraswati Nagar','Ratanada','Paota','Suryanagari','Mathaniya','Osian','Pipar Nagar']],
  ['Phalodi', ['Bap','Phalodi']],
  ['Pali', ['Pali','Sojat','Sumerpur Sheoganj','Falna Bali','Sadri','Vivekanand Shakha Pali']],
  ['Sirohi', ['Devnagri Sirohi','Pindwara','Aburoad','Mount Abu']],
].forEach(([d, bs]) => bs.forEach(b => { DISTRICT_MAP[b] = d; }));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ title, value, sub, icon, color = '#FF6B00', trend }) {
  return (
    <div className="stat-card fade-in">
      <div className="stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div className="stat-body">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-title">{title}</div>
        {sub && <div className="stat-sub">{sub}</div>}
        {trend !== undefined && trend !== null && (
          <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="chart-card fade-in">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-sub">{subtitle}</p>}
        </div>
      </div>
      <div className="chart-body">{children}</div>
    </div>
  );
}

function ProgressBar({ label, current, target, color = '#FF6B00' }) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return (
    <div className="progress-row">
      <div className="progress-label">
        <span>{label}</span>
        <span className="progress-nums">{current.toLocaleString()} / {target.toLocaleString()} ({pct}%)</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function HeatmapCell({ submitted }) {
  return (
    <td className={`heatmap-cell ${submitted ? 'heatmap-yes' : 'heatmap-no'}`}>
      {submitted ? '✓' : '✗'}
    </td>
  );
}

export default function AnalyticsPage() {
  const [allReports, setAllReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsRes, analyticsRes] = await Promise.all([
          reportAPI.getAll({ year: selectedYear }),
          reportAPI.getAnalytics({ year: selectedYear }),
        ]);
        setAllReports(reportsRes.data.data || []);
        setAnalytics(analyticsRes.data.data || null);
      } catch (err) {
        toast.error('Failed to load analytics data');
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedYear]);

  const data = analytics || { monthly: [], branchWise: [] };
  const monthly = data.monthly || [];
  const branchWise = data.branchWise || [];

  // Sort monthly by MONTHS_ORDER
  const monthlySorted = useMemo(() =>
    [...monthly].sort((a, b) => MONTHS_ORDER.indexOf(a._id.month) - MONTHS_ORDER.indexOf(b._id.month)),
    [monthly]
  );

  // ── Derived data ──────────────────────────────────────────────────────────

  // KPI totals
  const totals = useMemo(() => {
    const t = { members: 0, contribution: 0, targetMembers: 0, targetContribution: 0, medical: 0, trees: 0, meetings: 0, cash: 0, bank: 0 };
    allReports.forEach(r => {
      const pi = r.primaryInfo || {};
      t.members += pi.tillDate_members || 0;
      t.contribution += pi.tillDate_contribution || 0;
      t.targetMembers += pi.target2025_26_members || 0;
      t.targetContribution += pi.target2025_26_contribution || 0;
      t.medical += (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0);
      t.trees += r.environmentGatividhi?.treePlantation_curr || 0;
      t.cash += pi.cashBalance || 0;
      t.bank += (pi.bankBalance1 || 0) + (pi.bankBalance2 || 0);
      const mtg = r.meetings || {};
      t.meetings += (mtg.executive || []).length + (mtg.generalBody || []).length + (mtg.workingGroup || []).length;
    });
    return t;
  }, [allReports]);

  // Month-over-month trend
  const membersTrend = useMemo(() => {
    if (monthlySorted.length < 2) return null;
    const curr = monthlySorted[monthlySorted.length - 1].totalMembers;
    const prev = monthlySorted[monthlySorted.length - 2].totalMembers;
    return prev > 0 ? ((curr - prev) / prev) * 100 : null;
  }, [monthlySorted]);

  const contributionTrend = useMemo(() => {
    if (monthlySorted.length < 2) return null;
    const curr = monthlySorted[monthlySorted.length - 1].totalContribution;
    const prev = monthlySorted[monthlySorted.length - 2].totalContribution;
    return prev > 0 ? ((curr - prev) / prev) * 100 : null;
  }, [monthlySorted]);

  // Submission compliance
  const submittedBranches = useMemo(() => new Set(allReports.map(r => r.branchName)), [allReports]);
  const submissionRate = Math.round((submittedBranches.size / BRANCH_NAMES_ALL.length) * 100);

  // Monthly chart data
  const monthlyChartData = useMemo(() => monthlySorted.map(m => ({
    month: m._id.month.substring(0, 3),
    Members: m.totalMembers,
    'Contribution (₹K)': Math.round(m.totalContribution / 1000),
    Medical: m.totalMedicalBeneficiary,
    Trees: m.totalTrees,
    'Blood Units': m.totalBloodUnits,
    Meetings: (m.totalExecutiveMeetings || 0) + (m.totalGeneralMeetings || 0) + (m.totalWorkingMeetings || 0),
    'Sampark Prog.': m.totalSamparkProgrammes || 0,
  })), [monthlySorted]);

  // Branch contribution bar
  const branchContribData = useMemo(() => branchWise.map(b => ({
    branch: b._id.length > 14 ? b._id.substring(0, 12) + '..' : b._id,
    fullName: b._id,
    'Contribution (₹K)': Math.round(b.totalContribution / 1000),
    Members: Math.round(b.avgMembers),
  })), [branchWise]);

  // Sewa breakdown pie
  const sewaData = useMemo(() => {
    const items = [
      { name: 'Medical Camp', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0), 0) },
      { name: 'Blood Donation', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.bloodDonation?.curr_blood_units || 0), 0) },
      { name: 'Helping Needy', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.helpingNeedy?.curr_beneficiary || 0), 0) },
      { name: 'Gram Vikas', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.gramVikas?.curr_beneficiary || 0), 0) },
      { name: 'Divyang Sahayta', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.divyangSahayta?.curr_beneficiary || 0), 0) },
      { name: 'Health/Yog', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.healthAwareness?.curr_yog_beneficiary || 0), 0) },
      { name: 'Nasha Mukti', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.healthAwareness?.curr_nasha_beneficiary || 0), 0) },
      { name: 'Vanvasi Sahayta', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.vanvasiSahayta?.curr_central || 0) + (r.sewaGatividhi?.vanvasiSahayta?.curr_local || 0), 0) },
    ];
    return items.filter(d => d.value > 0);
  }, [allReports]);

  // Sanskar education per branch
  const educationData = useMemo(() => allReports.map(r => ({
    branch: (r.branchName || '').length > 12 ? r.branchName.substring(0, 10) + '..' : r.branchName,
    'NSGC': (r.sanskarGatividhi?.nsgc?.curr_boys || 0) + (r.sanskarGatividhi?.nsgc?.curr_girls || 0),
    'BKJ': (r.sanskarGatividhi?.bharatKoJano?.curr_students_jr || 0) + (r.sanskarGatividhi?.bharatKoJano?.curr_students_sr || 0),
    'GVCA': (r.sanskarGatividhi?.gvca?.curr_students_honoured || 0) + (r.sanskarGatividhi?.gvca?.curr_teachers_honoured || 0),
    'Inter College': (r.sanskarGatividhi?.interCollege?.curr_boys || 0) + (r.sanskarGatividhi?.interCollege?.curr_girls || 0),
    'Yuva Sanskar': r.sanskarGatividhi?.yuvaSanskar?.curr_presence || 0,
  })), [allReports]);

  // Environment full data
  const envData = useMemo(() => allReports.map(r => {
    const ev = r.environmentGatividhi || {};
    return {
      branch: (r.branchName || '').length > 12 ? r.branchName.substring(0, 10) + '..' : r.branchName,
      Trees: ev.treePlantation_curr || 0,
      'Tulsi': ev.tulsiPodha_curr || 0,
      'Cloth Bags': ev.clothBags_curr || 0,
    };
  }), [allReports]);

  // Animal Sewa (Jeevdaya) pie
  const animalSewaData = useMemo(() => {
    const items = [
      { name: 'Parinda', value: allReports.reduce((s, r) => s + (r.environmentGatividhi?.parinda_curr || 0), 0) },
      { name: 'Kundi', value: allReports.reduce((s, r) => s + (r.environmentGatividhi?.kundi_curr || 0), 0) },
      { name: 'Chara', value: allReports.reduce((s, r) => s + (r.environmentGatividhi?.chara_curr || 0), 0) },
      { name: 'Dana', value: allReports.reduce((s, r) => s + (r.environmentGatividhi?.dana_curr || 0), 0) },
    ];
    return items.filter(d => d.value > 0);
  }, [allReports]);

  // Mahila full data
  const mahilaData = useMemo(() => allReports.map(r => {
    const mh = r.mahilaSahbhagita || {};
    return {
      branch: (r.branchName || '').length > 12 ? r.branchName.substring(0, 10) + '..' : r.branchName,
      'Anemia Tests': mh.anemiaMukt?.curr_total_test || 0,
      'Beti Padhao': mh.betiPadhao?.curr_programmes || 0,
      'Sewing Centers': mh.atmnirbhar?.curr_sewing_centers || 0,
      'Baal Sanskar': mh.baalSanskar?.curr_activities || 0,
      'Family Adoption': mh.familyAdoption?.curr_families || 0,
    };
  }), [allReports]);

  // Sampark data
  const samparkData = useMemo(() => {
    const items = [
      { name: 'Sanskriti Saptah', programmes: 0, participants: 0 },
      { name: 'BVP Sthapna Diwas', programmes: 0, participants: 0 },
      { name: 'Vichar Gosthi', programmes: 0, participants: 0 },
      { name: 'Nav Varsh', programmes: 0, participants: 0 },
      { name: 'Samuhik Vivah', programmes: 0, participants: 0 },
      { name: 'Ek Shakha Ek Gaon', programmes: 0, participants: 0 },
    ];
    allReports.forEach(r => {
      const sp = r.samparkGatividhi || {};
      items[0].programmes += sp.sankritSaptah?.curr_programmes || 0;
      items[0].participants += sp.sankritSaptah?.curr_participants || 0;
      items[1].programmes += sp.bvpSthapnaDiwas?.curr_programmes || 0;
      items[1].participants += sp.bvpSthapnaDiwas?.curr_participants || 0;
      items[2].programmes += sp.vichargosthi?.curr_programmes || 0;
      items[2].participants += sp.vichargosthi?.curr_participants || 0;
      items[3].programmes += sp.navVarsh?.curr_programmes || 0;
      items[3].participants += sp.navVarsh?.curr_presence || 0;
      items[4].programmes += sp.samuhikVivah?.curr_vivah || 0;
      items[4].participants += sp.samuhikVivah?.curr_pairs || 0;
      items[5].programmes += sp.ekShakha?.curr_programmes || 0;
      items[5].participants += sp.ekShakha?.curr_beneficiaries || 0;
    });
    return items.filter(d => d.programmes > 0 || d.participants > 0);
  }, [allReports]);

  // Financial per branch
  const financialData = useMemo(() => allReports.map(r => {
    const pi = r.primaryInfo || {};
    return {
      branch: (r.branchName || '').length > 12 ? r.branchName.substring(0, 10) + '..' : r.branchName,
      'Cash': pi.cashBalance || 0,
      'Bank': (pi.bankBalance1 || 0) + (pi.bankBalance2 || 0),
      'Vikas Mitra': pi.vikasMitra_tillDate || 0,
      'Vikas Ratna': pi.vikasRatna_tillDate || 0,
    };
  }), [allReports]);

  // Meeting data per branch
  const meetingData = useMemo(() => allReports.map(r => {
    const mtg = r.meetings || {};
    return {
      branch: (r.branchName || '').length > 12 ? r.branchName.substring(0, 10) + '..' : r.branchName,
      'Executive': (mtg.executive || []).length,
      'General Body': (mtg.generalBody || []).length,
      'Working Group': (mtg.workingGroup || []).length,
    };
  }), [allReports]);

  // Target vs Achievement per branch
  const targetData = useMemo(() => branchWise.filter(b => b.targetMembers > 0).map(b => ({
    branch: b._id,
    current: Math.round(b.avgMembers),
    target: b.targetMembers,
  })), [branchWise]);

  // Permanent Sewa aggregation
  const permSewaData = useMemo(() => {
    const map = {};
    allReports.forEach(r => {
      (r.permanentSewa || []).forEach(ps => {
        if (!ps.service) return;
        if (!map[ps.service]) map[ps.service] = { name: ps.service, projects: 0, beneficiary: 0, cost: 0 };
        map[ps.service].projects += (ps.curr_projects || 0);
        map[ps.service].beneficiary += (ps.curr_beneficiary || 0);
        map[ps.service].cost += (ps.curr_cost || 0);
      });
    });
    return Object.values(map).filter(d => d.projects > 0 || d.beneficiary > 0);
  }, [allReports]);

  // District aggregation
  const districtData = useMemo(() => {
    const map = {};
    allReports.forEach(r => {
      const d = DISTRICT_MAP[r.branchName] || r.districtName || 'Other';
      if (!map[d]) map[d] = { district: d, members: 0, contribution: 0, medical: 0, trees: 0, branches: 0 };
      map[d].members += r.primaryInfo?.tillDate_members || 0;
      map[d].contribution += r.primaryInfo?.tillDate_contribution || 0;
      map[d].medical += (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0);
      map[d].trees += r.environmentGatividhi?.treePlantation_curr || 0;
      map[d].branches += 1;
    });
    return Object.values(map).sort((a, b) => b.contribution - a.contribution);
  }, [allReports]);

  // Submission heatmap
  const heatmapData = useMemo(() => {
    const submitted = {};
    allReports.forEach(r => {
      submitted[`${r.branchName}_${r.reportMonth}`] = true;
    });
    return { submitted, months: MONTHS_ORDER };
  }, [allReports]);

  // Radar — normalized activity scores
  const radarData = useMemo(() => {
    const n = allReports.length || 1;
    const sum = (fn) => allReports.reduce((s, r) => s + fn(r), 0);
    return [
      { subject: 'Sewa', score: Math.min(100, sum(r => (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0)) / (n * 2)) },
      { subject: 'Sanskar', score: Math.min(100, sum(r => (r.sanskarGatividhi?.bharatKoJano?.curr_students_jr || 0) + (r.sanskarGatividhi?.nsgc?.curr_boys || 0)) / (n * 3)) },
      { subject: 'Environment', score: Math.min(100, sum(r => r.environmentGatividhi?.treePlantation_curr || 0) / (n * 2)) },
      { subject: 'Mahila', score: Math.min(100, sum(r => (r.mahilaSahbhagita?.anemiaMukt?.curr_total_test || 0)) / n) },
      { subject: 'Sampark', score: Math.min(100, sum(r => (r.samparkGatividhi?.sankritSaptah?.curr_programmes || 0) + (r.samparkGatividhi?.bvpSthapnaDiwas?.curr_programmes || 0)) / (n * 0.5)) },
      { subject: 'Membership', score: Math.min(100, sum(r => r.primaryInfo?.tillDate_members || 0) / (n * 2)) },
    ];
  }, [allReports]);

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const noData = allReports.length === 0;

  return (
    <div className="analytics-page">
      <div className="analytics-hero">
        <div className="analytics-hero-inner">
          <div className="hero-badge">Live Dashboard</div>
          <h1>Analytics & Insights</h1>
          <p>Bharat Vikas Parishad — Rajasthan Pashchim Prant</p>
          {noData && <div className="demo-banner">No reports found for {selectedYear}. Submit reports to see analytics.</div>}
        </div>
        <div className="analytics-controls">
          <label className="control-label">Filter by Year</label>
          <select className="year-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="analytics-container">
        {/* ── KPI Cards Row 1 ── */}
        <div className="stats-grid">
          <StatCard title="Total Members" value={totals.members.toLocaleString()} sub={`${allReports.length} branch reports`} icon="👥" color="#FF6B00" trend={membersTrend} />
          <StatCard title="Total Contribution" value={`₹${(totals.contribution/100000).toFixed(1)}L`} sub="Membership funds" icon="💰" color="#D4AF37" trend={contributionTrend} />
          <StatCard title="Medical Beneficiaries" value={totals.medical.toLocaleString()} sub="Health + Eye camps" icon="🏥" color="#2ECC71" />
          <StatCard title="Trees Planted" value={totals.trees.toLocaleString()} sub="Environment drive" icon="🌳" color="#27AE60" />
        </div>

        {/* ── KPI Cards Row 2 ── */}
        <div className="stats-grid">
          <StatCard title="Submission Rate" value={`${submissionRate}%`} sub={`${submittedBranches.size} of ${BRANCH_NAMES_ALL.length} branches`} icon="📋" color={submissionRate >= 70 ? '#2ECC71' : '#E74C3C'} />
          <StatCard title="Total Meetings" value={totals.meetings.toLocaleString()} sub="Exec + General + Working" icon="📅" color="#3498DB" />
          <StatCard title="Financial Health" value={`₹${((totals.cash + totals.bank) / 100000).toFixed(1)}L`} sub="Cash + Bank balance" icon="🏦" color="#9B59B6" />
          <StatCard title="Target Achievement" value={totals.targetMembers > 0 ? `${Math.round((totals.members / totals.targetMembers) * 100)}%` : 'N/A'} sub={`Target: ${totals.targetMembers.toLocaleString()} members`} icon="🎯" color="#F39C12" />
        </div>

        {noData && <div className="empty-chart" style={{ padding: 40 }}>Submit branch reports to populate the dashboard</div>}

        {!noData && <>
          {/* ── Monthly Trend ── */}
          <ChartCard title="Monthly Membership Trend" subtitle="Members and contribution over time (with month-over-month trend)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyChartData}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.15}/><stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="Members" stroke="#FF6B00" fill="url(#memberGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#FF6B00' }} />
                <Area type="monotone" dataKey="Contribution (₹K)" stroke="#D4AF37" fill="url(#contribGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#D4AF37' }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Branch Contribution + Sewa Pie ── */}
          <div className="charts-row-2">
            <ChartCard title="Branch-wise Contribution" subtitle="Membership funds in ₹ Thousands">
              <ResponsiveContainer width="100%" height={Math.max(280, branchContribData.length * 32)}>
                <BarChart data={branchContribData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="branch" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Contribution (₹K)" fill="#FF6B00" radius={[0, 6, 6, 0]}>
                    {branchContribData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sewa Activity Distribution" subtitle="All sewa categories — beneficiaries">
              {sewaData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={sewaData} cx="50%" cy="50%" outerRadius={110} innerRadius={55} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {sewaData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="empty-chart">No sewa data</div>}
            </ChartCard>
          </div>

          {/* ── Sanskar Education ── */}
          <ChartCard title="Sanskar Gatividhi — All 5 Programs" subtitle="Student/participant reach per branch">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={educationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="NSGC" fill="#FF6B00" radius={[4,4,0,0]} />
                <Bar dataKey="BKJ" fill="#D4AF37" radius={[4,4,0,0]} />
                <Bar dataKey="GVCA" fill="#1B2A3B" radius={[4,4,0,0]} />
                <Bar dataKey="Inter College" fill="#2ECC71" radius={[4,4,0,0]} />
                <Bar dataKey="Yuva Sanskar" fill="#9B59B6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Environment + Animal Sewa ── */}
          <div className="charts-row-2">
            <ChartCard title="Environment Gatividhi" subtitle="Trees, Tulsi, Cloth Bags per branch">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={envData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Trees" fill="#27AE60" radius={[4,4,0,0]} />
                  <Bar dataKey="Tulsi" fill="#2ECC71" radius={[4,4,0,0]} />
                  <Bar dataKey="Cloth Bags" fill="#D4AF37" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Animal Sewa (Jeevdaya)" subtitle="Parinda, Kundi, Chara, Dana">
              {animalSewaData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={animalSewaData} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {animalSewaData.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="empty-chart">No animal sewa data</div>}
            </ChartCard>
          </div>

          {/* ── Mahila Sahbhagita Full ── */}
          <ChartCard title="Mahila Sahbhagita — All Programs" subtitle="Anemia, Beti Padhao, Sewing, Baal Sanskar, Family Adoption">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mahilaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Anemia Tests" fill="#E74C3C" radius={[4,4,0,0]} />
                <Bar dataKey="Beti Padhao" fill="#D4AF37" radius={[4,4,0,0]} />
                <Bar dataKey="Sewing Centers" fill="#9B59B6" radius={[4,4,0,0]} />
                <Bar dataKey="Baal Sanskar" fill="#3498DB" radius={[4,4,0,0]} />
                <Bar dataKey="Family Adoption" fill="#2ECC71" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Sampark Gatividhi ── */}
          {samparkData.length > 0 && (
            <ChartCard title="Sampark Gatividhi — Outreach Programs" subtitle="Programmes & participants across all outreach activities">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={samparkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="programmes" name="Programmes" fill="#FF6B00" radius={[4,4,0,0]} />
                  <Bar dataKey="participants" name="Participants" fill="#D4AF37" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* ── Financial Dashboard ── */}
          <ChartCard title="Financial Overview" subtitle="Cash, Bank balance, Vikas Mitra & Vikas Ratna per branch">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Cash" fill="#27AE60" stackId="balance" radius={[0,0,0,0]} />
                <Bar dataKey="Bank" fill="#2ECC71" stackId="balance" radius={[4,4,0,0]} />
                <Bar dataKey="Vikas Mitra" fill="#D4AF37" radius={[4,4,0,0]} />
                <Bar dataKey="Vikas Ratna" fill="#F39C12" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Meeting Activity ── */}
          <ChartCard title="Meeting Activity" subtitle="Executive, General Body & Working Group meetings per branch">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={meetingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Executive" fill="#1B2A3B" radius={[4,4,0,0]} />
                <Bar dataKey="General Body" fill="#FF6B00" radius={[4,4,0,0]} />
                <Bar dataKey="Working Group" fill="#D4AF37" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Target vs Achievement ── */}
          {targetData.length > 0 && (
            <ChartCard title="Target vs Achievement — Members" subtitle="Branch-wise membership target progress">
              <div style={{ padding: '0 12px' }}>
                {targetData.map((b, i) => (
                  <ProgressBar key={i} label={b.branch} current={b.current} target={b.target} color={COLORS[i % COLORS.length]} />
                ))}
              </div>
            </ChartCard>
          )}

          {/* ── Permanent Sewa Projects ── */}
          {permSewaData.length > 0 && (
            <ChartCard title="Permanent Sewa Projects" subtitle="Ongoing service projects — count, beneficiaries, cost">
              <ResponsiveContainer width="100%" height={Math.max(200, permSewaData.length * 40)}>
                <BarChart data={permSewaData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="projects" name="Projects" fill="#FF6B00" radius={[0,4,4,0]} />
                  <Bar dataKey="beneficiary" name="Beneficiaries" fill="#2ECC71" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* ── District Aggregation ── */}
          <ChartCard title="District-wise Performance" subtitle="Aggregated metrics by district">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="members" name="Members" fill="#FF6B00" radius={[4,4,0,0]} />
                <Bar dataKey="medical" name="Medical" fill="#2ECC71" radius={[4,4,0,0]} />
                <Bar dataKey="trees" name="Trees" fill="#27AE60" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Monthly Sewa + Meetings Trend ── */}
          <ChartCard title="Monthly Activity Trends" subtitle="Medical, Blood, Trees, Meetings over time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Medical" stroke="#E74C3C" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Blood Units" stroke="#D4AF37" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Trees" stroke="#27AE60" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Meetings" stroke="#3498DB" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Sampark Prog." stroke="#9B59B6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Overall Activity Radar ── */}
          <div className="charts-row-2">
            <ChartCard title="Activity Score Radar" subtitle="Normalized performance across all gatividhi">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.2} strokeWidth={2.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* ── Submission Compliance Heatmap ── */}
            <ChartCard title="Submission Compliance" subtitle="Which branches submitted for which months">
              <div className="heatmap-scroll">
                <table className="heatmap-table">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      {heatmapData.months.map(m => <th key={m}>{m.substring(0, 3)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {BRANCH_NAMES_ALL.map(branch => (
                      <tr key={branch}>
                        <td className="heatmap-branch">{branch.length > 14 ? branch.substring(0, 12) + '..' : branch}</td>
                        {heatmapData.months.map(m => (
                          <HeatmapCell key={m} submitted={!!heatmapData.submitted[`${branch}_${m}`]} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>

          {/* ── Reports Table ── */}
          <div className="reports-table-card fade-in">
            <div className="table-card-header">
              <h3>Recent Submissions</h3>
              <span className="reports-count">{allReports.length} reports</span>
            </div>
            <div className="table-scroll">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>District</th>
                    <th>Month/Year</th>
                    <th>Members</th>
                    <th>Contribution</th>
                    <th>Medical</th>
                    <th>Trees</th>
                    <th>Meetings</th>
                  </tr>
                </thead>
                <tbody>
                  {allReports.map((r, i) => {
                    const mtg = r.meetings || {};
                    return (
                      <tr key={i}>
                        <td><strong>{r.branchName}</strong></td>
                        <td>{r.districtName || '—'}</td>
                        <td>{r.reportMonth} {r.reportYear}</td>
                        <td>{(r.primaryInfo?.tillDate_members || 0).toLocaleString()}</td>
                        <td>₹{((r.primaryInfo?.tillDate_contribution || 0) / 1000).toFixed(0)}K</td>
                        <td>{(r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0)}</td>
                        <td>{r.environmentGatividhi?.treePlantation_curr || 0}</td>
                        <td>{(mtg.executive || []).length + (mtg.generalBody || []).length + (mtg.workingGroup || []).length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}
