import React, { useState } from 'react';
import { reportAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './DataEntryPage.css';

const MONTHS = ['April','May','June','July','August','September','October','November','December','January','February','March'];
const YEARS = [2023, 2024, 2025, 2026];
const defaultMeeting = { date: '', participants: 0 };

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
  { id:'branch',      label:'Branch Info',  icon:'🏢' },
  { id:'primary',     label:'Primary Info', icon:'👥' },
  { id:'sanskar',     label:'Sanskar',      icon:'📚' },
  { id:'sewa',        label:'Sewa',         icon:'❤️' },
  { id:'environment', label:'Environment',  icon:'🌳' },
  { id:'mahila',      label:'Mahila',       icon:'👩' },
  { id:'sampark',     label:'Sampark',      icon:'🤝' },
  { id:'permanent',   label:'Perm. Sewa',   icon:'🏥' },
  { id:'meetings',    label:'Meetings',     icon:'📅' },
];

// ── Utility helpers ────────────────────────────────────────────────────────────
function pct(part, total) {
  if (!total || total === 0) return '—';
  return `${((part / total) * 100).toFixed(1)}%`;
}

// ── Reusable small components ──────────────────────────────────────────────────
function AutoBadge({ label, value, color = '#FF6B00' }) {
  return (
    <div className="auto-badge" style={{ borderColor: color }}>
      <span className="auto-badge-label">{label}</span>
      <span className="auto-badge-value" style={{ color }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  );
}

function PctBadge({ label, part, total }) {
  const num = total > 0 ? (part / total) * 100 : 0;
  const color = num >= 80 ? '#2ECC71' : num >= 50 ? '#F39C12' : '#E74C3C';
  return (
    <div className="auto-badge pct" style={{ borderColor: color }}>
      <span className="auto-badge-label">{label}</span>
      <span className="auto-badge-value" style={{ color }}>{pct(part, total)}</span>
    </div>
  );
}

function NumField({ label, value, onChange, readOnly = false, highlight = false }) {
  return (
    <div className={`nf${highlight ? ' nf-highlight' : ''}${readOnly ? ' nf-readonly' : ''}`}>
      <span className="nf-label">{label}</span>
      <input
        type="number" min="0"
        className="nf-input"
        value={value || 0}
        onChange={e => !readOnly && onChange && onChange(Number(e.target.value))}
        readOnly={readOnly}
      />
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="section-card fade-in">
      <div className="section-header">
        <span className="section-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="sub-section">
      <div className="subsection-title">{title}</div>
      {children}
    </div>
  );
}

// The main layout for a Prev / Curr / Auto row block
function PCR({ label, prevFields, currFields, autoFields }) {
  return (
    <div className="pcr-wrapper">
      <div className="pcr-label">{label}</div>
      <div className="pcr-body">
        <div className="pcr-col">
          <div className="pcr-col-head">Upto Previous Month</div>
          <div className="pcr-inputs">{prevFields}</div>
        </div>
        <div className="pcr-col">
          <div className="pcr-col-head current">Current Month</div>
          <div className="pcr-inputs">{currFields}</div>
        </div>
        <div className="pcr-col auto-col">
          <div className="pcr-col-head">Cumulative / Auto</div>
          <div className="pcr-inputs">{autoFields}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────
export default function DataEntryPage() {
  const [form, setForm]       = useState(initialForm);
  const [activeTab, setActiveTab] = useState('branch');
  const [submitting, setSubmitting] = useState(false);

  // Deep-set via dot-path
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

  const p = (sec, sub, field) => `${sec}.${sub}.${field}`;   // shorthand path

  // ── Shorthand refs ──────────────────────────────────────────────────────────
  const sg = form.sanskarGatividhi;
  const sw = form.sewaGatividhi;
  const ev = form.environmentGatividhi;
  const mh = form.mahilaSahbhagita;
  const sp = form.samparkGatividhi;
  const pi = form.primaryInfo;

  // ── Auto-computed values ───────────────────────────────────────────────────
  // NSGC
  const nsgc_prev_total = sg.nsgc.prev_boys + sg.nsgc.prev_girls + sg.nsgc.prev_vadak;
  const nsgc_curr_total = sg.nsgc.curr_boys + sg.nsgc.curr_girls + sg.nsgc.curr_vadak;

  // BKJ
  const bkj_prev_total = sg.bharatKoJano.prev_students_jr + sg.bharatKoJano.prev_students_sr;
  const bkj_curr_total = sg.bharatKoJano.curr_students_jr + sg.bharatKoJano.curr_students_sr;

  // GVCA
  const gvca_prev_total = sg.gvca.prev_students_honoured + sg.gvca.prev_teachers_honoured;
  const gvca_curr_total = sg.gvca.curr_students_honoured + sg.gvca.curr_teachers_honoured;

  // Inter College
  const ic_prev_total = sg.interCollege.prev_boys + sg.interCollege.prev_girls;
  const ic_curr_total = sg.interCollege.curr_boys + sg.interCollege.curr_girls;

  // Medical
  const med_prev_total = sw.medicalCamp.prev_health_beneficiary + sw.medicalCamp.prev_eye_beneficiary;
  const med_curr_total = sw.medicalCamp.curr_health_beneficiary + sw.medicalCamp.curr_eye_beneficiary;

  // Vanvasi
  const van_prev_total = sw.vanvasiSahayta.prev_central + sw.vanvasiSahayta.prev_local;
  const van_curr_total = sw.vanvasiSahayta.curr_central + sw.vanvasiSahayta.curr_local;

  // Blood
  const blood_cum = sw.bloodDonation.prev_blood_units + sw.bloodDonation.curr_blood_units;

  // Anemia
  const anemia_cum_tests  = mh.anemiaMukt.prev_total_test + mh.anemiaMukt.curr_total_test;
  const anemia_cum_anemic = mh.anemiaMukt.prev_anemic + mh.anemiaMukt.curr_anemic;

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  return (
    <div className="entry-page">
      <div className="entry-hero">
        <div className="hero-content">
          <div className="hero-badge">Monthly Report</div>
          <h1>Submit Branch Report</h1>
          <p>Bharat Vikas Parishad — NW Region</p>
        </div>
      </div>

      <div className="entry-container">
        <div className="tab-nav">
          {TABS.map((tab, i) => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-num">{i + 1}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">

          {/* ─── 1. BRANCH INFO ──────────────────────────────────────── */}
          {activeTab === 'branch' && (
            <SectionCard title="Branch Information" icon="🏢">
              <div className="form-grid-2">
                {[['Branch Name *','branchName','e.g. Jodhpur Marwar'],
                  ['Prant Name *','prantName','e.g. Rajasthan Pashchim'],
                  ['District Name *','districtName','e.g. Jodhpur'],
                  ['PAN of Branch','panOfBranch','e.g. AAHB5817C']
                ].map(([label,key,ph]) => (
                  <div className="field-group" key={key}>
                    <label className="field-label">{label}</label>
                    <input className="text-input" value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph} />
                  </div>
                ))}
                <div className="field-group">
                  <label className="field-label">Report Month</label>
                  <select className="text-input" value={form.reportMonth} onChange={e => set('reportMonth', e.target.value)}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label">Report Year</label>
                  <select className="text-input" value={form.reportYear} onChange={e => set('reportYear', Number(e.target.value))}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ─── 2. PRIMARY INFO ─────────────────────────────────────── */}
          {activeTab === 'primary' && (
            <SectionCard title="Primary Information — Membership & Finances" icon="👥">
              <SubSection title="Membership Data">
                <div className="form-grid-3">
                  <NumField label="2024-25 Members"             value={pi.year2024_25_members}         onChange={v => set('primaryInfo.year2024_25_members', v)} />
                  <NumField label="2024-25 Contribution (₹)"   value={pi.year2024_25_contribution}     onChange={v => set('primaryInfo.year2024_25_contribution', v)} />
                  <div/>
                  <NumField label="Target 2025-26 Members"      value={pi.target2025_26_members}        onChange={v => set('primaryInfo.target2025_26_members', v)} />
                  <NumField label="Target 2025-26 Contribution" value={pi.target2025_26_contribution}   onChange={v => set('primaryInfo.target2025_26_contribution', v)} />
                  <div/>
                  <NumField label="Till Date Members"            value={pi.tillDate_members}             onChange={v => set('primaryInfo.tillDate_members', v)} highlight />
                  <NumField label="Till Date Contribution (₹)"  value={pi.tillDate_contribution}        onChange={v => set('primaryInfo.tillDate_contribution', v)} highlight />
                </div>
                <div className="auto-badges-row">
                  <AutoBadge label="Target Achievement %" value={pct(pi.tillDate_members, pi.target2025_26_members)} />
                  <AutoBadge label="Avg Contribution / Member" value={pi.tillDate_members > 0 ? `₹${Math.round(pi.tillDate_contribution / pi.tillDate_members).toLocaleString()}` : '—'} />
                  <AutoBadge label="Total Funds" value={`₹${(pi.cashBalance + pi.bankBalance1 + pi.bankBalance2).toLocaleString()}`} color="#D4AF37" />
                </div>
              </SubSection>

              <SubSection title="Vikas Mitra & Vikas Ratna">
                <div className="form-grid-4">
                  <NumField label="Vikas Mitra (Base 31.03)"   value={pi.vikasMitra_base}     onChange={v => set('primaryInfo.vikasMitra_base', v)} />
                  <NumField label="Vikas Mitra (Till Date)"    value={pi.vikasMitra_tillDate}  onChange={v => set('primaryInfo.vikasMitra_tillDate', v)} highlight />
                  <NumField label="Vikas Ratna (Base 31.03)"   value={pi.vikasRatna_base}      onChange={v => set('primaryInfo.vikasRatna_base', v)} />
                  <NumField label="Vikas Ratna (Till Date)"    value={pi.vikasRatna_tillDate}  onChange={v => set('primaryInfo.vikasRatna_tillDate', v)} highlight />
                </div>
                <div className="auto-badges-row">
                  <AutoBadge label="Vikas Mitra Growth" value={pct(pi.vikasMitra_tillDate - pi.vikasMitra_base, pi.vikasMitra_base)} />
                  <AutoBadge label="Vikas Ratna Growth"  value={pct(pi.vikasRatna_tillDate - pi.vikasRatna_base, pi.vikasRatna_base)} />
                </div>
              </SubSection>

              <SubSection title="Financial Balances">
                <div className="form-grid-3">
                  <NumField label="Cash Balance (₹)"  value={pi.cashBalance}  onChange={v => set('primaryInfo.cashBalance', v)} />
                  <NumField label="Bank Balance 1 (₹)" value={pi.bankBalance1} onChange={v => set('primaryInfo.bankBalance1', v)} />
                  <NumField label="Bank Balance 2 (₹)" value={pi.bankBalance2} onChange={v => set('primaryInfo.bankBalance2', v)} />
                </div>
                <div className="auto-badges-row">
                  <AutoBadge label="Total Cash + Bank" value={`₹${(pi.cashBalance + pi.bankBalance1 + pi.bankBalance2).toLocaleString()}`} color="#D4AF37" />
                  <PctBadge label="Cash % of Total" part={pi.cashBalance} total={pi.cashBalance + pi.bankBalance1 + pi.bankBalance2} />
                </div>
              </SubSection>
            </SectionCard>
          )}

          {/* ─── 3. SANSKAR ──────────────────────────────────────────── */}
          {activeTab === 'sanskar' && (
            <SectionCard title="Sanskar Gatividhi" icon="📚">

              <PCR label="NSGC — National Sanskar Gyan Competition"
                prevFields={<>
                  <NumField label="Schools"       value={sg.nsgc.prev_schools} onChange={v => set(p('sanskarGatividhi','nsgc','prev_schools'), v)} />
                  <NumField label="Boys"          value={sg.nsgc.prev_boys}    onChange={v => set(p('sanskarGatividhi','nsgc','prev_boys'), v)} />
                  <NumField label="Girls"         value={sg.nsgc.prev_girls}   onChange={v => set(p('sanskarGatividhi','nsgc','prev_girls'), v)} />
                  <NumField label="Vadak"         value={sg.nsgc.prev_vadak}   onChange={v => set(p('sanskarGatividhi','nsgc','prev_vadak'), v)} />
                  <NumField label="Total Presence" value={nsgc_prev_total} readOnly highlight />
                </>}
                currFields={<>
                  <NumField label="Schools"       value={sg.nsgc.curr_schools} onChange={v => set(p('sanskarGatividhi','nsgc','curr_schools'), v)} />
                  <NumField label="Boys"          value={sg.nsgc.curr_boys}    onChange={v => set(p('sanskarGatividhi','nsgc','curr_boys'), v)} />
                  <NumField label="Girls"         value={sg.nsgc.curr_girls}   onChange={v => set(p('sanskarGatividhi','nsgc','curr_girls'), v)} />
                  <NumField label="Vadak"         value={sg.nsgc.curr_vadak}   onChange={v => set(p('sanskarGatividhi','nsgc','curr_vadak'), v)} />
                  <NumField label="Total Presence" value={nsgc_curr_total} readOnly highlight />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Presence" value={nsgc_prev_total + nsgc_curr_total} />
                  <PctBadge  label="Girls % of Students" part={sg.nsgc.curr_girls} total={sg.nsgc.curr_boys + sg.nsgc.curr_girls} />
                  <AutoBadge label="Cumul. Schools" value={sg.nsgc.prev_schools + sg.nsgc.curr_schools} color="#1B2A3B" />
                </>}
              />

              <PCR label="Bharat Ko Jano — Written Exam"
                prevFields={<>
                  <NumField label="Schools"        value={sg.bharatKoJano.prev_schools}      onChange={v => set(p('sanskarGatividhi','bharatKoJano','prev_schools'), v)} />
                  <NumField label="Students (Jr)"  value={sg.bharatKoJano.prev_students_jr}  onChange={v => set(p('sanskarGatividhi','bharatKoJano','prev_students_jr'), v)} />
                  <NumField label="Students (Sr)"  value={sg.bharatKoJano.prev_students_sr}  onChange={v => set(p('sanskarGatividhi','bharatKoJano','prev_students_sr'), v)} />
                  <NumField label="Total Students" value={bkj_prev_total} readOnly highlight />
                  <NumField label="Books"          value={sg.bharatKoJano.prev_books}        onChange={v => set(p('sanskarGatividhi','bharatKoJano','prev_books'), v)} />
                </>}
                currFields={<>
                  <NumField label="Schools"        value={sg.bharatKoJano.curr_schools}      onChange={v => set(p('sanskarGatividhi','bharatKoJano','curr_schools'), v)} />
                  <NumField label="Students (Jr)"  value={sg.bharatKoJano.curr_students_jr}  onChange={v => set(p('sanskarGatividhi','bharatKoJano','curr_students_jr'), v)} />
                  <NumField label="Students (Sr)"  value={sg.bharatKoJano.curr_students_sr}  onChange={v => set(p('sanskarGatividhi','bharatKoJano','curr_students_sr'), v)} />
                  <NumField label="Total Students" value={bkj_curr_total} readOnly highlight />
                  <NumField label="Books"          value={sg.bharatKoJano.curr_books}        onChange={v => set(p('sanskarGatividhi','bharatKoJano','curr_books'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Students" value={bkj_prev_total + bkj_curr_total} />
                  <PctBadge  label="Senior Students %" part={sg.bharatKoJano.curr_students_sr} total={bkj_curr_total} />
                  <PctBadge  label="Junior Students %"  part={sg.bharatKoJano.curr_students_jr} total={bkj_curr_total} />
                </>}
              />

              <PCR label="G.V.C.A — Gurukul Vidyalaya Chatra Abhinandan"
                prevFields={<>
                  <NumField label="Schools"           value={sg.gvca.prev_schools}            onChange={v => set(p('sanskarGatividhi','gvca','prev_schools'), v)} />
                  <NumField label="Students Honoured" value={sg.gvca.prev_students_honoured}  onChange={v => set(p('sanskarGatividhi','gvca','prev_students_honoured'), v)} />
                  <NumField label="Teachers Honoured" value={sg.gvca.prev_teachers_honoured}  onChange={v => set(p('sanskarGatividhi','gvca','prev_teachers_honoured'), v)} />
                  <NumField label="Total Honoured"    value={gvca_prev_total} readOnly highlight />
                  <NumField label="Total Presence"    value={sg.gvca.prev_total_presence}     onChange={v => set(p('sanskarGatividhi','gvca','prev_total_presence'), v)} />
                </>}
                currFields={<>
                  <NumField label="Schools"           value={sg.gvca.curr_schools}            onChange={v => set(p('sanskarGatividhi','gvca','curr_schools'), v)} />
                  <NumField label="Students Honoured" value={sg.gvca.curr_students_honoured}  onChange={v => set(p('sanskarGatividhi','gvca','curr_students_honoured'), v)} />
                  <NumField label="Teachers Honoured" value={sg.gvca.curr_teachers_honoured}  onChange={v => set(p('sanskarGatividhi','gvca','curr_teachers_honoured'), v)} />
                  <NumField label="Total Honoured"    value={gvca_curr_total} readOnly highlight />
                  <NumField label="Total Presence"    value={sg.gvca.curr_total_presence}     onChange={v => set(p('sanskarGatividhi','gvca','curr_total_presence'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Honoured" value={gvca_prev_total + gvca_curr_total} />
                  <PctBadge  label="Teachers % Honoured" part={sg.gvca.curr_teachers_honoured} total={gvca_curr_total} />
                  <PctBadge  label="Attendance %" part={sg.gvca.curr_total_presence} total={gvca_curr_total} />
                </>}
              />

              <PCR label="Inter College Competition"
                prevFields={<>
                  <NumField label="Colleges"       value={sg.interCollege.prev_colleges}       onChange={v => set(p('sanskarGatividhi','interCollege','prev_colleges'), v)} />
                  <NumField label="Boys"           value={sg.interCollege.prev_boys}            onChange={v => set(p('sanskarGatividhi','interCollege','prev_boys'), v)} />
                  <NumField label="Girls"          value={sg.interCollege.prev_girls}           onChange={v => set(p('sanskarGatividhi','interCollege','prev_girls'), v)} />
                  <NumField label="Total Students" value={ic_prev_total} readOnly highlight />
                  <NumField label="Total Presence" value={sg.interCollege.prev_total_presence}  onChange={v => set(p('sanskarGatividhi','interCollege','prev_total_presence'), v)} />
                </>}
                currFields={<>
                  <NumField label="Colleges"       value={sg.interCollege.curr_colleges}       onChange={v => set(p('sanskarGatividhi','interCollege','curr_colleges'), v)} />
                  <NumField label="Boys"           value={sg.interCollege.curr_boys}            onChange={v => set(p('sanskarGatividhi','interCollege','curr_boys'), v)} />
                  <NumField label="Girls"          value={sg.interCollege.curr_girls}           onChange={v => set(p('sanskarGatividhi','interCollege','curr_girls'), v)} />
                  <NumField label="Total Students" value={ic_curr_total} readOnly highlight />
                  <NumField label="Total Presence" value={sg.interCollege.curr_total_presence}  onChange={v => set(p('sanskarGatividhi','interCollege','curr_total_presence'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Students" value={ic_prev_total + ic_curr_total} />
                  <PctBadge  label="Girls %"       part={sg.interCollege.curr_girls} total={ic_curr_total} />
                  <PctBadge  label="Attendance %"  part={sg.interCollege.curr_total_presence} total={ic_curr_total} />
                </>}
              />

              <PCR label="Yuva Sanskar Shivir"
                prevFields={<>
                  <NumField label="Shivir Duration (days)" value={sg.yuvaSanskar.prev_shivir_duration} onChange={v => set(p('sanskarGatividhi','yuvaSanskar','prev_shivir_duration'), v)} />
                  <NumField label="No. of Activities"      value={sg.yuvaSanskar.prev_activities}      onChange={v => set(p('sanskarGatividhi','yuvaSanskar','prev_activities'), v)} />
                  <NumField label="Presence"               value={sg.yuvaSanskar.prev_presence}        onChange={v => set(p('sanskarGatividhi','yuvaSanskar','prev_presence'), v)} />
                </>}
                currFields={<>
                  <NumField label="Shivir Duration (days)" value={sg.yuvaSanskar.curr_shivir_duration} onChange={v => set(p('sanskarGatividhi','yuvaSanskar','curr_shivir_duration'), v)} />
                  <NumField label="No. of Activities"      value={sg.yuvaSanskar.curr_activities}      onChange={v => set(p('sanskarGatividhi','yuvaSanskar','curr_activities'), v)} />
                  <NumField label="Presence"               value={sg.yuvaSanskar.curr_presence}        onChange={v => set(p('sanskarGatividhi','yuvaSanskar','curr_presence'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Days"     value={sg.yuvaSanskar.prev_shivir_duration + sg.yuvaSanskar.curr_shivir_duration} />
                  <AutoBadge label="Total Presence" value={sg.yuvaSanskar.prev_presence + sg.yuvaSanskar.curr_presence} />
                </>}
              />
            </SectionCard>
          )}

          {/* ─── 4. SEWA ─────────────────────────────────────────────── */}
          {activeTab === 'sewa' && (
            <SectionCard title="Sewa Gatividhi" icon="❤️">

              <PCR label="Medical Camp — Health & Eye Check-up"
                prevFields={<>
                  <NumField label="Health Shivir"      value={sw.medicalCamp.prev_health_shivir}      onChange={v => set(p('sewaGatividhi','medicalCamp','prev_health_shivir'), v)} />
                  <NumField label="Health Beneficiary" value={sw.medicalCamp.prev_health_beneficiary} onChange={v => set(p('sewaGatividhi','medicalCamp','prev_health_beneficiary'), v)} />
                  <NumField label="Eye Shivir"         value={sw.medicalCamp.prev_eye_shivir}         onChange={v => set(p('sewaGatividhi','medicalCamp','prev_eye_shivir'), v)} />
                  <NumField label="Eye Beneficiary"    value={sw.medicalCamp.prev_eye_beneficiary}    onChange={v => set(p('sewaGatividhi','medicalCamp','prev_eye_beneficiary'), v)} />
                  <NumField label="Operations"         value={sw.medicalCamp.prev_operations}         onChange={v => set(p('sewaGatividhi','medicalCamp','prev_operations'), v)} />
                  <NumField label="Total Beneficiary"  value={med_prev_total} readOnly highlight />
                </>}
                currFields={<>
                  <NumField label="Health Shivir"      value={sw.medicalCamp.curr_health_shivir}      onChange={v => set(p('sewaGatividhi','medicalCamp','curr_health_shivir'), v)} />
                  <NumField label="Health Beneficiary" value={sw.medicalCamp.curr_health_beneficiary} onChange={v => set(p('sewaGatividhi','medicalCamp','curr_health_beneficiary'), v)} />
                  <NumField label="Eye Shivir"         value={sw.medicalCamp.curr_eye_shivir}         onChange={v => set(p('sewaGatividhi','medicalCamp','curr_eye_shivir'), v)} />
                  <NumField label="Eye Beneficiary"    value={sw.medicalCamp.curr_eye_beneficiary}    onChange={v => set(p('sewaGatividhi','medicalCamp','curr_eye_beneficiary'), v)} />
                  <NumField label="Operations"         value={sw.medicalCamp.curr_operations}         onChange={v => set(p('sewaGatividhi','medicalCamp','curr_operations'), v)} />
                  <NumField label="Total Beneficiary"  value={med_curr_total} readOnly highlight />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Beneficiary" value={med_prev_total + med_curr_total} />
                  <PctBadge  label="Eye % of Total"   part={sw.medicalCamp.curr_eye_beneficiary}    total={med_curr_total} />
                  <PctBadge  label="Health % of Total" part={sw.medicalCamp.curr_health_beneficiary} total={med_curr_total} />
                </>}
              />

              <PCR label="Health Awareness — Yog & Nasha Mukti"
                prevFields={<>
                  <NumField label="Yog Shivir"         value={sw.healthAwareness.prev_yog_shivir}        onChange={v => set(p('sewaGatividhi','healthAwareness','prev_yog_shivir'), v)} />
                  <NumField label="Yog Beneficiary"    value={sw.healthAwareness.prev_yog_beneficiary}   onChange={v => set(p('sewaGatividhi','healthAwareness','prev_yog_beneficiary'), v)} />
                  <NumField label="Nasha Mukti Prog."  value={sw.healthAwareness.prev_nasha_programmes}  onChange={v => set(p('sewaGatividhi','healthAwareness','prev_nasha_programmes'), v)} />
                  <NumField label="Nasha Beneficiary"  value={sw.healthAwareness.prev_nasha_beneficiary} onChange={v => set(p('sewaGatividhi','healthAwareness','prev_nasha_beneficiary'), v)} />
                </>}
                currFields={<>
                  <NumField label="Yog Shivir"         value={sw.healthAwareness.curr_yog_shivir}        onChange={v => set(p('sewaGatividhi','healthAwareness','curr_yog_shivir'), v)} />
                  <NumField label="Yog Beneficiary"    value={sw.healthAwareness.curr_yog_beneficiary}   onChange={v => set(p('sewaGatividhi','healthAwareness','curr_yog_beneficiary'), v)} />
                  <NumField label="Nasha Mukti Prog."  value={sw.healthAwareness.curr_nasha_programmes}  onChange={v => set(p('sewaGatividhi','healthAwareness','curr_nasha_programmes'), v)} />
                  <NumField label="Nasha Beneficiary"  value={sw.healthAwareness.curr_nasha_beneficiary} onChange={v => set(p('sewaGatividhi','healthAwareness','curr_nasha_beneficiary'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Yog Beneficiary"   value={sw.healthAwareness.prev_yog_beneficiary + sw.healthAwareness.curr_yog_beneficiary} />
                  <AutoBadge label="Total Nasha Beneficiary" value={sw.healthAwareness.prev_nasha_beneficiary + sw.healthAwareness.curr_nasha_beneficiary} color="#9B59B6" />
                </>}
              />

              <PCR label="Human Organ & Blood Donation"
                prevFields={<>
                  <NumField label="Eye Sankalp"   value={sw.bloodDonation.prev_eye_sankalp}  onChange={v => set(p('sewaGatividhi','bloodDonation','prev_eye_sankalp'), v)} />
                  <NumField label="Eye Pairs"     value={sw.bloodDonation.prev_eye_pairs}    onChange={v => set(p('sewaGatividhi','bloodDonation','prev_eye_pairs'), v)} />
                  <NumField label="Blood Shivir"  value={sw.bloodDonation.prev_blood_shivir} onChange={v => set(p('sewaGatividhi','bloodDonation','prev_blood_shivir'), v)} />
                  <NumField label="Blood Units"   value={sw.bloodDonation.prev_blood_units}  onChange={v => set(p('sewaGatividhi','bloodDonation','prev_blood_units'), v)} />
                </>}
                currFields={<>
                  <NumField label="Eye Sankalp"   value={sw.bloodDonation.curr_eye_sankalp}  onChange={v => set(p('sewaGatividhi','bloodDonation','curr_eye_sankalp'), v)} />
                  <NumField label="Eye Pairs"     value={sw.bloodDonation.curr_eye_pairs}    onChange={v => set(p('sewaGatividhi','bloodDonation','curr_eye_pairs'), v)} />
                  <NumField label="Blood Shivir"  value={sw.bloodDonation.curr_blood_shivir} onChange={v => set(p('sewaGatividhi','bloodDonation','curr_blood_shivir'), v)} />
                  <NumField label="Blood Units"   value={sw.bloodDonation.curr_blood_units}  onChange={v => set(p('sewaGatividhi','bloodDonation','curr_blood_units'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Blood Units" value={blood_cum}                                                        color="#E74C3C" />
                  <AutoBadge label="Cumulative Eye Pairs"   value={sw.bloodDonation.prev_eye_pairs + sw.bloodDonation.curr_eye_pairs} color="#9B59B6" />
                </>}
              />

              <PCR label="Divyang Sahayta Punrvas"
                prevFields={<>
                  <NumField label="No. of Shivir"    value={sw.divyangSahayta.prev_shivir}           onChange={v => set(p('sewaGatividhi','divyangSahayta','prev_shivir'), v)} />
                  <NumField label="Artificial Limbs" value={sw.divyangSahayta.prev_artificial_limbs} onChange={v => set(p('sewaGatividhi','divyangSahayta','prev_artificial_limbs'), v)} />
                  <NumField label="Beneficiary"      value={sw.divyangSahayta.prev_beneficiary}      onChange={v => set(p('sewaGatividhi','divyangSahayta','prev_beneficiary'), v)} />
                </>}
                currFields={<>
                  <NumField label="No. of Shivir"    value={sw.divyangSahayta.curr_shivir}           onChange={v => set(p('sewaGatividhi','divyangSahayta','curr_shivir'), v)} />
                  <NumField label="Artificial Limbs" value={sw.divyangSahayta.curr_artificial_limbs} onChange={v => set(p('sewaGatividhi','divyangSahayta','curr_artificial_limbs'), v)} />
                  <NumField label="Beneficiary"      value={sw.divyangSahayta.curr_beneficiary}      onChange={v => set(p('sewaGatividhi','divyangSahayta','curr_beneficiary'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Beneficiary" value={sw.divyangSahayta.prev_beneficiary + sw.divyangSahayta.curr_beneficiary} />
                  <AutoBadge label="Total Limbs Provided"   value={sw.divyangSahayta.prev_artificial_limbs + sw.divyangSahayta.curr_artificial_limbs} color="#2ECC71" />
                </>}
              />

              <PCR label="Vanvasi & Other Sahayta"
                prevFields={<>
                  <NumField label="Central Amount (₹)" value={sw.vanvasiSahayta.prev_central} onChange={v => set(p('sewaGatividhi','vanvasiSahayta','prev_central'), v)} />
                  <NumField label="Local Amount (₹)"   value={sw.vanvasiSahayta.prev_local}   onChange={v => set(p('sewaGatividhi','vanvasiSahayta','prev_local'), v)} />
                  <NumField label="Total Amount"        value={van_prev_total} readOnly highlight />
                </>}
                currFields={<>
                  <NumField label="Central Amount (₹)" value={sw.vanvasiSahayta.curr_central} onChange={v => set(p('sewaGatividhi','vanvasiSahayta','curr_central'), v)} />
                  <NumField label="Local Amount (₹)"   value={sw.vanvasiSahayta.curr_local}   onChange={v => set(p('sewaGatividhi','vanvasiSahayta','curr_local'), v)} />
                  <NumField label="Total Amount"        value={van_curr_total} readOnly highlight />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Total" value={`₹${(van_prev_total + van_curr_total).toLocaleString()}`} color="#D4AF37" />
                  <PctBadge  label="Local Fund %"    part={sw.vanvasiSahayta.curr_local}   total={van_curr_total} />
                  <PctBadge  label="Central Fund %"  part={sw.vanvasiSahayta.curr_central} total={van_curr_total} />
                </>}
              />

              <PCR label="Gram Vikas"
                prevFields={<>
                  <NumField label="No. of Activities" value={sw.gramVikas.prev_activities} onChange={v => set(p('sewaGatividhi','gramVikas','prev_activities'), v)} />
                  <NumField label="Amount (₹)"         value={sw.gramVikas.prev_amount}     onChange={v => set(p('sewaGatividhi','gramVikas','prev_amount'), v)} />
                  <NumField label="Beneficiary"        value={sw.gramVikas.prev_beneficiary}onChange={v => set(p('sewaGatividhi','gramVikas','prev_beneficiary'), v)} />
                </>}
                currFields={<>
                  <NumField label="No. of Activities" value={sw.gramVikas.curr_activities} onChange={v => set(p('sewaGatividhi','gramVikas','curr_activities'), v)} />
                  <NumField label="Amount (₹)"         value={sw.gramVikas.curr_amount}     onChange={v => set(p('sewaGatividhi','gramVikas','curr_amount'), v)} />
                  <NumField label="Beneficiary"        value={sw.gramVikas.curr_beneficiary}onChange={v => set(p('sewaGatividhi','gramVikas','curr_beneficiary'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Beneficiary" value={sw.gramVikas.prev_beneficiary + sw.gramVikas.curr_beneficiary} />
                  <AutoBadge label="Avg ₹ / Beneficiary"   value={sw.gramVikas.curr_beneficiary > 0 ? `₹${Math.round(sw.gramVikas.curr_amount / sw.gramVikas.curr_beneficiary).toLocaleString()}` : '—'} color="#D4AF37" />
                </>}
              />

              <PCR label="Helping Needy Projects"
                prevFields={<>
                  <NumField label="Schools"              value={sw.helpingNeedy.prev_schools}               onChange={v => set(p('sewaGatividhi','helpingNeedy','prev_schools'), v)} />
                  <NumField label="Stationary Beneficiary" value={sw.helpingNeedy.prev_stationary_beneficiary} onChange={v => set(p('sewaGatividhi','helpingNeedy','prev_stationary_beneficiary'), v)} />
                  <NumField label="Blankets Distributed" value={sw.helpingNeedy.prev_blankets}              onChange={v => set(p('sewaGatividhi','helpingNeedy','prev_blankets'), v)} />
                  <NumField label="Food Distributed"     value={sw.helpingNeedy.prev_food}                  onChange={v => set(p('sewaGatividhi','helpingNeedy','prev_food'), v)} />
                </>}
                currFields={<>
                  <NumField label="Schools"              value={sw.helpingNeedy.curr_schools}               onChange={v => set(p('sewaGatividhi','helpingNeedy','curr_schools'), v)} />
                  <NumField label="Stationary Beneficiary" value={sw.helpingNeedy.curr_stationary_beneficiary} onChange={v => set(p('sewaGatividhi','helpingNeedy','curr_stationary_beneficiary'), v)} />
                  <NumField label="Blankets Distributed" value={sw.helpingNeedy.curr_blankets}              onChange={v => set(p('sewaGatividhi','helpingNeedy','curr_blankets'), v)} />
                  <NumField label="Food Distributed"     value={sw.helpingNeedy.curr_food}                  onChange={v => set(p('sewaGatividhi','helpingNeedy','curr_food'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Stationary"  value={sw.helpingNeedy.prev_stationary_beneficiary + sw.helpingNeedy.curr_stationary_beneficiary} />
                  <AutoBadge label="Total Blankets"    value={sw.helpingNeedy.prev_blankets + sw.helpingNeedy.curr_blankets} color="#3498DB" />
                  <AutoBadge label="Total Food Distrib." value={sw.helpingNeedy.prev_food + sw.helpingNeedy.curr_food}      color="#2ECC71" />
                </>}
              />
            </SectionCard>
          )}

          {/* ─── 5. ENVIRONMENT ──────────────────────────────────────── */}
          {activeTab === 'environment' && (
            <SectionCard title="Environment Gatividhi" icon="🌳">
              <PCR label="Tree Plantation & Eco Drives"
                prevFields={<>
                  <NumField label="Trees Planted"     value={ev.treePlantation_prev} onChange={v => set('environmentGatividhi.treePlantation_prev', v)} />
                  <NumField label="Tulsi Podha"       value={ev.tulsiPodha_prev}     onChange={v => set('environmentGatividhi.tulsiPodha_prev', v)} />
                  <NumField label="Cloth Carry Bags"  value={ev.clothBags_prev}      onChange={v => set('environmentGatividhi.clothBags_prev', v)} />
                  <NumField label="Seminars"          value={ev.seminars_prev}        onChange={v => set('environmentGatividhi.seminars_prev', v)} />
                  <NumField label="Seminar Presence"  value={ev.seminar_presence_prev}onChange={v => set('environmentGatividhi.seminar_presence_prev', v)} />
                </>}
                currFields={<>
                  <NumField label="Trees Planted"     value={ev.treePlantation_curr} onChange={v => set('environmentGatividhi.treePlantation_curr', v)} />
                  <NumField label="Tulsi Podha"       value={ev.tulsiPodha_curr}     onChange={v => set('environmentGatividhi.tulsiPodha_curr', v)} />
                  <NumField label="Cloth Carry Bags"  value={ev.clothBags_curr}      onChange={v => set('environmentGatividhi.clothBags_curr', v)} />
                  <NumField label="Seminars"          value={ev.seminars_curr}        onChange={v => set('environmentGatividhi.seminars_curr', v)} />
                  <NumField label="Seminar Presence"  value={ev.seminar_presence_curr}onChange={v => set('environmentGatividhi.seminar_presence_curr', v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Trees"    value={ev.treePlantation_prev + ev.treePlantation_curr} color="#27AE60" />
                  <AutoBadge label="Cumulative Tulsi"    value={ev.tulsiPodha_prev + ev.tulsiPodha_curr}         color="#2ECC71" />
                  <AutoBadge label="Cumulative Bags"     value={ev.clothBags_prev + ev.clothBags_curr}           color="#3498DB" />
                  <PctBadge  label="Avg Attendance/Seminar" part={ev.seminar_presence_curr} total={ev.seminars_curr || 1} />
                </>}
              />
              <PCR label="Animal Sewa (Jeevdaya)"
                prevFields={<>
                  <NumField label="Parinda (Bird Feeders)" value={ev.parinda_prev} onChange={v => set('environmentGatividhi.parinda_prev', v)} />
                  <NumField label="Kundi"                  value={ev.kundi_prev}   onChange={v => set('environmentGatividhi.kundi_prev', v)} />
                  <NumField label="Chara (Qty)"            value={ev.chara_prev}   onChange={v => set('environmentGatividhi.chara_prev', v)} />
                </>}
                currFields={<>
                  <NumField label="Parinda (Bird Feeders)" value={ev.parinda_curr} onChange={v => set('environmentGatividhi.parinda_curr', v)} />
                  <NumField label="Kundi"                  value={ev.kundi_curr}   onChange={v => set('environmentGatividhi.kundi_curr', v)} />
                  <NumField label="Chara (Qty)"            value={ev.chara_curr}   onChange={v => set('environmentGatividhi.chara_curr', v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Parinda" value={ev.parinda_prev + ev.parinda_curr} color="#F39C12" />
                  <AutoBadge label="Total Kundi"   value={ev.kundi_prev + ev.kundi_curr}     color="#E67E22" />
                </>}
              />
            </SectionCard>
          )}

          {/* ─── 6. MAHILA ───────────────────────────────────────────── */}
          {activeTab === 'mahila' && (
            <SectionCard title="Mahila Sahbhagita Gatividhi" icon="👩">

              <PCR label="Beti Padhao Beti Apnao"
                prevFields={<>
                  <NumField label="Programmes"  value={mh.betiPadhao.prev_programmes}  onChange={v => set(p('mahilaSahbhagita','betiPadhao','prev_programmes'), v)} />
                  <NumField label="Participants" value={mh.betiPadhao.prev_participants} onChange={v => set(p('mahilaSahbhagita','betiPadhao','prev_participants'), v)} />
                </>}
                currFields={<>
                  <NumField label="Programmes"  value={mh.betiPadhao.curr_programmes}  onChange={v => set(p('mahilaSahbhagita','betiPadhao','curr_programmes'), v)} />
                  <NumField label="Participants" value={mh.betiPadhao.curr_participants} onChange={v => set(p('mahilaSahbhagita','betiPadhao','curr_participants'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Participants" value={mh.betiPadhao.prev_participants + mh.betiPadhao.curr_participants} />
                  <AutoBadge label="Avg per Programme" value={mh.betiPadhao.curr_programmes > 0 ? Math.round(mh.betiPadhao.curr_participants / mh.betiPadhao.curr_programmes) : '—'} color="#1B2A3B" />
                </>}
              />

              <PCR label="Anemia Mukt Bharat"
                prevFields={<>
                  <NumField label="Shivir"              value={mh.anemiaMukt.prev_shivir}      onChange={v => set(p('mahilaSahbhagita','anemiaMukt','prev_shivir'), v)} />
                  <NumField label="Total Tests Done"    value={mh.anemiaMukt.prev_total_test}  onChange={v => set(p('mahilaSahbhagita','anemiaMukt','prev_total_test'), v)} />
                  <NumField label="Anemic Cases Found"  value={mh.anemiaMukt.prev_anemic}      onChange={v => set(p('mahilaSahbhagita','anemiaMukt','prev_anemic'), v)} />
                  <NumField label="Anemia Mukt (Cured)" value={mh.anemiaMukt.prev_anemia_mukt} onChange={v => set(p('mahilaSahbhagita','anemiaMukt','prev_anemia_mukt'), v)} />
                </>}
                currFields={<>
                  <NumField label="Shivir"              value={mh.anemiaMukt.curr_shivir}      onChange={v => set(p('mahilaSahbhagita','anemiaMukt','curr_shivir'), v)} />
                  <NumField label="Total Tests Done"    value={mh.anemiaMukt.curr_total_test}  onChange={v => set(p('mahilaSahbhagita','anemiaMukt','curr_total_test'), v)} />
                  <NumField label="Anemic Cases Found"  value={mh.anemiaMukt.curr_anemic}      onChange={v => set(p('mahilaSahbhagita','anemiaMukt','curr_anemic'), v)} />
                  <NumField label="Anemia Mukt (Cured)" value={mh.anemiaMukt.curr_anemia_mukt} onChange={v => set(p('mahilaSahbhagita','anemiaMukt','curr_anemia_mukt'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Tests"   value={anemia_cum_tests} />
                  <AutoBadge label="Cumulative Anemic"  value={anemia_cum_anemic} color="#E74C3C" />
                  <PctBadge  label="Anemia Prevalence %" part={mh.anemiaMukt.curr_anemic}      total={mh.anemiaMukt.curr_total_test} />
                  <PctBadge  label="Cure Rate %"          part={mh.anemiaMukt.curr_anemia_mukt} total={mh.anemiaMukt.curr_anemic || 1} />
                </>}
              />

              <PCR label="Atmnirbhar Bharat — Sewing & Beautician Centres"
                prevFields={<>
                  <NumField label="Sewing Centers"       value={mh.atmnirbhar.prev_sewing_centers}     onChange={v => set(p('mahilaSahbhagita','atmnirbhar','prev_sewing_centers'), v)} />
                  <NumField label="Sewing Beneficiary"   value={mh.atmnirbhar.prev_sewing_beneficiary} onChange={v => set(p('mahilaSahbhagita','atmnirbhar','prev_sewing_beneficiary'), v)} />
                  <NumField label="Machines Distributed" value={mh.atmnirbhar.prev_machines}           onChange={v => set(p('mahilaSahbhagita','atmnirbhar','prev_machines'), v)} />
                  <NumField label="Beautician Centers"   value={mh.atmnirbhar.prev_beauty_centers}     onChange={v => set(p('mahilaSahbhagita','atmnirbhar','prev_beauty_centers'), v)} />
                  <NumField label="Beautician Beneficiary" value={mh.atmnirbhar.prev_beauty_beneficiary} onChange={v => set(p('mahilaSahbhagita','atmnirbhar','prev_beauty_beneficiary'), v)} />
                </>}
                currFields={<>
                  <NumField label="Sewing Centers"       value={mh.atmnirbhar.curr_sewing_centers}     onChange={v => set(p('mahilaSahbhagita','atmnirbhar','curr_sewing_centers'), v)} />
                  <NumField label="Sewing Beneficiary"   value={mh.atmnirbhar.curr_sewing_beneficiary} onChange={v => set(p('mahilaSahbhagita','atmnirbhar','curr_sewing_beneficiary'), v)} />
                  <NumField label="Machines Distributed" value={mh.atmnirbhar.curr_machines}           onChange={v => set(p('mahilaSahbhagita','atmnirbhar','curr_machines'), v)} />
                  <NumField label="Beautician Centers"   value={mh.atmnirbhar.curr_beauty_centers}     onChange={v => set(p('mahilaSahbhagita','atmnirbhar','curr_beauty_centers'), v)} />
                  <NumField label="Beautician Beneficiary" value={mh.atmnirbhar.curr_beauty_beneficiary} onChange={v => set(p('mahilaSahbhagita','atmnirbhar','curr_beauty_beneficiary'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Sewing Beneficiary"  value={mh.atmnirbhar.prev_sewing_beneficiary + mh.atmnirbhar.curr_sewing_beneficiary} />
                  <AutoBadge label="Total Beauty Beneficiary"  value={mh.atmnirbhar.prev_beauty_beneficiary + mh.atmnirbhar.curr_beauty_beneficiary} color="#9B59B6" />
                  <AutoBadge label="Total Machines Distributed" value={mh.atmnirbhar.prev_machines + mh.atmnirbhar.curr_machines}                    color="#D4AF37" />
                </>}
              />

              <PCR label="Baal Sanskar"
                prevFields={<>
                  <NumField label="Shivir Duration (days)" value={mh.baalSanskar.prev_shivir_duration} onChange={v => set(p('mahilaSahbhagita','baalSanskar','prev_shivir_duration'), v)} />
                  <NumField label="No. of Activities"      value={mh.baalSanskar.prev_activities}      onChange={v => set(p('mahilaSahbhagita','baalSanskar','prev_activities'), v)} />
                  <NumField label="Presence"               value={mh.baalSanskar.prev_presence}        onChange={v => set(p('mahilaSahbhagita','baalSanskar','prev_presence'), v)} />
                </>}
                currFields={<>
                  <NumField label="Shivir Duration (days)" value={mh.baalSanskar.curr_shivir_duration} onChange={v => set(p('mahilaSahbhagita','baalSanskar','curr_shivir_duration'), v)} />
                  <NumField label="No. of Activities"      value={mh.baalSanskar.curr_activities}      onChange={v => set(p('mahilaSahbhagita','baalSanskar','curr_activities'), v)} />
                  <NumField label="Presence"               value={mh.baalSanskar.curr_presence}        onChange={v => set(p('mahilaSahbhagita','baalSanskar','curr_presence'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Presence"  value={mh.baalSanskar.prev_presence + mh.baalSanskar.curr_presence} />
                  <AutoBadge label="Avg/Activity"    value={mh.baalSanskar.curr_activities > 0 ? Math.round(mh.baalSanskar.curr_presence / mh.baalSanskar.curr_activities) : '—'} color="#1B2A3B" />
                </>}
              />

              <PCR label="Adoption Projects — Family & Girl Child"
                prevFields={<>
                  <NumField label="Families Adopted"      value={mh.familyAdoption.prev_families}          onChange={v => set(p('mahilaSahbhagita','familyAdoption','prev_families'), v)} />
                  <NumField label="Family Beneficiary"    value={mh.familyAdoption.prev_family_beneficiary} onChange={v => set(p('mahilaSahbhagita','familyAdoption','prev_family_beneficiary'), v)} />
                  <NumField label="Family Amount (₹)"     value={mh.familyAdoption.prev_family_amount}      onChange={v => set(p('mahilaSahbhagita','familyAdoption','prev_family_amount'), v)} />
                  <NumField label="Girl Child Beneficiary" value={mh.familyAdoption.prev_girl_beneficiary}  onChange={v => set(p('mahilaSahbhagita','familyAdoption','prev_girl_beneficiary'), v)} />
                  <NumField label="Girl Child Amount (₹)" value={mh.familyAdoption.prev_girl_amount}        onChange={v => set(p('mahilaSahbhagita','familyAdoption','prev_girl_amount'), v)} />
                </>}
                currFields={<>
                  <NumField label="Families Adopted"      value={mh.familyAdoption.curr_families}          onChange={v => set(p('mahilaSahbhagita','familyAdoption','curr_families'), v)} />
                  <NumField label="Family Beneficiary"    value={mh.familyAdoption.curr_family_beneficiary} onChange={v => set(p('mahilaSahbhagita','familyAdoption','curr_family_beneficiary'), v)} />
                  <NumField label="Family Amount (₹)"     value={mh.familyAdoption.curr_family_amount}      onChange={v => set(p('mahilaSahbhagita','familyAdoption','curr_family_amount'), v)} />
                  <NumField label="Girl Child Beneficiary" value={mh.familyAdoption.curr_girl_beneficiary}  onChange={v => set(p('mahilaSahbhagita','familyAdoption','curr_girl_beneficiary'), v)} />
                  <NumField label="Girl Child Amount (₹)" value={mh.familyAdoption.curr_girl_amount}        onChange={v => set(p('mahilaSahbhagita','familyAdoption','curr_girl_amount'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Families"      value={mh.familyAdoption.prev_families + mh.familyAdoption.curr_families} />
                  <AutoBadge label="Total Family Spend"  value={`₹${(mh.familyAdoption.prev_family_amount + mh.familyAdoption.curr_family_amount).toLocaleString()}`} color="#D4AF37" />
                  <AutoBadge label="Total Girl Support"  value={`₹${(mh.familyAdoption.prev_girl_amount + mh.familyAdoption.curr_girl_amount).toLocaleString()}`}   color="#E74C3C" />
                </>}
              />
            </SectionCard>
          )}

          {/* ─── 7. SAMPARK ──────────────────────────────────────────── */}
          {activeTab === 'sampark' && (
            <SectionCard title="Sampark Gatividhi" icon="🤝">
              {[
                ['Sanskriti Saptah','sankritSaptah',['programmes','participants']],
                ['BVP Sthapna Diwas','bvpSthapnaDiwas',['programmes','participants']],
                ['Vichar Gosthi','vichargosthi',['programmes','participants']],
              ].map(([label, key, fields]) => (
                <PCR key={key} label={label}
                  prevFields={fields.map(f => <NumField key={f} label={f.charAt(0).toUpperCase()+f.slice(1)} value={sp[key][`prev_${f}`]} onChange={v => set(p('samparkGatividhi',key,`prev_${f}`), v)} />)}
                  currFields={fields.map(f => <NumField key={f} label={f.charAt(0).toUpperCase()+f.slice(1)} value={sp[key][`curr_${f}`]} onChange={v => set(p('samparkGatividhi',key,`curr_${f}`), v)} />)}
                  autoFields={<>
                    <AutoBadge label="Cumulative Participants" value={sp[key][`prev_${fields[1]}`] + sp[key][`curr_${fields[1]}`]} />
                    <AutoBadge label="Avg / Programme" value={sp[key][`curr_${fields[0]}`] > 0 ? Math.round(sp[key][`curr_${fields[1]}`] / sp[key][`curr_${fields[0]}`]) : '—'} color="#1B2A3B" />
                  </>}
                />
              ))}

              <PCR label="Samuhik Saral Vivah"
                prevFields={<>
                  <NumField label="No. of Vivah" value={sp.samuhikVivah.prev_vivah} onChange={v => set(p('samparkGatividhi','samuhikVivah','prev_vivah'), v)} />
                  <NumField label="Pairs"         value={sp.samuhikVivah.prev_pairs} onChange={v => set(p('samparkGatividhi','samuhikVivah','prev_pairs'), v)} />
                </>}
                currFields={<>
                  <NumField label="No. of Vivah" value={sp.samuhikVivah.curr_vivah} onChange={v => set(p('samparkGatividhi','samuhikVivah','curr_vivah'), v)} />
                  <NumField label="Pairs"         value={sp.samuhikVivah.curr_pairs} onChange={v => set(p('samparkGatividhi','samuhikVivah','curr_pairs'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Vivah" value={sp.samuhikVivah.prev_vivah + sp.samuhikVivah.curr_vivah} />
                  <AutoBadge label="Total Pairs" value={sp.samuhikVivah.prev_pairs + sp.samuhikVivah.curr_pairs} color="#D4AF37" />
                </>}
              />

              <PCR label="Nav Varsh & Inspiring Events"
                prevFields={<>
                  <NumField label="Programmes"      value={sp.navVarsh.prev_programmes} onChange={v => set(p('samparkGatividhi','navVarsh','prev_programmes'), v)} />
                  <NumField label="No. of Activities" value={sp.navVarsh.prev_activities} onChange={v => set(p('samparkGatividhi','navVarsh','prev_activities'), v)} />
                  <NumField label="Presence"          value={sp.navVarsh.prev_presence}   onChange={v => set(p('samparkGatividhi','navVarsh','prev_presence'), v)} />
                </>}
                currFields={<>
                  <NumField label="Programmes"      value={sp.navVarsh.curr_programmes} onChange={v => set(p('samparkGatividhi','navVarsh','curr_programmes'), v)} />
                  <NumField label="No. of Activities" value={sp.navVarsh.curr_activities} onChange={v => set(p('samparkGatividhi','navVarsh','curr_activities'), v)} />
                  <NumField label="Presence"          value={sp.navVarsh.curr_presence}   onChange={v => set(p('samparkGatividhi','navVarsh','curr_presence'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Cumulative Presence" value={sp.navVarsh.prev_presence + sp.navVarsh.curr_presence} />
                  <PctBadge  label="Avg Attendance/Activity" part={sp.navVarsh.curr_presence} total={sp.navVarsh.curr_activities || 1} />
                </>}
              />

              <PCR label="Ek Shakha Ek Gaon"
                prevFields={<>
                  <NumField label="Programmes"    value={sp.ekShakha.prev_programmes}   onChange={v => set(p('samparkGatividhi','ekShakha','prev_programmes'), v)} />
                  <NumField label="Beneficiaries" value={sp.ekShakha.prev_beneficiaries}onChange={v => set(p('samparkGatividhi','ekShakha','prev_beneficiaries'), v)} />
                  <NumField label="Amount (₹)"    value={sp.ekShakha.prev_amount}       onChange={v => set(p('samparkGatividhi','ekShakha','prev_amount'), v)} />
                </>}
                currFields={<>
                  <NumField label="Programmes"    value={sp.ekShakha.curr_programmes}   onChange={v => set(p('samparkGatividhi','ekShakha','curr_programmes'), v)} />
                  <NumField label="Beneficiaries" value={sp.ekShakha.curr_beneficiaries}onChange={v => set(p('samparkGatividhi','ekShakha','curr_beneficiaries'), v)} />
                  <NumField label="Amount (₹)"    value={sp.ekShakha.curr_amount}       onChange={v => set(p('samparkGatividhi','ekShakha','curr_amount'), v)} />
                </>}
                autoFields={<>
                  <AutoBadge label="Total Beneficiaries" value={sp.ekShakha.prev_beneficiaries + sp.ekShakha.curr_beneficiaries} />
                  <AutoBadge label="Total Amount" value={`₹${(sp.ekShakha.prev_amount + sp.ekShakha.curr_amount).toLocaleString()}`} color="#D4AF37" />
                </>}
              />
            </SectionCard>
          )}

          {/* ─── 8. PERMANENT SEWA ───────────────────────────────────── */}
          {activeTab === 'permanent' && (
            <SectionCard title="Permanent Sewa Gatividhi / Projects" icon="🏥">
              <div className="perm-sewa-list">
                {form.permanentSewa.map((row, i) => (
                  <div className="perm-sewa-row" key={i}>
                    <div className="perm-service-field">
                      <label className="field-label">Service Name</label>
                      <input className="text-input" value={row.service}
                        onChange={e => { const u=[...form.permanentSewa]; u[i]={...u[i],service:e.target.value}; set('permanentSewa', u); }}
                        placeholder="e.g. Physiotherapy" />
                    </div>
                    <div className="perm-grid">
                      <NumField label="Prev Projects"    value={row.prev_projects}    onChange={v => { const u=[...form.permanentSewa]; u[i]={...u[i],prev_projects:v};    set('permanentSewa',u); }} />
                      <NumField label="Prev Beneficiary" value={row.prev_beneficiary} onChange={v => { const u=[...form.permanentSewa]; u[i]={...u[i],prev_beneficiary:v}; set('permanentSewa',u); }} />
                      <NumField label="Prev Est. Cost"   value={row.prev_cost}        onChange={v => { const u=[...form.permanentSewa]; u[i]={...u[i],prev_cost:v};        set('permanentSewa',u); }} />
                      <NumField label="Curr Projects"    value={row.curr_projects}    onChange={v => { const u=[...form.permanentSewa]; u[i]={...u[i],curr_projects:v};    set('permanentSewa',u); }} />
                      <NumField label="Curr Beneficiary" value={row.curr_beneficiary} onChange={v => { const u=[...form.permanentSewa]; u[i]={...u[i],curr_beneficiary:v}; set('permanentSewa',u); }} highlight />
                      <NumField label="Curr Est. Cost"   value={row.curr_cost}        onChange={v => { const u=[...form.permanentSewa]; u[i]={...u[i],curr_cost:v};        set('permanentSewa',u); }} />
                    </div>
                    <div className="perm-auto">
                      <AutoBadge label="Total Beneficiary" value={row.prev_beneficiary + row.curr_beneficiary} />
                      <AutoBadge label="Total Cost (₹)"    value={`₹${(row.prev_cost + row.curr_cost).toLocaleString()}`} color="#D4AF37" />
                      <AutoBadge label="Cost/Beneficiary"  value={(row.prev_beneficiary + row.curr_beneficiary) > 0 ? `₹${Math.round((row.prev_cost + row.curr_cost) / (row.prev_beneficiary + row.curr_beneficiary)).toLocaleString()}` : '—'} color="#1B2A3B" />
                    </div>
                  </div>
                ))}
              </div>
              <button className="add-more-btn" onClick={() => set('permanentSewa', [...form.permanentSewa, { service:'', prev_projects:0, prev_beneficiary:0, prev_cost:0, curr_projects:0, curr_beneficiary:0, curr_cost:0 }])}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Another Service
              </button>
            </SectionCard>
          )}

          {/* ─── 9. MEETINGS ─────────────────────────────────────────── */}
          {activeTab === 'meetings' && (
            <SectionCard title="Meetings — Sangathan" icon="📅">
              {[
                { type:'executive',   label:'Executive Committee Meetings' },
                { type:'generalBody', label:'General Body Meetings' },
                { type:'workingGroup',label:'Working Group Meetings' },
              ].map(({ type, label }) => (
                <div key={type} className="meeting-section">
                  <div className="subsection-title">{label}</div>
                  <div className="auto-badges-row" style={{marginBottom:'12px'}}>
                    <AutoBadge label="Total Meetings"    value={form.meetings[type].length} />
                    <AutoBadge label="Total Participants" value={form.meetings[type].reduce((s,m) => s+(m.participants||0), 0)} color="#D4AF37" />
                    <AutoBadge label="Avg / Meeting"     value={form.meetings[type].length > 0 ? Math.round(form.meetings[type].reduce((s,m) => s+(m.participants||0), 0) / form.meetings[type].length) : '—'} color="#1B2A3B" />
                  </div>
                  {form.meetings[type].map((m, i) => (
                    <div className="meeting-row" key={i}>
                      <div className="field-group" style={{flex:1}}>
                        <label className="field-label">Date</label>
                        <input type="date" className="text-input" value={m.date}
                          onChange={e => { const u=JSON.parse(JSON.stringify(form.meetings)); u[type][i].date=e.target.value; set('meetings',u); }} />
                      </div>
                      <NumField label="Participants" value={m.participants}
                        onChange={v => { const u=JSON.parse(JSON.stringify(form.meetings)); u[type][i].participants=v; set('meetings',u); }} />
                      {form.meetings[type].length > 1 && (
                        <button className="remove-btn" onClick={() => { const u=JSON.parse(JSON.stringify(form.meetings)); u[type].splice(i,1); set('meetings',u); }}>✕</button>
                      )}
                    </div>
                  ))}
                  <button className="add-more-btn small" onClick={() => { const u=JSON.parse(JSON.stringify(form.meetings)); u[type].push({...defaultMeeting}); set('meetings',u); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Meeting
                  </button>
                </div>
              ))}
            </SectionCard>
          )}

          <div className="form-nav">
            <button className="nav-prev-btn" onClick={prevTab} disabled={activeTab === TABS[0].id}>← Previous</button>
            {activeTab !== TABS[TABS.length-1].id
              ? <button className="nav-next-btn" onClick={nextTab}>Next →</button>
              : <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <span className="spinner"></span> : <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Submit Report
                  </>}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}