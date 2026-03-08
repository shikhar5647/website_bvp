const mongoose = require('mongoose');

// Sub-schemas
const MembershipSchema = new mongoose.Schema({
  year2024_25_members: { type: Number, default: 0 },
  year2024_25_contribution: { type: Number, default: 0 },
  target2025_26_members: { type: Number, default: 0 },
  target2025_26_contribution: { type: Number, default: 0 },
  tillDate_members: { type: Number, default: 0 },
  tillDate_contribution: { type: Number, default: 0 },
  vikasMitra_base: { type: Number, default: 0 },
  vikasMitra_tillDate: { type: Number, default: 0 },
  vikasRatna_base: { type: Number, default: 0 },
  vikasRatna_tillDate: { type: Number, default: 0 },
  cashBalance: { type: Number, default: 0 },
  bankBalance1: { type: Number, default: 0 },
  bankBalance2: { type: Number, default: 0 },
});

const SanskarSchema = new mongoose.Schema({
  nsgc: {
    prev_schools: { type: Number, default: 0 },
    prev_boys: { type: Number, default: 0 },
    prev_girls: { type: Number, default: 0 },
    prev_vadak: { type: Number, default: 0 },
    curr_schools: { type: Number, default: 0 },
    curr_boys: { type: Number, default: 0 },
    curr_girls: { type: Number, default: 0 },
    curr_vadak: { type: Number, default: 0 },
  },
  bharatKoJano: {
    prev_schools: { type: Number, default: 0 },
    prev_students_jr: { type: Number, default: 0 },
    prev_students_sr: { type: Number, default: 0 },
    prev_books: { type: Number, default: 0 },
    curr_schools: { type: Number, default: 0 },
    curr_students_jr: { type: Number, default: 0 },
    curr_students_sr: { type: Number, default: 0 },
    curr_books: { type: Number, default: 0 },
  },
  gvca: {
    prev_schools: { type: Number, default: 0 },
    prev_students_honoured: { type: Number, default: 0 },
    prev_teachers_honoured: { type: Number, default: 0 },
    curr_schools: { type: Number, default: 0 },
    curr_students_honoured: { type: Number, default: 0 },
    curr_teachers_honoured: { type: Number, default: 0 },
  },
  interCollege: {
    prev_colleges: { type: Number, default: 0 },
    prev_boys: { type: Number, default: 0 },
    prev_girls: { type: Number, default: 0 },
    curr_colleges: { type: Number, default: 0 },
    curr_boys: { type: Number, default: 0 },
    curr_girls: { type: Number, default: 0 },
  },
});

const SewaSchema = new mongoose.Schema({
  medicalCamp: {
    prev_health_shivir: { type: Number, default: 0 },
    prev_health_beneficiary: { type: Number, default: 0 },
    prev_eye_shivir: { type: Number, default: 0 },
    prev_eye_beneficiary: { type: Number, default: 0 },
    prev_operations: { type: Number, default: 0 },
    curr_health_shivir: { type: Number, default: 0 },
    curr_health_beneficiary: { type: Number, default: 0 },
    curr_eye_shivir: { type: Number, default: 0 },
    curr_eye_beneficiary: { type: Number, default: 0 },
    curr_operations: { type: Number, default: 0 },
  },
  bloodDonation: {
    prev_sankalp: { type: Number, default: 0 },
    prev_pairs: { type: Number, default: 0 },
    prev_shivir: { type: Number, default: 0 },
    prev_units: { type: Number, default: 0 },
    curr_sankalp: { type: Number, default: 0 },
    curr_pairs: { type: Number, default: 0 },
    curr_shivir: { type: Number, default: 0 },
    curr_units: { type: Number, default: 0 },
  },
  helpingNeedy: {
    prev_schools: { type: Number, default: 0 },
    prev_beneficiary: { type: Number, default: 0 },
    prev_blankets: { type: Number, default: 0 },
    prev_food: { type: Number, default: 0 },
    curr_schools: { type: Number, default: 0 },
    curr_beneficiary: { type: Number, default: 0 },
    curr_blankets: { type: Number, default: 0 },
    curr_food: { type: Number, default: 0 },
  },
  gramVikas: {
    prev_activities: { type: Number, default: 0 },
    prev_amount: { type: Number, default: 0 },
    prev_beneficiary: { type: Number, default: 0 },
    curr_activities: { type: Number, default: 0 },
    curr_amount: { type: Number, default: 0 },
    curr_beneficiary: { type: Number, default: 0 },
  },
});

