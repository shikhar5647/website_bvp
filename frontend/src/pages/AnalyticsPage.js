import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { reportAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './AnalyticsPage.css';

const COLORS = ['#FF6B00', '#D4AF37', '#1B2A3B', '#2ECC71', '#E74C3C', '#9B59B6', '#3498DB', '#F39C12'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value?.toLocaleString()}</strong>
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
      <div className="stat-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className="stat-body">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-title">{title}</div>
        {sub && <div className="stat-sub">{sub}</div>}
        {trend !== undefined && (
          <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
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

export default function AnalyticsPage() {
  const [reports, setReports] = useState([]);
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
        setReports(reportsRes.data.data || []);
        setAnalytics(analyticsRes.data.data || null);
      } catch (err) {
        toast.error('Failed to load data. Is the backend running?');
        // Use demo data if backend not connected
        setReports(getDemoReports());
        setAnalytics(getDemoAnalytics());
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  // Demo data for preview
  const getDemoReports = () => [
    { branchName: 'Jodhpur Marwar', prantName: 'Rajasthan Pashchim', reportMonth: 'December', reportYear: 2025, primaryInfo: { tillDate_members: 192, tillDate_contribution: 576000 }, sewaGatividhi: { medicalCamp: { curr_health_beneficiary: 201, curr_eye_beneficiary: 400 }, bloodDonation: { curr_units: 0 }, helpingNeedy: { curr_beneficiary: 0 } }, environmentGatividhi: { treePlantation_curr: 0, tulsiPodha_curr: 0 }, sanskarGatividhi: { bharatKoJano: { curr_students_jr: 0, curr_students_sr: 0 }, nsgc: { curr_boys: 0, curr_girls: 0 }, interCollege: { curr_boys: 8, curr_girls: 10 } }, mahilaSahbhagita: { anemiaMukt: { curr_total_test: 56, curr_anemic: 2 }, betiPadhao: { curr_programmes: 0 } } },
    { branchName: 'Jodhpur East', prantName: 'Rajasthan Pashchim', reportMonth: 'December', reportYear: 2025, primaryInfo: { tillDate_members: 145, tillDate_contribution: 435000 }, sewaGatividhi: { medicalCamp: { curr_health_beneficiary: 120, curr_eye_beneficiary: 200 }, bloodDonation: { curr_units: 45 }, helpingNeedy: { curr_beneficiary: 80 } }, environmentGatividhi: { treePlantation_curr: 120, tulsiPodha_curr: 30 }, sanskarGatividhi: { bharatKoJano: { curr_students_jr: 200, curr_students_sr: 180 }, nsgc: { curr_boys: 15, curr_girls: 22 }, interCollege: { curr_boys: 0, curr_girls: 0 } }, mahilaSahbhagita: { anemiaMukt: { curr_total_test: 90, curr_anemic: 8 }, betiPadhao: { curr_programmes: 2 } } },
    { branchName: 'Barmer Branch', prantName: 'Rajasthan Pashchim', reportMonth: 'November', reportYear: 2025, primaryInfo: { tillDate_members: 110, tillDate_contribution: 330000 }, sewaGatividhi: { medicalCamp: { curr_health_beneficiary: 80, curr_eye_beneficiary: 120 }, bloodDonation: { curr_units: 30 }, helpingNeedy: { curr_beneficiary: 60 } }, environmentGatividhi: { treePlantation_curr: 200, tulsiPodha_curr: 50 }, sanskarGatividhi: { bharatKoJano: { curr_students_jr: 300, curr_students_sr: 250 }, nsgc: { curr_boys: 10, curr_girls: 18 }, interCollege: { curr_boys: 5, curr_girls: 8 } }, mahilaSahbhagita: { anemiaMukt: { curr_total_test: 45, curr_anemic: 5 }, betiPadhao: { curr_programmes: 1 } } },
  ];

  const getDemoAnalytics = () => ({
    monthly: [
      { _id: { month: 'April', year: 2025 }, totalBranches: 3, totalMembers: 420, totalContribution: 1260000, totalMedicalBeneficiary: 580, totalTrees: 150, totalBloodUnits: 60 },
      { _id: { month: 'May', year: 2025 }, totalBranches: 3, totalMembers: 435, totalContribution: 1305000, totalMedicalBeneficiary: 620, totalTrees: 200, totalBloodUnits: 75 },
      { _id: { month: 'June', year: 2025 }, totalBranches: 3, totalMembers: 440, totalContribution: 1320000, totalMedicalBeneficiary: 700, totalTrees: 320, totalBloodUnits: 90 },
      { _id: { month: 'October', year: 2025 }, totalBranches: 3, totalMembers: 450, totalContribution: 1350000, totalMedicalBeneficiary: 820, totalTrees: 400, totalBloodUnits: 110 },
      { _id: { month: 'November', year: 2025 }, totalBranches: 3, totalMembers: 447, totalContribution: 1341000, totalMedicalBeneficiary: 920, totalTrees: 500, totalBloodUnits: 125 },
      { _id: { month: 'December', year: 2025 }, totalBranches: 2, totalMembers: 337, totalContribution: 1011000, totalMedicalBeneficiary: 721, totalTrees: 120, totalBloodUnits: 45 },
    ],
    branchWise: [
      { _id: 'Jodhpur Marwar', totalContribution: 576000, avgMembers: 192, totalMedical: 201, totalBlood: 0 },
      { _id: 'Jodhpur East', totalContribution: 435000, avgMembers: 145, totalMedical: 120, totalBlood: 45 },
      { _id: 'Barmer Branch', totalContribution: 330000, avgMembers: 110, totalMedical: 80, totalBlood: 30 },
    ]
  });

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const data = analytics || getDemoAnalytics();
  const allReports = reports.length > 0 ? reports : getDemoReports();

  // Prepare chart data
  const monthlyChartData = data.monthly.map(m => ({
    month: m._id.month.substring(0, 3),
    Members: m.totalMembers,
    Contribution: Math.round(m.totalContribution / 1000),
    'Medical Beneficiary': m.totalMedicalBeneficiary,
    'Trees Planted': m.totalTrees,
    'Blood Units': m.totalBloodUnits,
  }));

  const branchData = data.branchWise.map(b => ({
    branch: b._id.split(' ').slice(0, 2).join(' '),
    Members: Math.round(b.avgMembers),
    'Contribution (₹K)': Math.round(b.totalContribution / 1000),
    Medical: b.totalMedical,
    Blood: b.totalBlood,
  }));

  // Aggregate Sewa data for pie chart
  const sewaData = [
    { name: 'Medical Beneficiaries', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0), 0) },
    { name: 'Blood Donation', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.bloodDonation?.curr_units || 0), 0) },
    { name: 'Helping Needy', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.helpingNeedy?.curr_beneficiary || 0), 0) },
    { name: 'Gram Vikas', value: allReports.reduce((s, r) => s + (r.sewaGatividhi?.gramVikas?.curr_beneficiary || 0), 0) },
  ].filter(d => d.value > 0);

  const educationData = allReports.map(r => ({
    branch: (r.branchName || '').split(' ').slice(0, 2).join(' '),
    'BKJ Jr': r.sanskarGatividhi?.bharatKoJano?.curr_students_jr || 0,
    'BKJ Sr': r.sanskarGatividhi?.bharatKoJano?.curr_students_sr || 0,
    'NSGC Boys': r.sanskarGatividhi?.nsgc?.curr_boys || 0,
    'NSGC Girls': r.sanskarGatividhi?.nsgc?.curr_girls || 0,
    'Inter College': (r.sanskarGatividhi?.interCollege?.curr_boys || 0) + (r.sanskarGatividhi?.interCollege?.curr_girls || 0),
  }));

  const environmentData = allReports.map(r => ({
    branch: (r.branchName || '').split(' ').slice(0, 2).join(' '),
    Trees: r.environmentGatividhi?.treePlantation_curr || 0,
    'Tulsi Plants': r.environmentGatividhi?.tulsiPodha_curr || 0,
  }));

  const mahilaData = allReports.map(r => ({
    branch: (r.branchName || '').split(' ').slice(0, 2).join(' '),
    'Anemia Tests': r.mahilaSahbhagita?.anemiaMukt?.curr_total_test || 0,
    'Anemic Cases': r.mahilaSahbhagita?.anemiaMukt?.curr_anemic || 0,
    'Beti Padhao': r.mahilaSahbhagita?.betiPadhao?.curr_programmes || 0,
  }));

  const radarData = [
    { subject: 'Sewa', A: Math.min(100, allReports.reduce((s,r) => s + (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary||0), 0) / 5) },
    { subject: 'Sanskar', A: Math.min(100, allReports.reduce((s,r) => s + (r.sanskarGatividhi?.bharatKoJano?.curr_students_jr||0), 0) / 50) },
    { subject: 'Environment', A: Math.min(100, allReports.reduce((s,r) => s + (r.environmentGatividhi?.treePlantation_curr||0), 0) / 5) },
    { subject: 'Mahila', A: Math.min(100, allReports.reduce((s,r) => s + (r.mahilaSahbhagita?.anemiaMukt?.curr_total_test||0), 0) / 2) },
    { subject: 'Membership', A: Math.min(100, allReports.reduce((s,r) => s + (r.primaryInfo?.tillDate_members||0), 0) / 5) },
  ];

  const totalMembers = allReports.reduce((s, r) => s + (r.primaryInfo?.tillDate_members || 0), 0);
  const totalContribution = allReports.reduce((s, r) => s + (r.primaryInfo?.tillDate_contribution || 0), 0);
  const totalMedical = allReports.reduce((s, r) => s + (r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0), 0);
  const totalTrees = allReports.reduce((s, r) => s + (r.environmentGatividhi?.treePlantation_curr || 0), 0);

  return (
    <div className="analytics-page">
      <div className="analytics-hero">
        <div className="analytics-hero-inner">
          <div className="hero-badge">Live Dashboard</div>
          <h1>Analytics & Insights</h1>
          <p>Bharat Vikas Parishad — NW Region Performance Overview</p>
          {reports.length === 0 && (
            <div className="demo-banner">📊 Showing demo data — submit reports to see live analytics</div>
          )}
        </div>
        <div className="analytics-controls">
          <label className="control-label">Filter by Year</label>
          <select className="year-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="analytics-container">
        {/* KPI Cards */}
        <div className="stats-grid">
          <StatCard title="Total Members" value={totalMembers.toLocaleString()} sub={`${allReports.length} branches`} icon="👥" color="#FF6B00" />
          <StatCard title="Total Contribution" value={`₹${(totalContribution/100000).toFixed(1)}L`} sub="Membership funds" icon="💰" color="#D4AF37" />
          <StatCard title="Medical Beneficiaries" value={totalMedical.toLocaleString()} sub="This period" icon="🏥" color="#2ECC71" />
          <StatCard title="Trees Planted" value={totalTrees.toLocaleString()} sub="Environment drive" icon="🌳" color="#27AE60" />
        </div>

        {/* Monthly Trend */}
        <ChartCard title="Monthly Membership Trend" subtitle="Members and contribution over time">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyChartData}>
              <defs>
                <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="Members" stroke="#FF6B00" fill="url(#memberGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#FF6B00' }} />
              <Area type="monotone" dataKey="Contribution" stroke="#D4AF37" fill="url(#contribGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#D4AF37' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Branch Comparison */}
        <div className="charts-row-2">
          <ChartCard title="Branch-wise Contribution" subtitle="Membership contribution in ₹ Thousands">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={branchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="branch" type="category" tick={{ fontSize: 11 }} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Contribution (₹K)" fill="#FF6B00" radius={[0, 6, 6, 0]}>
                  {branchData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Sewa Activity Distribution" subtitle="Beneficiaries across service categories">
            {sewaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={sewaData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {sewaData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">No sewa data for this period</div>
            )}
          </ChartCard>
        </div>

        {/* Education / Sanskar Chart */}
        <ChartCard title="Sanskar Gatividhi — Education Programs" subtitle="Student participation across branches">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="BKJ Jr" fill="#FF6B00" radius={[4,4,0,0]} />
              <Bar dataKey="BKJ Sr" fill="#D4AF37" radius={[4,4,0,0]} />
              <Bar dataKey="NSGC Boys" fill="#1B2A3B" radius={[4,4,0,0]} />
              <Bar dataKey="NSGC Girls" fill="#9B59B6" radius={[4,4,0,0]} />
              <Bar dataKey="Inter College" fill="#2ECC71" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="charts-row-2">
          {/* Environment */}
          <ChartCard title="Environment Gatividhi" subtitle="Trees and plants per branch">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={environmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Trees" fill="#27AE60" radius={[4,4,0,0]} />
                <Bar dataKey="Tulsi Plants" fill="#2ECC71" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Mahila */}
          <ChartCard title="Mahila Sahbhagita" subtitle="Women welfare programs">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mahilaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Anemia Tests" fill="#E74C3C" radius={[4,4,0,0]} />
                <Bar dataKey="Anemic Cases" fill="#C0392B" radius={[4,4,0,0]} />
                <Bar dataKey="Beti Padhao" fill="#D4AF37" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Monthly Medical + Blood */}
        <ChartCard title="Monthly Sewa Activities" subtitle="Medical beneficiaries and blood units over time">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="Medical Beneficiary" stroke="#E74C3C" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="Blood Units" stroke="#D4AF37" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="Trees Planted" stroke="#27AE60" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Branch Members Bar */}
        <ChartCard title="Branch Members Comparison" subtitle="Active members per branch this period">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Members" radius={[6,6,0,0]}>
                {branchData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Overall Activity Radar */}
        <ChartCard title="Overall Activity Score" subtitle="Normalized performance across all gatividhi categories">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fontWeight: 600 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Activity Score" dataKey="A" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.2} strokeWidth={2.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Reports Table */}
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
                  <th>Prant</th>
                  <th>Month/Year</th>
                  <th>Members</th>
                  <th>Contribution</th>
                  <th>Medical</th>
                </tr>
              </thead>
              <tbody>
                {allReports.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.branchName}</strong></td>
                    <td>{r.prantName}</td>
                    <td>{r.reportMonth} {r.reportYear}</td>
                    <td>{(r.primaryInfo?.tillDate_members || 0).toLocaleString()}</td>
                    <td>₹{((r.primaryInfo?.tillDate_contribution || 0) / 1000).toFixed(0)}K</td>
                    <td>{(r.sewaGatividhi?.medicalCamp?.curr_health_beneficiary || 0) + (r.sewaGatividhi?.medicalCamp?.curr_eye_beneficiary || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}