const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { BRANCHES, BRANCH_NAMES, MONTHS } = require('backend/config/branches');
 
// GET /api/reports/branches — public config endpoint
router.get('/branches', (req, res) => {
  res.json({ success: true, data: { branches: BRANCHES, branchNames: BRANCH_NAMES, months: MONTHS } });
});
 
// GET all reports (with role-based filtering)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { month, year, branch, prant } = req.query;
    let filter = {};
    if (month) filter.reportMonth = month;
    if (year) filter.reportYear = parseInt(year);
    if (branch) filter.branchName = new RegExp(branch, 'i');
    if (prant) filter.prantName = new RegExp(prant, 'i');
 
    // Branch secretary can only see their own branch reports
    if (req.user.role === 'branch_secretary') {
      filter.branchName = req.user.branchName;
    }
 
    const reports = await Report.find(filter)
      .select('branchName prantName districtName reportMonth reportYear submittedAt primaryInfo submittedBy')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// GET single report
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.params.id === 'analytics') return next();
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
 
    // Branch secretary can only see own branch
    if (req.user.role === 'branch_secretary' && report.branchName !== req.user.branchName) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
 
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// POST create report
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Branch secretary can only submit for their own branch
    if (req.user.role === 'branch_secretary' && req.body.branchName !== req.user.branchName) {
      return res.status(403).json({ success: false, message: 'You can only submit reports for your branch' });
    }
 
    const reportData = { ...req.body, submittedBy: req.user.username };
    const report = new Report(reportData);
    const saved = await report.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
 
// PUT update report
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await Report.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Report not found' });
 
    if (req.user.role === 'branch_secretary' && existing.branchName !== req.user.branchName) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
 
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
 
// DELETE report
router.delete('/:id', authMiddleware, requireRole('admin', 'prant_secretary'), async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// GET analytics/summary — prant & admin only
router.get('/analytics/summary', authMiddleware, async (req, res) => {
  try {
    const { year, month, branch } = req.query;
    let match = {};
    if (year) match.reportYear = parseInt(year);
    if (month) match.reportMonth = month;
    if (branch) match.branchName = branch;
 
    // Branch secretary only sees own branch analytics
    if (req.user.role === 'branch_secretary') {
      match.branchName = req.user.branchName;
    }
 
    const summary = await Report.aggregate([
      { $match: match },
      {
        $group: {
          _id: { month: '$reportMonth', year: '$reportYear' },
          totalBranches: { $sum: 1 },
          totalMembers: { $sum: '$primaryInfo.tillDate_members' },
          totalContribution: { $sum: '$primaryInfo.tillDate_contribution' },
          totalMedicalBeneficiary: {
            $sum: {
              $add: [
                '$sewaGatividhi.medicalCamp.curr_health_beneficiary',
                '$sewaGatividhi.medicalCamp.curr_eye_beneficiary'
              ]
            }
          },
          totalTrees: { $sum: '$environmentGatividhi.treePlantation_curr' },
          totalBloodUnits: { $sum: '$sewaGatividhi.bloodDonation.curr_blood_units' },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
 
    const branchWise = await Report.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$branchName',
          totalReports: { $sum: 1 },
          avgMembers: { $avg: '$primaryInfo.tillDate_members' },
          totalContribution: { $sum: '$primaryInfo.tillDate_contribution' },
          totalMedical: { $sum: '$sewaGatividhi.medicalCamp.curr_health_beneficiary' },
          totalBlood: { $sum: '$sewaGatividhi.bloodDonation.curr_blood_units' },
        }
      },
      { $sort: { totalContribution: -1 } }
    ]);
 
    res.json({ success: true, data: { monthly: summary, branchWise } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// GET consolidated prant report for a specific month/year — prant & admin only
router.get('/reports/consolidated', authMiddleware, requireRole('admin', 'prant_secretary'), async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ success: false, message: 'Month and year required' });
 
    const reports = await Report.find({ reportMonth: month, reportYear: parseInt(year) }).lean();
 
    const submittedBranches = reports.map(r => r.branchName);
    const missingBranches = BRANCH_NAMES.filter(b => !submittedBranches.includes(b));
 
    res.json({
      success: true,
      data: {
        reports,
        submittedBranches,
        missingBranches,
        totalSubmitted: submittedBranches.length,
        totalMissing: missingBranches.length,
        totalBranches: BRANCH_NAMES.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// GET project-wise report across all branches — prant & admin only
router.get('/reports/projectwise', authMiddleware, requireRole('admin', 'prant_secretary'), async (req, res) => {
  try {
    const { month, year, project } = req.query;
    if (!month || !year) return res.status(400).json({ success: false, message: 'Month and year required' });
 
    const reports = await Report.find({ reportMonth: month, reportYear: parseInt(year) }).lean();
 
    // Build project-wise summary
    const projectData = {};
    const projectCategories = [
      'sanskarGatividhi.nsgc', 'sanskarGatividhi.bharatKoJano', 'sanskarGatividhi.gvca',
      'sanskarGatividhi.interCollege', 'sanskarGatividhi.yuvaSanskar',
      'sewaGatividhi.medicalCamp', 'sewaGatividhi.healthAwareness', 'sewaGatividhi.bloodDonation',
      'sewaGatividhi.divyangSahayta', 'sewaGatividhi.vanvasiSahayta', 'sewaGatividhi.gramVikas',
      'sewaGatividhi.helpingNeedy',
      'environmentGatividhi',
      'mahilaSahbhagita.betiPadhao', 'mahilaSahbhagita.anemiaMukt', 'mahilaSahbhagita.atmnirbhar',
      'mahilaSahbhagita.baalSanskar', 'mahilaSahbhagita.familyAdoption',
      'samparkGatividhi.sankritSaptah', 'samparkGatividhi.samuhikVivah',
      'samparkGatividhi.bvpSthapnaDiwas', 'samparkGatividhi.vichargosthi',
      'samparkGatividhi.navVarsh', 'samparkGatividhi.ekShakha',
    ];
 
    // For each project category, extract data per branch
    for (const cat of projectCategories) {
      const parts = cat.split('.');
      const branches = {};
      const prantTotals = {};
 
      for (const report of reports) {
        let data;
        if (parts.length === 1) {
          data = report[parts[0]] || {};
        } else {
          data = (report[parts[0]] || {})[parts[1]] || {};
        }
 
        branches[report.branchName] = data;
 
        // Accumulate prant totals
        for (const [key, val] of Object.entries(data)) {
          if (typeof val === 'number') {
            prantTotals[key] = (prantTotals[key] || 0) + val;
          }
        }
      }
 
      projectData[cat] = { branches, prantTotals };
    }
 
    res.json({
      success: true,
      data: {
        month, year: parseInt(year),
        reports: reports.map(r => ({ branchName: r.branchName, districtName: r.districtName })),
        projectData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// GET branch history — all months for a branch
router.get('/reports/branch-history', authMiddleware, async (req, res) => {
  try {
    const { branch, year } = req.query;
    const branchName = branch || req.user.branchName;
 
    if (req.user.role === 'branch_secretary' && branchName !== req.user.branchName) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
 
    let filter = { branchName };
    if (year) filter.reportYear = parseInt(year);
 
    const reports = await Report.find(filter).sort({ reportYear: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
module.exports = router;
 