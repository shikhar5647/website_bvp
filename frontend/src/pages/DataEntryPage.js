import React, { useState, useRef, useEffect } from 'react';
import { reportAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './DataEntryPage.css';

const MONTHS = ['April','May','June','July','August','September','October','November','December','January','February','March'];
const YEARS = [2023, 2024, 2025, 2026];
const defaultMeeting = { date: '', participants: 0 };

// Branch data from backend config
const BRANCHES = [
  { district: 'Barmer',    branch: 'Barmer Main' },
  { district: 'Barmer',    branch: 'VDR Barmer' },
  { district: 'Barmer',    branch: 'Gudamalani' },
  { district: 'Balotra',   branch: 'Balotra' },
  { district: 'Jaisalmer', branch: 'Jaisalmer' },
  { district: 'Jaisalmer', branch: 'Pokaran' },
  { district: 'Jalore',    branch: 'Jalore' },
  { district: 'Jalore',    branch: 'Bhinmal' },
  { district: 'Jalore',    branch: 'Ahore' },
  { district: 'Jalore',    branch: 'Sayala' },
  { district: 'Jalore',    branch: 'Sanchore Main' },
  { district: 'Jalore',    branch: 'VU Sanchore' },
  { district: 'Jodhpur',   branch: 'Jodhpur Main' },
  { district: 'Jodhpur',   branch: 'Jodhpur Marwar' },
  { district: 'Jodhpur',   branch: 'Nandanvan' },
  { district: 'Jodhpur',   branch: 'Saraswati Nagar' },
  { district: 'Jodhpur',   branch: 'Ratanada' },
  { district: 'Jodhpur',   branch: 'Paota' },
  { district: 'Jodhpur',   branch: 'Suryanagari' },
  { district: 'Jodhpur',   branch: 'Mathaniya' },
  { district: 'Jodhpur',   branch: 'Osian' },
  { district: 'Jodhpur',   branch: 'Pipar Nagar' },
  { district: 'Phalodi',   branch: 'Bap' },
  { district: 'Phalodi',   branch: 'Phalodi' },
  { district: 'Pali',      branch: 'Pali' },
  { district: 'Pali',      branch: 'Sojat' },
  { district: 'Pali',      branch: 'Sumerpur Sheoganj' },
  { district: 'Pali',      branch: 'Falna Bali' },
  { district: 'Pali',      branch: 'Sadri' },
  { district: 'Sirohi',    branch: 'Devnagri Sirohi' },
  { district: 'Sirohi',    branch: 'Pindwara' },
  { district: 'Sirohi',    branch: 'Aburoad' },
  { district: 'Sirohi',    branch: 'Mount Abu' },
  { district: 'Pali',      branch: 'Vivekanand Shakha Pali' },
];
const PRANT_NAME = 'Rajasthan Pashchim';
const DISTRICTS = [...new Set(BRANCHES.map(b => b.district))];

const initialForm = {
  branchName: '', prantName: '', districtName: '', panOfBranch: '',
  reportMonth: 'December', reportYear: 2025,
  primaryInfo: {
    year2024_25_members:0, year2024_25_contribution:0,
    target2025_26_members:0, target2025_26_contribution:0,
    tillDate_members:0, tillDate_contribution:0,
    vikasMitra_base:0, vikasMitra_tillDate:0,
    vikasRatna_base:0, vikasRatna_tillDate:0,
    cashBalance:0, bankBalance1:0, bankBalance2:0,
  },
  sanskarGatividhi: {
    nsgc:         { prev_schools:0, prev_boys:0, prev_girls:0, prev_vadak:0,
                    curr_schools:0, curr_boys:0, curr_girls:0, curr_vadak:0 },
    bharatKoJano: { prev_schools:0, prev_students_jr:0, prev_students_sr:0, prev_books:0,
                    curr_schools:0, curr_students_jr:0, curr_students_sr:0, curr_books:0 },
    gvca:         { prev_schools:0, prev_students_honoured:0, prev_teachers_honoured:0, prev_total_presence:0,
                    curr_schools:0, curr_students_honoured:0, curr_teachers_honoured:0, curr_total_presence:0 },
    interCollege: { prev_colleges:0, prev_boys:0, prev_girls:0, prev_total_presence:0,
                    curr_colleges:0, curr_boys:0, curr_girls:0, curr_total_presence:0 },
    yuvaSanskar:  { prev_shivir_duration:0, prev_activities:0, prev_presence:0,
                    curr_shivir_duration:0, curr_activities:0, curr_presence:0 },
  },
  sewaGatividhi: {
    divyangSahayta: { prev_shivir:0, prev_artificial_limbs:0, prev_beneficiary:0,
                      curr_shivir:0, curr_artificial_limbs:0, curr_beneficiary:0 },
    vanvasiSahayta: { prev_central:0, prev_local:0, curr_central:0, curr_local:0 },
    gramVikas:      { prev_activities:0, prev_amount:0, prev_beneficiary:0,
                      curr_activities:0, curr_amount:0, curr_beneficiary:0 },
    medicalCamp:    { prev_health_shivir:0, prev_health_beneficiary:0,
                      prev_eye_shivir:0, prev_eye_beneficiary:0, prev_operations:0,
                      curr_health_shivir:0, curr_health_beneficiary:0,
                      curr_eye_shivir:0, curr_eye_beneficiary:0, curr_operations:0 },
    healthAwareness:{ prev_yog_shivir:0, prev_yog_beneficiary:0, prev_nasha_programmes:0, prev_nasha_beneficiary:0,
                      curr_yog_shivir:0, curr_yog_beneficiary:0, curr_nasha_programmes:0, curr_nasha_beneficiary:0 },
    bloodDonation:  { prev_eye_sankalp:0, prev_eye_pairs:0, prev_blood_shivir:0, prev_blood_units:0,
                      curr_eye_sankalp:0, curr_eye_pairs:0, curr_blood_shivir:0, curr_blood_units:0 },
    helpingNeedy:   { prev_schools:0, prev_stationary_beneficiary:0, prev_blankets:0, prev_food:0,
                      curr_schools:0, curr_stationary_beneficiary:0, curr_blankets:0, curr_food:0 },
  },
  environmentGatividhi: {
    treePlantation_prev:0, treePlantation_curr:0,
    tulsiPodha_prev:0,     tulsiPodha_curr:0,
    clothBags_prev:0,      clothBags_curr:0,
    seminars_prev:0,       seminars_curr:0,
    seminar_presence_prev:0, seminar_presence_curr:0,
    parinda_prev:0,        parinda_curr:0,
    kundi_prev:0,          kundi_curr:0,
    chara_prev:0,          chara_curr:0,
  },
  mahilaSahbhagita: {
    betiPadhao:    { prev_programmes:0, prev_participants:0, curr_programmes:0, curr_participants:0 },
    anemiaMukt:    { prev_shivir:0, prev_total_test:0, prev_anemic:0, prev_anemia_mukt:0,
                     curr_shivir:0, curr_total_test:0, curr_anemic:0, curr_anemia_mukt:0 },
    atmnirbhar:    { prev_sewing_centers:0, prev_sewing_beneficiary:0, prev_machines:0,
                     prev_beauty_centers:0, prev_beauty_beneficiary:0,
                     curr_sewing_centers:0, curr_sewing_beneficiary:0, curr_machines:0,
                     curr_beauty_centers:0, curr_beauty_beneficiary:0 },
    baalSanskar:   { prev_shivir_duration:0, prev_activities:0, prev_presence:0,
                     curr_shivir_duration:0, curr_activities:0, curr_presence:0 },
    familyAdoption:{ prev_families:0, prev_family_beneficiary:0, prev_family_amount:0,
                     prev_girl_beneficiary:0, prev_girl_amount:0,
                     curr_families:0, curr_family_beneficiary:0, curr_family_amount:0,
                     curr_girl_beneficiary:0, curr_girl_amount:0 },
  },
  samparkGatividhi: {
    sankritSaptah: { prev_programmes:0, prev_participants:0, curr_programmes:0, curr_participants:0 },
    samuhikVivah:  { prev_vivah:0, prev_pairs:0, curr_vivah:0, curr_pairs:0 },
    bvpSthapnaDiwas:{ prev_programmes:0, prev_participants:0, curr_programmes:0, curr_participants:0 },
    vichargosthi:  { prev_programmes:0, prev_participants:0, curr_programmes:0, curr_participants:0 },
    navVarsh:      { prev_programmes:0, prev_activities:0, prev_presence:0, curr_programmes:0, curr_activities:0, curr_presence:0 },
    ekShakha:      { prev_programmes:0, prev_beneficiaries:0, prev_amount:0, curr_programmes:0, curr_beneficiaries:0, curr_amount:0 },
  },
  permanentSewa: [
    { service:'Physiotherapy', prev_projects:0, prev_beneficiary:0, prev_cost:0, curr_projects:0, curr_beneficiary:0, curr_cost:0 },
    { service:'Dental',        prev_projects:0, prev_beneficiary:0, prev_cost:0, curr_projects:0, curr_beneficiary:0, curr_cost:0 },
    { service:'X-Ray',         prev_projects:0, prev_beneficiary:0, prev_cost:0, curr_projects:0, curr_beneficiary:0, curr_cost:0 },
    { service:'Dialysis',      prev_projects:0, prev_beneficiary:0, prev_cost:0, curr_projects:0, curr_beneficiary:0, curr_cost:0 },
    { service:'Lab',           prev_projects:0, prev_beneficiary:0, prev_cost:0, curr_projects:0, curr_beneficiary:0, curr_cost:0 },
  ],
  meetings: {
    executive:   [{ date:'', participants:0 }],
    generalBody: [{ date:'', participants:0 }],
    workingGroup:[{ date:'', participants:0 }],
  },
};

const TABS = [
  { id:'branch',      label:'Branch Info',     icon:'BI' },
  { id:'primary',     label:'Primary Info',    icon:'PI' },
  { id:'sanskar',     label:'Sanskar',          icon:'SK' },
  { id:'sewa',        label:'Sewa',            icon:'SW' },
  { id:'environment', label:'Environment',     icon:'EN' },
  { id:'mahila',      label:'Mahila',          icon:'MH' },
  { id:'sampark',     label:'Sampark',         icon:'SP' },
  { id:'permanent',   label:'Perm. Sewa',      icon:'PS' },
  { id:'meetings',    label:'Meetings',        icon:'MT' },
];

// ── Spreadsheet Cell Component ────────────────────────────────────────────────
function Cell({ value, onChange, readOnly, isTotal, isCurrency, isText }) {
  const ref = useRef(null);
  const display = isCurrency
    ? (typeof value === 'number' ? value.toLocaleString('en-IN') : value)
    : (typeof value === 'number' ? value.toLocaleString() : value);

  if (readOnly) {
    return (
      <div className={`ss-cell ss-cell-readonly${isTotal ? ' ss-cell-total' : ''}`}>
        {isCurrency ? `${display}` : display}
      </div>
    );
  }

  if (isText) {
    return (
      <input
        ref={ref}
        type="text"
        className="ss-cell ss-cell-input ss-cell-text"
        value={value || ''}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder="Service name"
      />
    );
  }

  return (
    <input
      ref={ref}
      type="number"
      min="0"
      className="ss-cell ss-cell-input"
      value={value || 0}
      onChange={e => onChange && onChange(Number(e.target.value))}
      onFocus={e => e.target.select()}
    />
  );
}

// ── Spreadsheet Table ─────────────────────────────────────────────────────────
function Sheet({ title, subtitle, columns, rows, className }) {
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollLeft > 0);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className={`ss-sheet${className ? ' ' + className : ''}`}>
      {title && (
        <div className="ss-sheet-header">
          <div className="ss-sheet-title">{title}</div>
          {subtitle && <div className="ss-sheet-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className={`ss-table-wrap${scrolled ? ' ss-scrolled' : ''}`} ref={scrollRef}>
        <table className="ss-table">
          <thead>
            <tr>
              <th className="ss-th ss-th-frozen ss-row-header-col">Field</th>
              {columns.map((col, i) => (
                <th key={i} className={`ss-th${col.isTotal ? ' ss-th-total' : ''}${col.group ? ' ss-th-' + col.group : ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={`ss-tr${row.isSeparator ? ' ss-separator' : ''}`}>
                <td className="ss-td ss-td-frozen ss-row-label" title={row.label}>{row.label}</td>
                {row.cells.map((cell, ci) => (
                  <td key={ci} className={`ss-td${columns[ci]?.isTotal ? ' ss-td-total-col' : ''}${columns[ci]?.group === 'prev' ? ' ss-td-prev' : ''}${columns[ci]?.group === 'curr' ? ' ss-td-curr' : ''}`}>
                    <Cell
                      value={cell.value}
                      onChange={cell.onChange}
                      readOnly={cell.readOnly}
                      isTotal={cell.isTotal || columns[ci]?.isTotal}
                      isCurrency={cell.isCurrency}
                      isText={cell.isText}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DataEntryPage() {
  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState('branch');
  const [submitting, setSubmitting] = useState(false);

  const set = (path, value) => {
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const sg = form.sanskarGatividhi;
  const sw = form.sewaGatividhi;
  const ev = form.environmentGatividhi;
  const mh = form.mahilaSahbhagita;
  const sp = form.samparkGatividhi;
  const pi = form.primaryInfo;

  const handleSubmit = async () => {
    if (!form.branchName || !form.prantName || !form.districtName) {
      toast.error('Please fill Branch, Prant & District name');
      return;
    }
    setSubmitting(true);
    try {
      await reportAPI.create(form);
      toast.success('Report submitted successfully!');
      setForm(initialForm);
      setActiveTab('branch');
    } catch (err) {
      toast.error('Failed to submit. Check backend connection.');
    }
    setSubmitting(false);
  };

  const nextTab = () => { const i = TABS.findIndex(t => t.id === activeTab); if (i < TABS.length-1) setActiveTab(TABS[i+1].id); };
  const prevTab = () => { const i = TABS.findIndex(t => t.id === activeTab); if (i > 0) setActiveTab(TABS[i-1].id); };

  const tabIndex = TABS.findIndex(t => t.id === activeTab);

  // ── Column definitions for Prev/Curr/Total pattern ──────────────────────────
  const pctCols = [
    { label: 'Prev', group: 'prev' },
    { label: 'Curr', group: 'curr' },
    { label: 'Total', isTotal: true },
  ];

  // ── Helper to make a row with prev, curr, auto-total ────────────────────────
  const makeRow = (label, prevVal, prevSet, currVal, currSet) => ({
    label,
    cells: [
      { value: prevVal, onChange: prevSet },
      { value: currVal, onChange: currSet },
      { value: prevVal + currVal, readOnly: true, isTotal: true },
    ],
  });

  return (
    <div className="entry-page">
      {/* ── Header Bar ──────────────────────────────────────────────────── */}
      <div className="ss-topbar">
        <div className="ss-topbar-left">
          <div className="ss-file-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          </div>
          <div className="ss-file-meta">
            <div className="ss-file-name">Branch Monthly Report</div>
            <div className="ss-file-org">Bharat Vikas Parishad &mdash; NW Region</div>
          </div>
        </div>
        <div className="ss-topbar-right">
          <div className="ss-progress">
            <div className="ss-progress-text">{tabIndex + 1} / {TABS.length}</div>
            <div className="ss-progress-bar">
              <div className="ss-progress-fill" style={{ width: `${((tabIndex + 1) / TABS.length) * 100}%` }} />
            </div>
          </div>
          <button className="ss-submit-btn" onClick={handleSubmit} disabled={submitting || activeTab !== TABS[TABS.length-1].id}>
            {submitting ? <span className="spinner" /> : 'Submit Report'}
          </button>
        </div>
      </div>

      {/* ── Sheet Tabs ──────────────────────────────────────────────────── */}
      <div className="ss-tab-bar">
        <div className="ss-tabs-scroll">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              className={`ss-tab${activeTab === tab.id ? ' ss-tab-active' : ''}${i < tabIndex ? ' ss-tab-done' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="ss-tab-num">{i + 1}</span>
              <span className="ss-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────────────── */}
      <div className="ss-content">

        {/* ─── 1. BRANCH INFO ─────────────────────────────────────────── */}
        {activeTab === 'branch' && (
          <div className="ss-branch-form fade-in">
            <div className="ss-form-card">
              <div className="ss-form-card-title">Branch Details</div>
              <div className="ss-field-grid">
                <div className="ss-field">
                  <label className="ss-field-label">Shakha (Branch) Name *</label>
                  <select
                    className="ss-text-input"
                    value={form.branchName}
                    onChange={e => {
                      const selected = e.target.value;
                      const match = BRANCHES.find(b => b.branch === selected);
                      setForm(prev => ({
                        ...prev,
                        branchName: selected,
                        districtName: match ? match.district : prev.districtName,
                        prantName: selected ? PRANT_NAME : prev.prantName,
                      }));
                    }}
                  >
                    <option value="">-- Select Shakha --</option>
                    {BRANCHES.map(b => (
                      <option key={b.branch} value={b.branch}>{b.branch}</option>
                    ))}
                  </select>
                </div>
                <div className="ss-field">
                  <label className="ss-field-label">District Name *</label>
                  <select
                    className="ss-text-input"
                    value={form.districtName}
                    onChange={e => set('districtName', e.target.value)}
                  >
                    <option value="">-- Select District --</option>
                    {DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="ss-field">
                  <label className="ss-field-label">Prant Name *</label>
                  <select
                    className="ss-text-input"
                    value={form.prantName}
                    onChange={e => set('prantName', e.target.value)}
                  >
                    <option value="">-- Select Prant --</option>
                    <option value={PRANT_NAME}>{PRANT_NAME}</option>
                  </select>
                </div>
                <div className="ss-field">
                  <label className="ss-field-label">PAN of Branch</label>
                  <input
                    className="ss-text-input"
                    value={form.panOfBranch}
                    onChange={e => set('panOfBranch', e.target.value)}
                    placeholder="e.g. AAHB5817C"
                  />
                </div>
                <div className="ss-field">
                  <label className="ss-field-label">Report Month</label>
                  <select className="ss-text-input" value={form.reportMonth} onChange={e => set('reportMonth', e.target.value)}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="ss-field">
                  <label className="ss-field-label">Report Year</label>
                  <select className="ss-text-input" value={form.reportYear} onChange={e => set('reportYear', Number(e.target.value))}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 2. PRIMARY INFO ────────────────────────────────────────── */}
        {activeTab === 'primary' && (
          <div className="fade-in">
            <Sheet
              title="Membership Data"
              subtitle="Year-wise membership and contribution tracking"
              columns={[
                { label: '2024-25' },
                { label: 'Target 2025-26' },
                { label: 'Till Date', isTotal: true },
                { label: 'Achievement %', isTotal: true },
              ]}
              rows={[
                {
                  label: 'Members',
                  cells: [
                    { value: pi.year2024_25_members, onChange: v => set('primaryInfo.year2024_25_members', v) },
                    { value: pi.target2025_26_members, onChange: v => set('primaryInfo.target2025_26_members', v) },
                    { value: pi.tillDate_members, onChange: v => set('primaryInfo.tillDate_members', v) },
                    { value: pi.target2025_26_members > 0 ? `${((pi.tillDate_members / pi.target2025_26_members) * 100).toFixed(1)}%` : '--', readOnly: true, isTotal: true },
                  ],
                },
                {
                  label: 'Contribution (Rs.)',
                  cells: [
                    { value: pi.year2024_25_contribution, onChange: v => set('primaryInfo.year2024_25_contribution', v) },
                    { value: pi.target2025_26_contribution, onChange: v => set('primaryInfo.target2025_26_contribution', v) },
                    { value: pi.tillDate_contribution, onChange: v => set('primaryInfo.tillDate_contribution', v) },
                    { value: pi.target2025_26_contribution > 0 ? `${((pi.tillDate_contribution / pi.target2025_26_contribution) * 100).toFixed(1)}%` : '--', readOnly: true, isTotal: true },
                  ],
                },
              ]}
            />

            <Sheet
              title="Vikas Mitra & Vikas Ratna"
              columns={[
                { label: 'Base (31.03)' },
                { label: 'Till Date', isTotal: true },
                { label: 'Growth %', isTotal: true },
              ]}
              rows={[
                {
                  label: 'Vikas Mitra',
                  cells: [
                    { value: pi.vikasMitra_base, onChange: v => set('primaryInfo.vikasMitra_base', v) },
                    { value: pi.vikasMitra_tillDate, onChange: v => set('primaryInfo.vikasMitra_tillDate', v) },
                    { value: pi.vikasMitra_base > 0 ? `${(((pi.vikasMitra_tillDate - pi.vikasMitra_base) / pi.vikasMitra_base) * 100).toFixed(1)}%` : '--', readOnly: true, isTotal: true },
                  ],
                },
                {
                  label: 'Vikas Ratna',
                  cells: [
                    { value: pi.vikasRatna_base, onChange: v => set('primaryInfo.vikasRatna_base', v) },
                    { value: pi.vikasRatna_tillDate, onChange: v => set('primaryInfo.vikasRatna_tillDate', v) },
                    { value: pi.vikasRatna_base > 0 ? `${(((pi.vikasRatna_tillDate - pi.vikasRatna_base) / pi.vikasRatna_base) * 100).toFixed(1)}%` : '--', readOnly: true, isTotal: true },
                  ],
                },
              ]}
            />

            <Sheet
              title="Financial Balances"
              columns={[
                { label: 'Amount (Rs.)' },
              ]}
              rows={[
                { label: 'Cash Balance', cells: [{ value: pi.cashBalance, onChange: v => set('primaryInfo.cashBalance', v) }] },
                { label: 'Bank Balance 1', cells: [{ value: pi.bankBalance1, onChange: v => set('primaryInfo.bankBalance1', v) }] },
                { label: 'Bank Balance 2', cells: [{ value: pi.bankBalance2, onChange: v => set('primaryInfo.bankBalance2', v) }] },
                { label: 'Total Funds', cells: [{ value: pi.cashBalance + pi.bankBalance1 + pi.bankBalance2, readOnly: true, isTotal: true, isCurrency: true }] },
              ]}
            />
          </div>
        )}

        {/* ─── 3. SANSKAR ─────────────────────────────────────────────── */}
        {activeTab === 'sanskar' && (
          <div className="fade-in">
            <Sheet
              title="NSGC"
              subtitle="National Sanskar Gyan Competition"
              columns={pctCols}
              rows={[
                makeRow('Schools', sg.nsgc.prev_schools, v => set('sanskarGatividhi.nsgc.prev_schools',v), sg.nsgc.curr_schools, v => set('sanskarGatividhi.nsgc.curr_schools',v)),
                makeRow('Boys', sg.nsgc.prev_boys, v => set('sanskarGatividhi.nsgc.prev_boys',v), sg.nsgc.curr_boys, v => set('sanskarGatividhi.nsgc.curr_boys',v)),
                makeRow('Girls', sg.nsgc.prev_girls, v => set('sanskarGatividhi.nsgc.prev_girls',v), sg.nsgc.curr_girls, v => set('sanskarGatividhi.nsgc.curr_girls',v)),
                makeRow('Vadak', sg.nsgc.prev_vadak, v => set('sanskarGatividhi.nsgc.prev_vadak',v), sg.nsgc.curr_vadak, v => set('sanskarGatividhi.nsgc.curr_vadak',v)),
                { label: 'Total Presence', cells: [
                  { value: sg.nsgc.prev_boys + sg.nsgc.prev_girls + sg.nsgc.prev_vadak, readOnly: true, isTotal: true },
                  { value: sg.nsgc.curr_boys + sg.nsgc.curr_girls + sg.nsgc.curr_vadak, readOnly: true, isTotal: true },
                  { value: sg.nsgc.prev_boys + sg.nsgc.prev_girls + sg.nsgc.prev_vadak + sg.nsgc.curr_boys + sg.nsgc.curr_girls + sg.nsgc.curr_vadak, readOnly: true, isTotal: true },
                ]},
              ]}
            />

            <Sheet
              title="Bharat Ko Jano"
              subtitle="Written Examination"
              columns={pctCols}
              rows={[
                makeRow('Schools', sg.bharatKoJano.prev_schools, v => set('sanskarGatividhi.bharatKoJano.prev_schools',v), sg.bharatKoJano.curr_schools, v => set('sanskarGatividhi.bharatKoJano.curr_schools',v)),
                makeRow('Students (Jr)', sg.bharatKoJano.prev_students_jr, v => set('sanskarGatividhi.bharatKoJano.prev_students_jr',v), sg.bharatKoJano.curr_students_jr, v => set('sanskarGatividhi.bharatKoJano.curr_students_jr',v)),
                makeRow('Students (Sr)', sg.bharatKoJano.prev_students_sr, v => set('sanskarGatividhi.bharatKoJano.prev_students_sr',v), sg.bharatKoJano.curr_students_sr, v => set('sanskarGatividhi.bharatKoJano.curr_students_sr',v)),
                makeRow('Books', sg.bharatKoJano.prev_books, v => set('sanskarGatividhi.bharatKoJano.prev_books',v), sg.bharatKoJano.curr_books, v => set('sanskarGatividhi.bharatKoJano.curr_books',v)),
                { label: 'Total Students', cells: [
                  { value: sg.bharatKoJano.prev_students_jr + sg.bharatKoJano.prev_students_sr, readOnly: true, isTotal: true },
                  { value: sg.bharatKoJano.curr_students_jr + sg.bharatKoJano.curr_students_sr, readOnly: true, isTotal: true },
                  { value: sg.bharatKoJano.prev_students_jr + sg.bharatKoJano.prev_students_sr + sg.bharatKoJano.curr_students_jr + sg.bharatKoJano.curr_students_sr, readOnly: true, isTotal: true },
                ]},
              ]}
            />

            <Sheet
              title="G.V.C.A"
              subtitle="Gurukul Vidyalaya Chatra Abhinandan"
              columns={pctCols}
              rows={[
                makeRow('Schools', sg.gvca.prev_schools, v => set('sanskarGatividhi.gvca.prev_schools',v), sg.gvca.curr_schools, v => set('sanskarGatividhi.gvca.curr_schools',v)),
                makeRow('Students Honoured', sg.gvca.prev_students_honoured, v => set('sanskarGatividhi.gvca.prev_students_honoured',v), sg.gvca.curr_students_honoured, v => set('sanskarGatividhi.gvca.curr_students_honoured',v)),
                makeRow('Teachers Honoured', sg.gvca.prev_teachers_honoured, v => set('sanskarGatividhi.gvca.prev_teachers_honoured',v), sg.gvca.curr_teachers_honoured, v => set('sanskarGatividhi.gvca.curr_teachers_honoured',v)),
                makeRow('Total Presence', sg.gvca.prev_total_presence, v => set('sanskarGatividhi.gvca.prev_total_presence',v), sg.gvca.curr_total_presence, v => set('sanskarGatividhi.gvca.curr_total_presence',v)),
              ]}
            />

            <Sheet
              title="Inter College Competition"
              columns={pctCols}
              rows={[
                makeRow('Colleges', sg.interCollege.prev_colleges, v => set('sanskarGatividhi.interCollege.prev_colleges',v), sg.interCollege.curr_colleges, v => set('sanskarGatividhi.interCollege.curr_colleges',v)),
                makeRow('Boys', sg.interCollege.prev_boys, v => set('sanskarGatividhi.interCollege.prev_boys',v), sg.interCollege.curr_boys, v => set('sanskarGatividhi.interCollege.curr_boys',v)),
                makeRow('Girls', sg.interCollege.prev_girls, v => set('sanskarGatividhi.interCollege.prev_girls',v), sg.interCollege.curr_girls, v => set('sanskarGatividhi.interCollege.curr_girls',v)),
                makeRow('Total Presence', sg.interCollege.prev_total_presence, v => set('sanskarGatividhi.interCollege.prev_total_presence',v), sg.interCollege.curr_total_presence, v => set('sanskarGatividhi.interCollege.curr_total_presence',v)),
                { label: 'Total Students', cells: [
                  { value: sg.interCollege.prev_boys + sg.interCollege.prev_girls, readOnly: true, isTotal: true },
                  { value: sg.interCollege.curr_boys + sg.interCollege.curr_girls, readOnly: true, isTotal: true },
                  { value: sg.interCollege.prev_boys + sg.interCollege.prev_girls + sg.interCollege.curr_boys + sg.interCollege.curr_girls, readOnly: true, isTotal: true },
                ]},
              ]}
            />

            <Sheet
              title="Yuva Sanskar Shivir"
              columns={pctCols}
              rows={[
                makeRow('Shivir Duration (days)', sg.yuvaSanskar.prev_shivir_duration, v => set('sanskarGatividhi.yuvaSanskar.prev_shivir_duration',v), sg.yuvaSanskar.curr_shivir_duration, v => set('sanskarGatividhi.yuvaSanskar.curr_shivir_duration',v)),
                makeRow('No. of Activities', sg.yuvaSanskar.prev_activities, v => set('sanskarGatividhi.yuvaSanskar.prev_activities',v), sg.yuvaSanskar.curr_activities, v => set('sanskarGatividhi.yuvaSanskar.curr_activities',v)),
                makeRow('Presence', sg.yuvaSanskar.prev_presence, v => set('sanskarGatividhi.yuvaSanskar.prev_presence',v), sg.yuvaSanskar.curr_presence, v => set('sanskarGatividhi.yuvaSanskar.curr_presence',v)),
              ]}
            />
          </div>
        )}

        {/* ─── 4. SEWA ────────────────────────────────────────────────── */}
        {activeTab === 'sewa' && (
          <div className="fade-in">
            <Sheet
              title="Medical Camp"
              subtitle="Health & Eye Check-up"
              columns={pctCols}
              rows={[
                makeRow('Health Shivir', sw.medicalCamp.prev_health_shivir, v=>set('sewaGatividhi.medicalCamp.prev_health_shivir',v), sw.medicalCamp.curr_health_shivir, v=>set('sewaGatividhi.medicalCamp.curr_health_shivir',v)),
                makeRow('Health Beneficiary', sw.medicalCamp.prev_health_beneficiary, v=>set('sewaGatividhi.medicalCamp.prev_health_beneficiary',v), sw.medicalCamp.curr_health_beneficiary, v=>set('sewaGatividhi.medicalCamp.curr_health_beneficiary',v)),
                makeRow('Eye Shivir', sw.medicalCamp.prev_eye_shivir, v=>set('sewaGatividhi.medicalCamp.prev_eye_shivir',v), sw.medicalCamp.curr_eye_shivir, v=>set('sewaGatividhi.medicalCamp.curr_eye_shivir',v)),
                makeRow('Eye Beneficiary', sw.medicalCamp.prev_eye_beneficiary, v=>set('sewaGatividhi.medicalCamp.prev_eye_beneficiary',v), sw.medicalCamp.curr_eye_beneficiary, v=>set('sewaGatividhi.medicalCamp.curr_eye_beneficiary',v)),
                makeRow('Operations', sw.medicalCamp.prev_operations, v=>set('sewaGatividhi.medicalCamp.prev_operations',v), sw.medicalCamp.curr_operations, v=>set('sewaGatividhi.medicalCamp.curr_operations',v)),
                { label: 'Total Beneficiary', cells: [
                  { value: sw.medicalCamp.prev_health_beneficiary + sw.medicalCamp.prev_eye_beneficiary, readOnly: true, isTotal: true },
                  { value: sw.medicalCamp.curr_health_beneficiary + sw.medicalCamp.curr_eye_beneficiary, readOnly: true, isTotal: true },
                  { value: sw.medicalCamp.prev_health_beneficiary + sw.medicalCamp.prev_eye_beneficiary + sw.medicalCamp.curr_health_beneficiary + sw.medicalCamp.curr_eye_beneficiary, readOnly: true, isTotal: true },
                ]},
              ]}
            />

            <Sheet
              title="Health Awareness"
              subtitle="Yog & Nasha Mukti"
              columns={pctCols}
              rows={[
                makeRow('Yog Shivir', sw.healthAwareness.prev_yog_shivir, v=>set('sewaGatividhi.healthAwareness.prev_yog_shivir',v), sw.healthAwareness.curr_yog_shivir, v=>set('sewaGatividhi.healthAwareness.curr_yog_shivir',v)),
                makeRow('Yog Beneficiary', sw.healthAwareness.prev_yog_beneficiary, v=>set('sewaGatividhi.healthAwareness.prev_yog_beneficiary',v), sw.healthAwareness.curr_yog_beneficiary, v=>set('sewaGatividhi.healthAwareness.curr_yog_beneficiary',v)),
                makeRow('Nasha Mukti Prog.', sw.healthAwareness.prev_nasha_programmes, v=>set('sewaGatividhi.healthAwareness.prev_nasha_programmes',v), sw.healthAwareness.curr_nasha_programmes, v=>set('sewaGatividhi.healthAwareness.curr_nasha_programmes',v)),
                makeRow('Nasha Beneficiary', sw.healthAwareness.prev_nasha_beneficiary, v=>set('sewaGatividhi.healthAwareness.prev_nasha_beneficiary',v), sw.healthAwareness.curr_nasha_beneficiary, v=>set('sewaGatividhi.healthAwareness.curr_nasha_beneficiary',v)),
              ]}
            />

            <Sheet
              title="Human Organ & Blood Donation"
              columns={pctCols}
              rows={[
                makeRow('Eye Sankalp', sw.bloodDonation.prev_eye_sankalp, v=>set('sewaGatividhi.bloodDonation.prev_eye_sankalp',v), sw.bloodDonation.curr_eye_sankalp, v=>set('sewaGatividhi.bloodDonation.curr_eye_sankalp',v)),
                makeRow('Eye Pairs', sw.bloodDonation.prev_eye_pairs, v=>set('sewaGatividhi.bloodDonation.prev_eye_pairs',v), sw.bloodDonation.curr_eye_pairs, v=>set('sewaGatividhi.bloodDonation.curr_eye_pairs',v)),
                makeRow('Blood Shivir', sw.bloodDonation.prev_blood_shivir, v=>set('sewaGatividhi.bloodDonation.prev_blood_shivir',v), sw.bloodDonation.curr_blood_shivir, v=>set('sewaGatividhi.bloodDonation.curr_blood_shivir',v)),
                makeRow('Blood Units', sw.bloodDonation.prev_blood_units, v=>set('sewaGatividhi.bloodDonation.prev_blood_units',v), sw.bloodDonation.curr_blood_units, v=>set('sewaGatividhi.bloodDonation.curr_blood_units',v)),
              ]}
            />

            <Sheet
              title="Divyang Sahayta Punrvas"
              columns={pctCols}
              rows={[
                makeRow('No. of Shivir', sw.divyangSahayta.prev_shivir, v=>set('sewaGatividhi.divyangSahayta.prev_shivir',v), sw.divyangSahayta.curr_shivir, v=>set('sewaGatividhi.divyangSahayta.curr_shivir',v)),
                makeRow('Artificial Limbs', sw.divyangSahayta.prev_artificial_limbs, v=>set('sewaGatividhi.divyangSahayta.prev_artificial_limbs',v), sw.divyangSahayta.curr_artificial_limbs, v=>set('sewaGatividhi.divyangSahayta.curr_artificial_limbs',v)),
                makeRow('Beneficiary', sw.divyangSahayta.prev_beneficiary, v=>set('sewaGatividhi.divyangSahayta.prev_beneficiary',v), sw.divyangSahayta.curr_beneficiary, v=>set('sewaGatividhi.divyangSahayta.curr_beneficiary',v)),
              ]}
            />

            <Sheet
              title="Vanvasi & Other Sahayta"
              columns={pctCols}
              rows={[
                makeRow('Central Amount (Rs.)', sw.vanvasiSahayta.prev_central, v=>set('sewaGatividhi.vanvasiSahayta.prev_central',v), sw.vanvasiSahayta.curr_central, v=>set('sewaGatividhi.vanvasiSahayta.curr_central',v)),
                makeRow('Local Amount (Rs.)', sw.vanvasiSahayta.prev_local, v=>set('sewaGatividhi.vanvasiSahayta.prev_local',v), sw.vanvasiSahayta.curr_local, v=>set('sewaGatividhi.vanvasiSahayta.curr_local',v)),
                { label: 'Total Amount', cells: [
                  { value: sw.vanvasiSahayta.prev_central + sw.vanvasiSahayta.prev_local, readOnly: true, isTotal: true },
                  { value: sw.vanvasiSahayta.curr_central + sw.vanvasiSahayta.curr_local, readOnly: true, isTotal: true },
                  { value: sw.vanvasiSahayta.prev_central + sw.vanvasiSahayta.prev_local + sw.vanvasiSahayta.curr_central + sw.vanvasiSahayta.curr_local, readOnly: true, isTotal: true },
                ]},
              ]}
            />

            <Sheet
              title="Gram Vikas"
              columns={pctCols}
              rows={[
                makeRow('No. of Activities', sw.gramVikas.prev_activities, v=>set('sewaGatividhi.gramVikas.prev_activities',v), sw.gramVikas.curr_activities, v=>set('sewaGatividhi.gramVikas.curr_activities',v)),
                makeRow('Amount (Rs.)', sw.gramVikas.prev_amount, v=>set('sewaGatividhi.gramVikas.prev_amount',v), sw.gramVikas.curr_amount, v=>set('sewaGatividhi.gramVikas.curr_amount',v)),
                makeRow('Beneficiary', sw.gramVikas.prev_beneficiary, v=>set('sewaGatividhi.gramVikas.prev_beneficiary',v), sw.gramVikas.curr_beneficiary, v=>set('sewaGatividhi.gramVikas.curr_beneficiary',v)),
              ]}
            />

            <Sheet
              title="Helping Needy Projects"
              columns={pctCols}
              rows={[
                makeRow('Schools', sw.helpingNeedy.prev_schools, v=>set('sewaGatividhi.helpingNeedy.prev_schools',v), sw.helpingNeedy.curr_schools, v=>set('sewaGatividhi.helpingNeedy.curr_schools',v)),
                makeRow('Stationary Beneficiary', sw.helpingNeedy.prev_stationary_beneficiary, v=>set('sewaGatividhi.helpingNeedy.prev_stationary_beneficiary',v), sw.helpingNeedy.curr_stationary_beneficiary, v=>set('sewaGatividhi.helpingNeedy.curr_stationary_beneficiary',v)),
                makeRow('Blankets Distributed', sw.helpingNeedy.prev_blankets, v=>set('sewaGatividhi.helpingNeedy.prev_blankets',v), sw.helpingNeedy.curr_blankets, v=>set('sewaGatividhi.helpingNeedy.curr_blankets',v)),
                makeRow('Food Distributed', sw.helpingNeedy.prev_food, v=>set('sewaGatividhi.helpingNeedy.prev_food',v), sw.helpingNeedy.curr_food, v=>set('sewaGatividhi.helpingNeedy.curr_food',v)),
              ]}
            />
          </div>
        )}

        {/* ─── 5. ENVIRONMENT ─────────────────────────────────────────── */}
        {activeTab === 'environment' && (
          <div className="fade-in">
            <Sheet
              title="Tree Plantation & Eco Drives"
              columns={pctCols}
              rows={[
                makeRow('Trees Planted', ev.treePlantation_prev, v=>set('environmentGatividhi.treePlantation_prev',v), ev.treePlantation_curr, v=>set('environmentGatividhi.treePlantation_curr',v)),
                makeRow('Tulsi Podha', ev.tulsiPodha_prev, v=>set('environmentGatividhi.tulsiPodha_prev',v), ev.tulsiPodha_curr, v=>set('environmentGatividhi.tulsiPodha_curr',v)),
                makeRow('Cloth Carry Bags', ev.clothBags_prev, v=>set('environmentGatividhi.clothBags_prev',v), ev.clothBags_curr, v=>set('environmentGatividhi.clothBags_curr',v)),
                makeRow('Seminars', ev.seminars_prev, v=>set('environmentGatividhi.seminars_prev',v), ev.seminars_curr, v=>set('environmentGatividhi.seminars_curr',v)),
                makeRow('Seminar Presence', ev.seminar_presence_prev, v=>set('environmentGatividhi.seminar_presence_prev',v), ev.seminar_presence_curr, v=>set('environmentGatividhi.seminar_presence_curr',v)),
              ]}
            />
            <Sheet
              title="Animal Sewa (Jeevdaya)"
              columns={pctCols}
              rows={[
                makeRow('Parinda (Bird Feeders)', ev.parinda_prev, v=>set('environmentGatividhi.parinda_prev',v), ev.parinda_curr, v=>set('environmentGatividhi.parinda_curr',v)),
                makeRow('Kundi', ev.kundi_prev, v=>set('environmentGatividhi.kundi_prev',v), ev.kundi_curr, v=>set('environmentGatividhi.kundi_curr',v)),
                makeRow('Chara (Qty)', ev.chara_prev, v=>set('environmentGatividhi.chara_prev',v), ev.chara_curr, v=>set('environmentGatividhi.chara_curr',v)),
              ]}
            />
          </div>
        )}

        {/* ─── 6. MAHILA ──────────────────────────────────────────────── */}
        {activeTab === 'mahila' && (
          <div className="fade-in">
            <Sheet
              title="Beti Padhao Beti Apnao"
              columns={pctCols}
              rows={[
                makeRow('Programmes', mh.betiPadhao.prev_programmes, v=>set('mahilaSahbhagita.betiPadhao.prev_programmes',v), mh.betiPadhao.curr_programmes, v=>set('mahilaSahbhagita.betiPadhao.curr_programmes',v)),
                makeRow('Participants', mh.betiPadhao.prev_participants, v=>set('mahilaSahbhagita.betiPadhao.prev_participants',v), mh.betiPadhao.curr_participants, v=>set('mahilaSahbhagita.betiPadhao.curr_participants',v)),
              ]}
            />

            <Sheet
              title="Anemia Mukt Bharat"
              columns={pctCols}
              rows={[
                makeRow('Shivir', mh.anemiaMukt.prev_shivir, v=>set('mahilaSahbhagita.anemiaMukt.prev_shivir',v), mh.anemiaMukt.curr_shivir, v=>set('mahilaSahbhagita.anemiaMukt.curr_shivir',v)),
                makeRow('Total Tests Done', mh.anemiaMukt.prev_total_test, v=>set('mahilaSahbhagita.anemiaMukt.prev_total_test',v), mh.anemiaMukt.curr_total_test, v=>set('mahilaSahbhagita.anemiaMukt.curr_total_test',v)),
                makeRow('Anemic Cases Found', mh.anemiaMukt.prev_anemic, v=>set('mahilaSahbhagita.anemiaMukt.prev_anemic',v), mh.anemiaMukt.curr_anemic, v=>set('mahilaSahbhagita.anemiaMukt.curr_anemic',v)),
                makeRow('Anemia Mukt (Cured)', mh.anemiaMukt.prev_anemia_mukt, v=>set('mahilaSahbhagita.anemiaMukt.prev_anemia_mukt',v), mh.anemiaMukt.curr_anemia_mukt, v=>set('mahilaSahbhagita.anemiaMukt.curr_anemia_mukt',v)),
              ]}
            />

            <Sheet
              title="Atmnirbhar Bharat"
              subtitle="Sewing & Beautician Centres"
              columns={pctCols}
              rows={[
                makeRow('Sewing Centers', mh.atmnirbhar.prev_sewing_centers, v=>set('mahilaSahbhagita.atmnirbhar.prev_sewing_centers',v), mh.atmnirbhar.curr_sewing_centers, v=>set('mahilaSahbhagita.atmnirbhar.curr_sewing_centers',v)),
                makeRow('Sewing Beneficiary', mh.atmnirbhar.prev_sewing_beneficiary, v=>set('mahilaSahbhagita.atmnirbhar.prev_sewing_beneficiary',v), mh.atmnirbhar.curr_sewing_beneficiary, v=>set('mahilaSahbhagita.atmnirbhar.curr_sewing_beneficiary',v)),
                makeRow('Machines Distributed', mh.atmnirbhar.prev_machines, v=>set('mahilaSahbhagita.atmnirbhar.prev_machines',v), mh.atmnirbhar.curr_machines, v=>set('mahilaSahbhagita.atmnirbhar.curr_machines',v)),
                makeRow('Beautician Centers', mh.atmnirbhar.prev_beauty_centers, v=>set('mahilaSahbhagita.atmnirbhar.prev_beauty_centers',v), mh.atmnirbhar.curr_beauty_centers, v=>set('mahilaSahbhagita.atmnirbhar.curr_beauty_centers',v)),
                makeRow('Beautician Beneficiary', mh.atmnirbhar.prev_beauty_beneficiary, v=>set('mahilaSahbhagita.atmnirbhar.prev_beauty_beneficiary',v), mh.atmnirbhar.curr_beauty_beneficiary, v=>set('mahilaSahbhagita.atmnirbhar.curr_beauty_beneficiary',v)),
              ]}
            />

            <Sheet
              title="Baal Sanskar"
              columns={pctCols}
              rows={[
                makeRow('Shivir Duration (days)', mh.baalSanskar.prev_shivir_duration, v=>set('mahilaSahbhagita.baalSanskar.prev_shivir_duration',v), mh.baalSanskar.curr_shivir_duration, v=>set('mahilaSahbhagita.baalSanskar.curr_shivir_duration',v)),
                makeRow('No. of Activities', mh.baalSanskar.prev_activities, v=>set('mahilaSahbhagita.baalSanskar.prev_activities',v), mh.baalSanskar.curr_activities, v=>set('mahilaSahbhagita.baalSanskar.curr_activities',v)),
                makeRow('Presence', mh.baalSanskar.prev_presence, v=>set('mahilaSahbhagita.baalSanskar.prev_presence',v), mh.baalSanskar.curr_presence, v=>set('mahilaSahbhagita.baalSanskar.curr_presence',v)),
              ]}
            />

            <Sheet
              title="Adoption Projects"
              subtitle="Family & Girl Child"
              columns={pctCols}
              rows={[
                makeRow('Families Adopted', mh.familyAdoption.prev_families, v=>set('mahilaSahbhagita.familyAdoption.prev_families',v), mh.familyAdoption.curr_families, v=>set('mahilaSahbhagita.familyAdoption.curr_families',v)),
                makeRow('Family Beneficiary', mh.familyAdoption.prev_family_beneficiary, v=>set('mahilaSahbhagita.familyAdoption.prev_family_beneficiary',v), mh.familyAdoption.curr_family_beneficiary, v=>set('mahilaSahbhagita.familyAdoption.curr_family_beneficiary',v)),
                makeRow('Family Amount (Rs.)', mh.familyAdoption.prev_family_amount, v=>set('mahilaSahbhagita.familyAdoption.prev_family_amount',v), mh.familyAdoption.curr_family_amount, v=>set('mahilaSahbhagita.familyAdoption.curr_family_amount',v)),
                makeRow('Girl Beneficiary', mh.familyAdoption.prev_girl_beneficiary, v=>set('mahilaSahbhagita.familyAdoption.prev_girl_beneficiary',v), mh.familyAdoption.curr_girl_beneficiary, v=>set('mahilaSahbhagita.familyAdoption.curr_girl_beneficiary',v)),
                makeRow('Girl Amount (Rs.)', mh.familyAdoption.prev_girl_amount, v=>set('mahilaSahbhagita.familyAdoption.prev_girl_amount',v), mh.familyAdoption.curr_girl_amount, v=>set('mahilaSahbhagita.familyAdoption.curr_girl_amount',v)),
              ]}
            />
          </div>
        )}

        {/* ─── 7. SAMPARK ─────────────────────────────────────────────── */}
        {activeTab === 'sampark' && (
          <div className="fade-in">
            {[
              ['Sanskriti Saptah','sankritSaptah', [['Programmes','programmes'],['Participants','participants']]],
              ['BVP Sthapna Diwas','bvpSthapnaDiwas', [['Programmes','programmes'],['Participants','participants']]],
              ['Vichar Gosthi','vichargosthi', [['Programmes','programmes'],['Participants','participants']]],
            ].map(([title, key, fields]) => (
              <Sheet key={key} title={title} columns={pctCols}
                rows={fields.map(([label, f]) =>
                  makeRow(label, sp[key][`prev_${f}`], v=>set(`samparkGatividhi.${key}.prev_${f}`,v), sp[key][`curr_${f}`], v=>set(`samparkGatividhi.${key}.curr_${f}`,v))
                )}
              />
            ))}

            <Sheet
              title="Samuhik Saral Vivah"
              columns={pctCols}
              rows={[
                makeRow('No. of Vivah', sp.samuhikVivah.prev_vivah, v=>set('samparkGatividhi.samuhikVivah.prev_vivah',v), sp.samuhikVivah.curr_vivah, v=>set('samparkGatividhi.samuhikVivah.curr_vivah',v)),
                makeRow('Pairs', sp.samuhikVivah.prev_pairs, v=>set('samparkGatividhi.samuhikVivah.prev_pairs',v), sp.samuhikVivah.curr_pairs, v=>set('samparkGatividhi.samuhikVivah.curr_pairs',v)),
              ]}
            />

            <Sheet
              title="Nav Varsh & Inspiring Events"
              columns={pctCols}
              rows={[
                makeRow('Programmes', sp.navVarsh.prev_programmes, v=>set('samparkGatividhi.navVarsh.prev_programmes',v), sp.navVarsh.curr_programmes, v=>set('samparkGatividhi.navVarsh.curr_programmes',v)),
                makeRow('No. of Activities', sp.navVarsh.prev_activities, v=>set('samparkGatividhi.navVarsh.prev_activities',v), sp.navVarsh.curr_activities, v=>set('samparkGatividhi.navVarsh.curr_activities',v)),
                makeRow('Presence', sp.navVarsh.prev_presence, v=>set('samparkGatividhi.navVarsh.prev_presence',v), sp.navVarsh.curr_presence, v=>set('samparkGatividhi.navVarsh.curr_presence',v)),
              ]}
            />

            <Sheet
              title="Ek Shakha Ek Gaon"
              columns={pctCols}
              rows={[
                makeRow('Programmes', sp.ekShakha.prev_programmes, v=>set('samparkGatividhi.ekShakha.prev_programmes',v), sp.ekShakha.curr_programmes, v=>set('samparkGatividhi.ekShakha.curr_programmes',v)),
                makeRow('Beneficiaries', sp.ekShakha.prev_beneficiaries, v=>set('samparkGatividhi.ekShakha.prev_beneficiaries',v), sp.ekShakha.curr_beneficiaries, v=>set('samparkGatividhi.ekShakha.curr_beneficiaries',v)),
                makeRow('Amount (Rs.)', sp.ekShakha.prev_amount, v=>set('samparkGatividhi.ekShakha.prev_amount',v), sp.ekShakha.curr_amount, v=>set('samparkGatividhi.ekShakha.curr_amount',v)),
              ]}
            />
          </div>
        )}

        {/* ─── 8. PERMANENT SEWA ──────────────────────────────────────── */}
        {activeTab === 'permanent' && (
          <div className="fade-in">
            <Sheet
              title="Permanent Sewa Projects"
              subtitle="Ongoing service centres and their impact"
              columns={[
                { label: 'Service' },
                { label: 'Prev Projects', group: 'prev' },
                { label: 'Prev Beneficiary', group: 'prev' },
                { label: 'Prev Cost (Rs.)', group: 'prev' },
                { label: 'Curr Projects', group: 'curr' },
                { label: 'Curr Beneficiary', group: 'curr' },
                { label: 'Curr Cost (Rs.)', group: 'curr' },
                { label: 'Total Beneficiary', isTotal: true },
                { label: 'Total Cost', isTotal: true },
              ]}
              rows={form.permanentSewa.map((row, i) => ({
                label: `#${i + 1}`,
                cells: [
                  { value: row.service, onChange: v => { const u = [...form.permanentSewa]; u[i] = { ...u[i], service: v }; set('permanentSewa', u); }, isText: true },
                  { value: row.prev_projects, onChange: v => { const u = [...form.permanentSewa]; u[i] = { ...u[i], prev_projects: v }; set('permanentSewa', u); } },
                  { value: row.prev_beneficiary, onChange: v => { const u = [...form.permanentSewa]; u[i] = { ...u[i], prev_beneficiary: v }; set('permanentSewa', u); } },
                  { value: row.prev_cost, onChange: v => { const u = [...form.permanentSewa]; u[i] = { ...u[i], prev_cost: v }; set('permanentSewa', u); } },
                  { value: row.curr_projects, onChange: v => { const u = [...form.permanentSewa]; u[i] = { ...u[i], curr_projects: v }; set('permanentSewa', u); } },
                  { value: row.curr_beneficiary, onChange: v => { const u = [...form.permanentSewa]; u[i] = { ...u[i], curr_beneficiary: v }; set('permanentSewa', u); } },
                  { value: row.curr_cost, onChange: v => { const u = [...form.permanentSewa]; u[i] = { ...u[i], curr_cost: v }; set('permanentSewa', u); } },
                  { value: row.prev_beneficiary + row.curr_beneficiary, readOnly: true, isTotal: true },
                  { value: row.prev_cost + row.curr_cost, readOnly: true, isTotal: true, isCurrency: true },
                ],
              }))}
            />
            <button className="ss-add-row-btn" onClick={() => set('permanentSewa', [...form.permanentSewa, { service:'', prev_projects:0, prev_beneficiary:0, prev_cost:0, curr_projects:0, curr_beneficiary:0, curr_cost:0 }])}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Row
            </button>
          </div>
        )}

        {/* ─── 9. MEETINGS ────────────────────────────────────────────── */}
        {activeTab === 'meetings' && (
          <div className="fade-in">
            {[
              { type: 'executive', label: 'Executive Committee Meetings' },
              { type: 'generalBody', label: 'General Body Meetings' },
              { type: 'workingGroup', label: 'Working Group Meetings' },
            ].map(({ type, label }) => (
              <div key={type} className="ss-sheet">
                <div className="ss-sheet-header">
                  <div className="ss-sheet-title">{label}</div>
                  <div className="ss-meeting-stats">
                    <span className="ss-stat">{form.meetings[type].length} meetings</span>
                    <span className="ss-stat-sep">&middot;</span>
                    <span className="ss-stat">{form.meetings[type].reduce((s,m) => s + (m.participants||0), 0)} total participants</span>
                  </div>
                </div>
                <div className="ss-table-wrap">
                  <table className="ss-table">
                    <thead>
                      <tr>
                        <th className="ss-th ss-th-frozen ss-row-header-col">#</th>
                        <th className="ss-th">Date</th>
                        <th className="ss-th">Participants</th>
                        <th className="ss-th ss-th-action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.meetings[type].map((m, i) => (
                        <tr key={i} className="ss-tr">
                          <td className="ss-td ss-td-frozen ss-row-label">{i + 1}</td>
                          <td className="ss-td">
                            <input
                              type="date"
                              className="ss-cell ss-cell-input ss-cell-date"
                              value={m.date}
                              onChange={e => { const u = JSON.parse(JSON.stringify(form.meetings)); u[type][i].date = e.target.value; set('meetings', u); }}
                            />
                          </td>
                          <td className="ss-td">
                            <Cell
                              value={m.participants}
                              onChange={v => { const u = JSON.parse(JSON.stringify(form.meetings)); u[type][i].participants = v; set('meetings', u); }}
                            />
                          </td>
                          <td className="ss-td ss-td-action">
                            {form.meetings[type].length > 1 && (
                              <button className="ss-remove-btn" onClick={() => { const u = JSON.parse(JSON.stringify(form.meetings)); u[type].splice(i, 1); set('meetings', u); }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="ss-add-row-btn" onClick={() => { const u = JSON.parse(JSON.stringify(form.meetings)); u[type].push({ ...defaultMeeting }); set('meetings', u); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Meeting
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom Nav ──────────────────────────────────────────────────── */}
      <div className="ss-bottom-nav">
        <button className="ss-nav-btn ss-nav-prev" onClick={prevTab} disabled={activeTab === TABS[0].id}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Previous
        </button>
        <div className="ss-nav-indicator">
          {TABS.map((tab, i) => (
            <div
              key={tab.id}
              className={`ss-nav-dot${activeTab === tab.id ? ' active' : ''}${i < tabIndex ? ' done' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            />
          ))}
        </div>
        {activeTab !== TABS[TABS.length - 1].id ? (
          <button className="ss-nav-btn ss-nav-next" onClick={nextTab}>
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ) : (
          <button className="ss-nav-btn ss-nav-submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <span className="spinner" /> : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Submit Report
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