const EnvironmentSchema = new mongoose.Schema({
  treePlantation_prev: { type: Number, default: 0 },
  treePlantation_curr: { type: Number, default: 0 },
  tulsiPodha_prev: { type: Number, default: 0 },
  tulsiPodha_curr: { type: Number, default: 0 },
  clothBags_prev: { type: Number, default: 0 },
  clothBags_curr: { type: Number, default: 0 },
  seminars_prev: { type: Number, default: 0 },
  seminars_curr: { type: Number, default: 0 },
  parinda_prev: { type: Number, default: 0 },
  parinda_curr: { type: Number, default: 0 },
});

const MahilaSchema = new mongoose.Schema({
  betiPadhao: {
    prev_programmes: { type: Number, default: 0 },
    prev_participants: { type: Number, default: 0 },
    curr_programmes: { type: Number, default: 0 },
    curr_participants: { type: Number, default: 0 },
  },
  anemiaMukt: {
    prev_shivir: { type: Number, default: 0 },
    prev_total_test: { type: Number, default: 0 },
    prev_anemic: { type: Number, default: 0 },
    curr_shivir: { type: Number, default: 0 },
    curr_total_test: { type: Number, default: 0 },
    curr_anemic: { type: Number, default: 0 },
  },
  baalSanskar: {
    prev_activities: { type: Number, default: 0 },
    prev_presence: { type: Number, default: 0 },
    curr_activities: { type: Number, default: 0 },
    curr_presence: { type: Number, default: 0 },
  },
  familyAdoption: {
    prev_families: { type: Number, default: 0 },
    prev_beneficiary: { type: Number, default: 0 },
    prev_amount: { type: Number, default: 0 },
    curr_families: { type: Number, default: 0 },
    curr_beneficiary: { type: Number, default: 0 },
    curr_amount: { type: Number, default: 0 },
  },
});

const SamparkSchema = new mongoose.Schema({
  sankritSaptah: {
    prev_programmes: { type: Number, default: 0 },
    prev_participants: { type: Number, default: 0 },
    curr_programmes: { type: Number, default: 0 },
    curr_participants: { type: Number, default: 0 },
  },
  bvpSthapnaDiwas: {
    prev_programmes: { type: Number, default: 0 },
    prev_participants: { type: Number, default: 0 },
    curr_programmes: { type: Number, default: 0 },
    curr_participants: { type: Number, default: 0 },
  },
  vichargosthi: {
    prev_programmes: { type: Number, default: 0 },
    prev_participants: { type: Number, default: 0 },
    curr_programmes: { type: Number, default: 0 },
    curr_participants: { type: Number, default: 0 },
  },
  navVarsh: {
    prev_programmes: { type: Number, default: 0 },
    prev_activities: { type: Number, default: 0 },
    prev_presence: { type: Number, default: 0 },
    curr_programmes: { type: Number, default: 0 },
    curr_activities: { type: Number, default: 0 },
    curr_presence: { type: Number, default: 0 },
  },
});

const PermanentSewaSchema = new mongoose.Schema({
  service: { type: String, required: true },
  prev_projects: { type: Number, default: 0 },
  prev_beneficiary: { type: Number, default: 0 },
  curr_projects: { type: Number, default: 0 },
  curr_beneficiary: { type: Number, default: 0 },
});

const ReportSchema = new mongoose.Schema({
  // Branch Info
  branchName: { type: String, required: true },
  prantName: { type: String, required: true },
  districtName: { type: String, required: true },
  panOfBranch: { type: String },
  reportMonth: { type: String, required: true },
  reportYear: { type: Number, required: true },

  // Sections
  primaryInfo: MembershipSchema,
  sanskarGatividhi: SanskarSchema,
  sewaGatividhi: SewaSchema,
  environmentGatividhi: EnvironmentSchema,
  mahilaSahbhagita: MahilaSchema,
  samparkGatividhi: SamparkSchema,
  permanentSewa: [PermanentSewaSchema],

  // Meetings
  meetings: {
    executive: [{
      date: { type: Date },
      participants: { type: Number, default: 0 }
    }],
    generalBody: [{
      date: { type: Date },
      participants: { type: Number, default: 0 }
    }],
    workingGroup: [{
      date: { type: Date },
      participants: { type: Number, default: 0 }
    }],
  },

  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);