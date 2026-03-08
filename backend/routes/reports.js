const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET all reports (summary)
router.get('/', async (req, res) => {
  try {
    const { month, year, branch, prant } = req.query;
    let filter = {};
    if (month) filter.reportMonth = month;
    if (year) filter.reportYear = parseInt(year);
    if (branch) filter.branchName = new RegExp(branch, 'i');
    if (prant) filter.prantName = new RegExp(prant, 'i');

    const reports = await Report.find(filter)
      .select('branchName prantName districtName reportMonth reportYear submittedAt primaryInfo')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create report
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    const saved = await report.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update report
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE report
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET analytics aggregation
router.get('/analytics/summary', async (req, res) => {
  try {
    const { year } = req.query;
    let match = {};
    if (year) match.reportYear = parseInt(year);

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
          totalBloodUnits: { $sum: '$sewaGatividhi.bloodDonation.curr_units' },
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
          totalBlood: { $sum: '$sewaGatividhi.bloodDonation.curr_units' },
        }
      },
      { $sort: { totalContribution: -1 } }
    ]);

    res.json({ success: true, data: { monthly: summary, branchWise } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;