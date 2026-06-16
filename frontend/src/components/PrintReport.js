import React from 'react';
import '../pages/DataEntryPage.css';

const MONTHS = ['April','May','June','July','August','September','October','November','December','January','February','March'];

function getPrevMonth(month) {
  const idx = MONTHS.indexOf(month);
  if (idx <= 0) return 'Upto March';
  return `Upto ${MONTHS[idx - 1]}`;
}

function PrintCombinedTable({ tables, prevLabel, currMonth }) {
  const GROUP_COLS = 5;
  return (
    <table className="print-table print-table-fixed">
      <colgroup>
        <col style={{ width: '15%' }} />
        {Array.from({ length: GROUP_COLS * 3 }).map((_, i) => (
          <col key={i} style={{ width: `${85 / (GROUP_COLS * 3)}%` }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th className="print-th print-th-label">Projects</th>
          <th className="print-th print-th-prev" colSpan={GROUP_COLS}>{prevLabel}</th>
          <th className="print-th print-th-curr" colSpan={GROUP_COLS}>{currMonth}</th>
          <th className="print-th print-th-total" colSpan={GROUP_COLS}>Cumulative Total</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table, ti) => {
          const sc = table.subCols || ['Value'];
          const pad = GROUP_COLS - sc.length;
          return (
            <React.Fragment key={ti}>
              <tr className="print-tr-subheader">
                <td className="print-td print-td-label print-td-project">{table.title}</td>
                {[0,1,2].map(g => {
                  const groupClass = g === 0 ? ' print-td-prev' : g === 1 ? ' print-td-curr' : ' print-td-total';
                  return (
                    <React.Fragment key={g}>
                      {sc.map((c, i) => {
                        const isLast = i === sc.length - 1 && pad > 0;
                        return (
                          <td key={`${g}-${i}`}
                            className={`print-td print-td-subhdr${groupClass}`}
                            colSpan={isLast ? pad + 1 : undefined}
                          >{c}</td>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tr>
              {table.projects.map((proj, pi) => (
                <tr key={`d${ti}-${pi}`}>
                  <td className="print-td print-td-label">{table.projects.length > 1 ? proj.label : ''}</td>
                  {proj.prev.map((v, i) => {
                    const isLast = i === proj.prev.length - 1 && pad > 0;
                    return <td key={`p${i}`} className="print-td print-td-prev" colSpan={isLast ? pad + 1 : undefined}>{typeof v === 'number' ? v.toLocaleString() : v}</td>;
                  })}
                  {proj.curr.map((v, i) => {
                    const isLast = i === proj.curr.length - 1 && pad > 0;
                    return <td key={`c${i}`} className="print-td print-td-curr" colSpan={isLast ? pad + 1 : undefined}>{typeof v === 'number' ? v.toLocaleString() : v}</td>;
                  })}
                  {proj.total.map((v, i) => {
                    const isLast = i === proj.total.length - 1 && pad > 0;
                    return <td key={`t${i}`} className="print-td print-td-total" colSpan={isLast ? pad + 1 : undefined}>{typeof v === 'number' ? v.toLocaleString() : v}</td>;
                  })}
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

function buildPrintData(form) {
  const sg = form.sanskarGatividhi || {};
  const sw = form.sewaGatividhi || {};
  const ev = form.environmentGatividhi || {};
  const mh = form.mahilaSahbhagita || {};
  const sp = form.samparkGatividhi || {};

  const safe = (obj, ...keys) => {
    const o = obj || {};
    return keys.map(k => o[k] || 0);
  };

  const mkRow = (label, prevArr, currArr) => ({
    label, prev: prevArr, curr: currArr,
    total: prevArr.map((v, i) => (typeof v === 'number' && typeof currArr[i] === 'number') ? v + currArr[i] : ''),
  });

  const sections = [];

  // 2. Sanskar Gatividhi
  const nsgc = sg.nsgc || {};
  const bkj = sg.bharatKoJano || {};
  const gvca = sg.gvca || {};
  const ic = sg.interCollege || {};
  const ys = sg.yuvaSanskar || {};

  sections.push({ number: 2, title: 'Sanskar Gatividhi', tables: [
    { title: 'NGSC', subCols: ['Schools','Boys','Girls','Vadak','Total Presence'], projects: [
      { label: 'NGSC',
        prev: [nsgc.prev_schools||0, nsgc.prev_boys||0, nsgc.prev_girls||0, nsgc.prev_vadak||0, (nsgc.prev_boys||0)+(nsgc.prev_girls||0)+(nsgc.prev_vadak||0)],
        curr: [nsgc.curr_schools||0, nsgc.curr_boys||0, nsgc.curr_girls||0, nsgc.curr_vadak||0, (nsgc.curr_boys||0)+(nsgc.curr_girls||0)+(nsgc.curr_vadak||0)],
        total: [(nsgc.prev_schools||0)+(nsgc.curr_schools||0), (nsgc.prev_boys||0)+(nsgc.curr_boys||0), (nsgc.prev_girls||0)+(nsgc.curr_girls||0), (nsgc.prev_vadak||0)+(nsgc.curr_vadak||0), (nsgc.prev_boys||0)+(nsgc.prev_girls||0)+(nsgc.prev_vadak||0)+(nsgc.curr_boys||0)+(nsgc.curr_girls||0)+(nsgc.curr_vadak||0)],
      },
    ]},
    { title: 'Bharat Ko Jano (Written Exam)', subCols: ['Schools','Students (Jr)','Students (Sr)','Total Students','Books'], projects: [
      { label: 'Bharat Ko Jano',
        prev: [bkj.prev_schools||0, bkj.prev_students_jr||0, bkj.prev_students_sr||0, (bkj.prev_students_jr||0)+(bkj.prev_students_sr||0), bkj.prev_books||0],
        curr: [bkj.curr_schools||0, bkj.curr_students_jr||0, bkj.curr_students_sr||0, (bkj.curr_students_jr||0)+(bkj.curr_students_sr||0), bkj.curr_books||0],
        total: [(bkj.prev_schools||0)+(bkj.curr_schools||0), (bkj.prev_students_jr||0)+(bkj.curr_students_jr||0), (bkj.prev_students_sr||0)+(bkj.curr_students_sr||0), (bkj.prev_students_jr||0)+(bkj.prev_students_sr||0)+(bkj.curr_students_jr||0)+(bkj.curr_students_sr||0), (bkj.prev_books||0)+(bkj.curr_books||0)],
      },
    ]},
    { title: 'G.V.C.A', subCols: ['Schools','Students Honoured','Teachers Honoured','Total Students','Total Presence'], projects: [
      { label: 'G.V.C.A',
        prev: [gvca.prev_schools||0, gvca.prev_students_honoured||0, gvca.prev_teachers_honoured||0, (gvca.prev_students_honoured||0)+(gvca.prev_teachers_honoured||0), gvca.prev_total_presence||0],
        curr: [gvca.curr_schools||0, gvca.curr_students_honoured||0, gvca.curr_teachers_honoured||0, (gvca.curr_students_honoured||0)+(gvca.curr_teachers_honoured||0), gvca.curr_total_presence||0],
        total: [(gvca.prev_schools||0)+(gvca.curr_schools||0), (gvca.prev_students_honoured||0)+(gvca.curr_students_honoured||0), (gvca.prev_teachers_honoured||0)+(gvca.curr_teachers_honoured||0), (gvca.prev_students_honoured||0)+(gvca.prev_teachers_honoured||0)+(gvca.curr_students_honoured||0)+(gvca.curr_teachers_honoured||0), (gvca.prev_total_presence||0)+(gvca.curr_total_presence||0)],
      },
    ]},
    { title: 'Inter College', subCols: ['College','Boys','Girls','Total Students','Total Presence'], projects: [
      { label: 'Inter College',
        prev: [ic.prev_colleges||0, ic.prev_boys||0, ic.prev_girls||0, (ic.prev_boys||0)+(ic.prev_girls||0), ic.prev_total_presence||0],
        curr: [ic.curr_colleges||0, ic.curr_boys||0, ic.curr_girls||0, (ic.curr_boys||0)+(ic.curr_girls||0), ic.curr_total_presence||0],
        total: [(ic.prev_colleges||0)+(ic.curr_colleges||0), (ic.prev_boys||0)+(ic.curr_boys||0), (ic.prev_girls||0)+(ic.curr_girls||0), (ic.prev_boys||0)+(ic.prev_girls||0)+(ic.curr_boys||0)+(ic.curr_girls||0), (ic.prev_total_presence||0)+(ic.curr_total_presence||0)],
      },
    ]},
    { title: 'Yuva Sanskar', subCols: ['Shivir Duration','No of Activities','Presence'], projects: [
      mkRow('Yuva Sanskar', safe(ys, 'prev_shivir_duration','prev_activities','prev_presence'), safe(ys, 'curr_shivir_duration','curr_activities','curr_presence')),
    ]},
  ]});

  // 3. Sewa Gatividhi
  const ds = sw.divyangSahayta || {};
  const vs = sw.vanvasiSahayta || {};
  const gv = sw.gramVikas || {};
  const mc = sw.medicalCamp || {};
  const ha = sw.healthAwareness || {};
  const bd = sw.bloodDonation || {};
  const hn = sw.helpingNeedy || {};

  sections.push({ number: 3, title: 'Sewa Gatividhi', tables: [
    { title: 'Divyang Sahayta Punrvas', subCols: ['No. of Shivir','No of Artificial Limbs','Beneficiary'], projects: [
      mkRow('Divyang Sahayta', safe(ds, 'prev_shivir','prev_artificial_limbs','prev_beneficiary'), safe(ds, 'curr_shivir','curr_artificial_limbs','curr_beneficiary')),
    ]},
    { title: 'Vanvasi & Other Sahayta', subCols: ['Central','Local','Total Amount'], projects: [
      { label: 'Vanvasi Sahayta',
        prev: [vs.prev_central||0, vs.prev_local||0, (vs.prev_central||0)+(vs.prev_local||0)],
        curr: [vs.curr_central||0, vs.curr_local||0, (vs.curr_central||0)+(vs.curr_local||0)],
        total: [(vs.prev_central||0)+(vs.curr_central||0), (vs.prev_local||0)+(vs.curr_local||0), (vs.prev_central||0)+(vs.prev_local||0)+(vs.curr_central||0)+(vs.curr_local||0)],
      },
    ]},
    { title: 'Gram Vikas', subCols: ['No of Activities','Amount','Beneficiary'], projects: [
      mkRow('Gram Vikas', safe(gv, 'prev_activities','prev_amount','prev_beneficiary'), safe(gv, 'curr_activities','curr_amount','curr_beneficiary')),
    ]},
    { title: 'Medical Camp', subCols: ['Health Shivir','Health Beneficiary','Eye Shivir','Eye Beneficiary','Operations'], projects: [
      mkRow('Medical Camp', safe(mc, 'prev_health_shivir','prev_health_beneficiary','prev_eye_shivir','prev_eye_beneficiary','prev_operations'), safe(mc, 'curr_health_shivir','curr_health_beneficiary','curr_eye_shivir','curr_eye_beneficiary','curr_operations')),
    ]},
    { title: 'Health Awareness', subCols: ['Yog Shivir','Yog Beneficiary','Nasha Mukti Prog.','Nasha Beneficiary'], projects: [
      mkRow('Health Awareness', safe(ha, 'prev_yog_shivir','prev_yog_beneficiary','prev_nasha_programmes','prev_nasha_beneficiary'), safe(ha, 'curr_yog_shivir','curr_yog_beneficiary','curr_nasha_programmes','curr_nasha_beneficiary')),
    ]},
    { title: 'Human Organ / Blood Donation', subCols: ['Eye Sankalp','Eye Pairs','Blood Shivir','Blood Units'], projects: [
      mkRow('Blood Donation', safe(bd, 'prev_eye_sankalp','prev_eye_pairs','prev_blood_shivir','prev_blood_units'), safe(bd, 'curr_eye_sankalp','curr_eye_pairs','curr_blood_shivir','curr_blood_units')),
    ]},
    { title: 'Helping Needy Projects', subCols: ['Schools','Stationary Beneficiary','Blankets','Food Distribution'], projects: [
      mkRow('Helping Needy', safe(hn, 'prev_schools','prev_stationary_beneficiary','prev_blankets','prev_food'), safe(hn, 'curr_schools','curr_stationary_beneficiary','curr_blankets','curr_food')),
    ]},
  ]});

  // 4. Environment Gatividhi
  sections.push({ number: 4, title: 'Environment Gatividhi', tables: [
    { title: 'Environment', subCols: ['Tree Plantation','Tulsi Podha','Cloth Bags','Seminars','Seminar Presence'], projects: [
      mkRow('Environment', [ev.treePlantation_prev||0, ev.tulsiPodha_prev||0, ev.clothBags_prev||0, ev.seminars_prev||0, ev.seminar_presence_prev||0], [ev.treePlantation_curr||0, ev.tulsiPodha_curr||0, ev.clothBags_curr||0, ev.seminars_curr||0, ev.seminar_presence_curr||0]),
    ]},
    { title: 'Animal Sewa (Jeevdaya)', subCols: ['Parinda','Kundi','Chara','Dana','Others'], projects: [
      mkRow('Animal Sewa', [ev.parinda_prev||0, ev.kundi_prev||0, ev.chara_prev||0, ev.dana_prev||0, ev.others_prev||0], [ev.parinda_curr||0, ev.kundi_curr||0, ev.chara_curr||0, ev.dana_curr||0, ev.others_curr||0]),
    ]},
  ]});

  // 5. Mahila Sahbhagita Gatividhi
  const bp = mh.betiPadhao || {};
  const am = mh.anemiaMukt || {};
  const an = mh.atmnirbhar || {};
  const bs = mh.baalSanskar || {};
  const ab = mh.abhiruchi || {};
  const fa = mh.familyAdoption || {};

  sections.push({ number: 5, title: 'Mahila Sahbhagita Gatividhi', tables: [
    { title: 'Beti Padhao Beti Apnao', subCols: ['Programmes','Participants'], projects: [
      mkRow('Beti Padhao', safe(bp, 'prev_programmes','prev_participants'), safe(bp, 'curr_programmes','curr_participants')),
    ]},
    { title: 'Anemia Mukt Bharat', subCols: ['Shivir','Total Test','Anemic','Anemia Mukt'], projects: [
      mkRow('Anemia Mukt', safe(am, 'prev_shivir','prev_total_test','prev_anemic','prev_anemia_mukt'), safe(am, 'curr_shivir','curr_total_test','curr_anemic','curr_anemia_mukt')),
    ]},
    { title: 'Atmnirbhar Bharat', subCols: ['Sewing Centre','Sewing Beneficiary','Machines','Beautician Centre','Beautician Beneficiary'], projects: [
      mkRow('Atmnirbhar', safe(an, 'prev_sewing_centers','prev_sewing_beneficiary','prev_machines','prev_beauty_centers','prev_beauty_beneficiary'), safe(an, 'curr_sewing_centers','curr_sewing_beneficiary','curr_machines','curr_beauty_centers','curr_beauty_beneficiary')),
    ]},
    { title: 'Baal Sanskar', subCols: ['Shivir Duration','No of Activities','Presence'], projects: [
      mkRow('Baal Sanskar', safe(bs, 'prev_shivir_duration','prev_activities','prev_presence'), safe(bs, 'curr_shivir_duration','curr_activities','curr_presence')),
    ]},
    { title: 'Abhiruchi & Atmraksha Shivir', subCols: ['Abhiruchi Shivir','Activities','Beneficiary','Atmraksha Activities','Atmraksha Beneficiary'], projects: [
      mkRow('Abhiruchi & Atmraksha', safe(ab, 'prev_shivir','prev_activities','prev_beneficiary','prev_atm_activities','prev_atm_beneficiary'), safe(ab, 'curr_shivir','curr_activities','curr_beneficiary','curr_atm_activities','curr_atm_beneficiary')),
    ]},
    { title: 'Adoption Projects', subCols: ['Families','Family Beneficiary','Family Amount','Girl Beneficiary','Girl Amount'], projects: [
      mkRow('Adoption', safe(fa, 'prev_families','prev_family_beneficiary','prev_family_amount','prev_girl_beneficiary','prev_girl_amount'), safe(fa, 'curr_families','curr_family_beneficiary','curr_family_amount','curr_girl_beneficiary','curr_girl_amount')),
    ]},
  ]});

  // 6. Sampark Gatividhi
  const ss = sp.sankritSaptah || {};
  const sv = sp.samuhikVivah || {};
  const sd = sp.bvpSthapnaDiwas || {};
  const vg = sp.vichargosthi || {};
  const ed = sp.education || {};
  const nv = sp.navVarsh || {};
  const ek = sp.ekShakha || {};

  sections.push({ number: 6, title: 'Sampark Gatividhi', tables: [
    { title: 'Sampark', subCols: ['Programmes','Participants'], projects: [
      mkRow('Sanskriti Saptah', safe(ss, 'prev_programmes','prev_participants'), safe(ss, 'curr_programmes','curr_participants')),
      mkRow('BVP Sthapna Diwas', safe(sd, 'prev_programmes','prev_participants'), safe(sd, 'curr_programmes','curr_participants')),
      mkRow('Vichar Gosthi', safe(vg, 'prev_programmes','prev_participants'), safe(vg, 'curr_programmes','curr_participants')),
    ]},
    { title: 'Samuhik Saral Vivah', subCols: ['Vivah','Pairs'], projects: [
      mkRow('Samuhik Vivah', safe(sv, 'prev_vivah','prev_pairs'), safe(sv, 'curr_vivah','curr_pairs')),
    ]},
    { title: 'Education', subCols: ['Computer Centre','Computer Beneficiary','Library Centre','Library Beneficiary'], projects: [
      mkRow('Education', safe(ed, 'prev_computer_centers','prev_computer_beneficiary','prev_library_centers','prev_library_beneficiary'), safe(ed, 'curr_computer_centers','curr_computer_beneficiary','curr_library_centers','curr_library_beneficiary')),
    ]},
    { title: 'Nav Varsh & Inspiring Events', subCols: ['Programmes','No of Activities','Presence'], projects: [
      mkRow('Nav Varsh', safe(nv, 'prev_programmes','prev_activities','prev_presence'), safe(nv, 'curr_programmes','curr_activities','curr_presence')),
    ]},
    { title: 'Ek Shakha Ek Gaon', subCols: ['Programmes','Beneficiaries','Amount'], projects: [
      mkRow('Ek Shakha Ek Gaon', safe(ek, 'prev_programmes','prev_beneficiaries','prev_amount'), safe(ek, 'curr_programmes','curr_beneficiaries','curr_amount')),
    ]},
  ]});

  return { sections };
}

export function exportCSV(form) {
  const currMonth = form.reportMonth;
  const prevLabel = getPrevMonth(form.reportMonth);
  const printData = buildPrintData(form);
  const lines = [];
  const esc = v => typeof v === 'number' ? v : `"${String(v||'').replace(/"/g,'""')}"`;

  lines.push('Bharat Vikas Parishad - BVP Paschim Prant');
  lines.push('Branch Monthly Report [Shakha Masik Prativedan]');
  lines.push('');
  lines.push(`Name of Prant,${form.prantName}`);
  lines.push(`Name of District,${form.districtName}`);
  lines.push(`Name of Branch,${form.branchName}`);
  lines.push(`PAN of Branch,${form.panOfBranch || 'N/A'}`);
  lines.push(`Month,${form.reportMonth} ${form.reportYear}`);
  lines.push('');

  const pi = form.primaryInfo || {};
  lines.push('1. Primary Information');
  lines.push(`,,Prev Year (2024-25),,Target (2025-26),,Till Date,,Vikas Mitra,,Vikas Ratna,,Cash Balance,Bank Balance,Total FD`);
  lines.push(`,No. of Members,Membership Contribution,,No. of Members,Membership Contribution,,No. of Members,Membership Contribution,,31.03,Till Date,31.03,Till Date,,,`);
  lines.push(`,${pi.year2024_25_members||0},Rs ${pi.year2024_25_contribution||0},,${pi.target2025_26_members||0},Rs ${pi.target2025_26_contribution||0},,${pi.tillDate_members||0},Rs ${pi.tillDate_contribution||0},,${pi.vikasMitra_base||0},${pi.vikasMitra_tillDate||0},${pi.vikasRatna_base||0},${pi.vikasRatna_tillDate||0},Rs ${pi.cashBalance||0},Rs ${pi.bankBalance1||0},Rs ${pi.bankBalance2||0}`);
  lines.push('');

  printData.sections.forEach(section => {
    lines.push(`${section.number}. ${section.title}`);
    section.tables.forEach(table => {
      const subCols = table.subCols || ['Value'];
      const header1 = ['Projects', ...subCols.map(() => prevLabel), ...subCols.map(() => currMonth), ...subCols.map(() => 'Cumulative Total')].join(',');
      const header2 = ['', ...subCols, ...subCols, ...subCols].join(',');
      lines.push(table.title);
      lines.push(header1);
      lines.push(header2);
      table.projects.forEach(proj => {
        lines.push([esc(proj.label), ...proj.prev.map(esc), ...proj.curr.map(esc), ...proj.total.map(esc)].join(','));
      });
      lines.push('');
    });
  });

  lines.push('7. Sangathan - Meetings');
  const meetings = form.meetings || { executive: [], generalBody: [], workingGroup: [] };
  ['executive', 'generalBody', 'workingGroup'].forEach(type => {
    const label = type === 'executive' ? 'Executive Committee' : type === 'generalBody' ? 'General Body' : 'Working Group';
    lines.push(`${label} Meetings`);
    lines.push('Date,Participants');
    (meetings[type] || []).forEach(m => {
      lines.push(`${m.date || 'N/A'},${m.participants}`);
    });
    lines.push('');
  });

  lines.push('8. Permanent Sewa Projects');
  lines.push(`Service,${prevLabel} Projects,${prevLabel} Beneficiary,${prevLabel} Cost,${currMonth} Projects,${currMonth} Beneficiary,${currMonth} Cost,Total Projects,Total Beneficiary,Total Cost`);
  (form.permanentSewa || []).forEach(r => {
    lines.push([esc(r.service||'-'), r.prev_projects||0, r.prev_beneficiary||0, r.prev_cost||0, r.curr_projects||0, r.curr_beneficiary||0, r.curr_cost||0, (r.prev_projects||0)+(r.curr_projects||0), (r.prev_beneficiary||0)+(r.curr_beneficiary||0), (r.prev_cost||0)+(r.curr_cost||0)].join(','));
  });
  lines.push('');

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BVP_Report_${(form.branchName||'Report').replace(/\s+/g, '_')}_${form.reportMonth}_${form.reportYear}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PrintReport({ form, onBack }) {
  const pi = form.primaryInfo || {};
  const currMonth = form.reportMonth;
  const prevLabel = getPrevMonth(form.reportMonth);
  const printData = buildPrintData(form);
  const meetings = form.meetings || { executive: [], generalBody: [], workingGroup: [] };
  const permanentSewa = form.permanentSewa || [];

  return (
    <div className="print-report">
      <div className="print-header">
        <h1>Bharat Vikas Parishad — BVP Paschim Prant</h1>
        <h2>Branch Monthly Report [Shakha Masik Prativedan]</h2>
        <div className="print-meta">
          <span><strong>Name of Prant:</strong> {form.prantName}</span>
          <span><strong>Name of District:</strong> {form.districtName}</span>
          <span><strong>Name of Branch:</strong> {form.branchName}</span>
          {form.panOfBranch && <span><strong>PAN of Branch:</strong> {form.panOfBranch}</span>}
          <span><strong>Month:</strong> {form.reportMonth} {form.reportYear}</span>
        </div>
      </div>

      {/* 1. Primary Information */}
      <div className="print-section">
        <div className="print-section-title">1. Primary Information</div>
        <table className="print-table">
          <thead>
            <tr>
              <th className="print-th print-th-label" rowSpan="2"></th>
              <th className="print-th print-th-prev" colSpan="2">{(form.reportYear||2025)-1}-{String(form.reportYear||2025).slice(2)}</th>
              <th className="print-th" colSpan="2">Target {form.reportYear||2025}-{String((form.reportYear||2025)+1).slice(2)}</th>
              <th className="print-th print-th-curr" colSpan="2">Till Date</th>
              <th className="print-th" colSpan="2">Vikas Mitra</th>
              <th className="print-th" colSpan="2">Vikas Ratna</th>
              <th className="print-th print-th-total">Cash Balance</th>
              <th className="print-th print-th-total">Bank Balance</th>
              <th className="print-th print-th-total">Total FD</th>
            </tr>
            <tr>
              <th className="print-th print-th-prev">No. of Members</th>
              <th className="print-th print-th-prev">Membership Contribution</th>
              <th className="print-th">No. of Members</th>
              <th className="print-th">Membership Contribution</th>
              <th className="print-th print-th-curr">No. of Members</th>
              <th className="print-th print-th-curr">Membership Contribution</th>
              <th className="print-th">31.03</th>
              <th className="print-th">Till Date</th>
              <th className="print-th">31.03</th>
              <th className="print-th">Till Date</th>
              <th className="print-th print-th-total"></th>
              <th className="print-th print-th-total"></th>
              <th className="print-th print-th-total"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="print-td print-td-label">Membership</td>
              <td className="print-td print-td-prev">{pi.year2024_25_members||0}</td>
              <td className="print-td print-td-prev">Rs {(pi.year2024_25_contribution||0).toLocaleString()}</td>
              <td className="print-td">{pi.target2025_26_members||0}</td>
              <td className="print-td">Rs {(pi.target2025_26_contribution||0).toLocaleString()}</td>
              <td className="print-td print-td-curr">{pi.tillDate_members||0}</td>
              <td className="print-td print-td-curr">Rs {(pi.tillDate_contribution||0).toLocaleString()}</td>
              <td className="print-td">{pi.vikasMitra_base||0}</td>
              <td className="print-td">{pi.vikasMitra_tillDate||0}</td>
              <td className="print-td">{pi.vikasRatna_base||0}</td>
              <td className="print-td">{pi.vikasRatna_tillDate||0}</td>
              <td className="print-td print-td-total">Rs {(pi.cashBalance||0).toLocaleString()}</td>
              <td className="print-td print-td-total">Rs {(pi.bankBalance1||0).toLocaleString()}</td>
              <td className="print-td print-td-total">Rs {(pi.bankBalance2||0).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sections 2-6 */}
      {printData.sections.map(section => (
        <div key={section.number} className="print-section">
          <div className="print-section-title">{section.number}. {section.title}</div>
          <PrintCombinedTable tables={section.tables} prevLabel={prevLabel} currMonth={currMonth} />
        </div>
      ))}

      {/* 7. Meetings */}
      <div className="print-section">
        <div className="print-section-title">7. Sangathan — Meetings</div>
        {['executive', 'generalBody', 'workingGroup'].map(type => (
          <div key={type} className="print-sheet">
            <div className="print-sheet-subtitle">
              {type === 'executive' ? 'Executive Committee' : type === 'generalBody' ? 'General Body' : 'Working Group'} Meetings
            </div>
            <table className="print-table">
              <thead><tr><th className="print-th">#</th><th className="print-th">Date</th><th className="print-th">Participants</th></tr></thead>
              <tbody>
                {(meetings[type] || []).map((m, i) => (
                  <tr key={i}><td className="print-td">{i+1}</td><td className="print-td">{m.date || 'N/A'}</td><td className="print-td">{m.participants}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* 8. Permanent Sewa */}
      {permanentSewa.length > 0 && (
        <div className="print-section">
          <div className="print-section-title">8. Permanent Sewa Gatividhi / Projects</div>
          <table className="print-table print-table-fixed">
            <colgroup>
              <col style={{width:'15%'}}/>
              {Array.from({length:9},(_,i)=><col key={i} style={{width:`${85/9}%`}}/>)}
            </colgroup>
            <thead>
              <tr>
                <th className="print-th print-th-label" rowSpan="2">Projects</th>
                <th className="print-th print-th-prev" colSpan="3">{prevLabel}</th>
                <th className="print-th print-th-curr" colSpan="3">{currMonth}</th>
                <th className="print-th print-th-total" colSpan="3">Cumulative Total</th>
              </tr>
              <tr>
                {[0,1,2].map(g => ['No. of Projects','Beneficiary','Est. Cost (Rs.)'].map((h, i) => (
                  <th key={`${g}${i}`} className={`print-th${g===2?' print-th-total':g===0?' print-th-prev':' print-th-curr'}`}>{h}</th>
                )))}
              </tr>
            </thead>
            <tbody>
              {permanentSewa.map((r, i) => (
                <tr key={i}>
                  <td className="print-td print-td-label">{r.service || `Project ${i+1}`}</td>
                  <td className="print-td print-td-prev">{r.prev_projects||0}</td>
                  <td className="print-td print-td-prev">{(r.prev_beneficiary||0).toLocaleString()}</td>
                  <td className="print-td print-td-prev">{(r.prev_cost||0).toLocaleString()}</td>
                  <td className="print-td print-td-curr">{r.curr_projects||0}</td>
                  <td className="print-td print-td-curr">{(r.curr_beneficiary||0).toLocaleString()}</td>
                  <td className="print-td print-td-curr">{(r.curr_cost||0).toLocaleString()}</td>
                  <td className="print-td print-td-total">{(r.prev_projects||0)+(r.curr_projects||0)}</td>
                  <td className="print-td print-td-total">{((r.prev_beneficiary||0)+(r.curr_beneficiary||0)).toLocaleString()}</td>
                  <td className="print-td print-td-total">{((r.prev_cost||0)+(r.curr_cost||0)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="no-print ss-nav-btn" style={{ margin: '20px auto', display: 'block' }} onClick={onBack}>Back</button>
    </div>
  );
}
