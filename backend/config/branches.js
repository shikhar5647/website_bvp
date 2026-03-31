// All 33 branches from Rajasthan West Prant with their targets for 2025-26
const BRANCHES = [
  { sno: 1,  district: 'Barmer',    brNo: 1, branch: 'Barmer Main',       members2024: 140, target2025: 145, gvcaSchools: 12, bkjSchools: 35, ngscSchools: 8,  plantation: 30000 },
  { sno: 2,  district: 'Barmer',    brNo: 2, branch: 'VDR Barmer',        members2024: 101, target2025: 151, gvcaSchools: 15, bkjSchools: 25, ngscSchools: 8,  plantation: 100 },
  { sno: 3,  district: 'Barmer',    brNo: 3, branch: 'Gudamalani',        members2024: 55,  target2025: 60,  gvcaSchools: 4,  bkjSchools: 8,  ngscSchools: 3,  plantation: 500 },
  { sno: 4,  district: 'Balotra',   brNo: 1, branch: 'Balotra',           members2024: 121, target2025: 130, gvcaSchools: 20, bkjSchools: 30, ngscSchools: 20, plantation: 250 },
  { sno: 5,  district: 'Jaisalmer', brNo: 1, branch: 'Jaisalmer',         members2024: 45,  target2025: 55,  gvcaSchools: 30, bkjSchools: 30, ngscSchools: 8,  plantation: 200 },
  { sno: 6,  district: 'Jaisalmer', brNo: 2, branch: 'Pokaran',           members2024: 50,  target2025: 62,  gvcaSchools: 15, bkjSchools: 20, ngscSchools: 10, plantation: 1100 },
  { sno: 7,  district: 'Jalore',    brNo: 1, branch: 'Jalore',            members2024: 110, target2025: 110, gvcaSchools: 10, bkjSchools: 30, ngscSchools: 6,  plantation: 400 },
  { sno: 8,  district: 'Jalore',    brNo: 2, branch: 'Bhinmal',           members2024: 62,  target2025: 80,  gvcaSchools: 5,  bkjSchools: 15, ngscSchools: 10, plantation: 200 },
  { sno: 9,  district: 'Jalore',    brNo: 3, branch: 'Ahore',             members2024: 25,  target2025: 40,  gvcaSchools: 4,  bkjSchools: 8,  ngscSchools: 4,  plantation: 100 },
  { sno: 10, district: 'Jalore',    brNo: 4, branch: 'Sayala',            members2024: 25,  target2025: 50,  gvcaSchools: 15, bkjSchools: 20, ngscSchools: 14, plantation: 200 },
  { sno: 11, district: 'Jalore',    brNo: 5, branch: 'Sanchore Main',     members2024: 40,  target2025: 55,  gvcaSchools: 5,  bkjSchools: 4,  ngscSchools: 3,  plantation: 300 },
  { sno: 12, district: 'Jalore',    brNo: 6, branch: 'VU Sanchore',       members2024: 40,  target2025: 40,  gvcaSchools: 6,  bkjSchools: 5,  ngscSchools: 3,  plantation: 100 },
  { sno: 13, district: 'Jodhpur',   brNo: 1, branch: 'Jodhpur Main',      members2024: 190, target2025: 200, gvcaSchools: 20, bkjSchools: 30, ngscSchools: 7,  plantation: 1100 },
  { sno: 14, district: 'Jodhpur',   brNo: 2, branch: 'Jodhpur Marwar',    members2024: 192, target2025: 205, gvcaSchools: 20, bkjSchools: 30, ngscSchools: 9,  plantation: 3000 },
  { sno: 15, district: 'Jodhpur',   brNo: 3, branch: 'Nandanvan',         members2024: 206, target2025: 211, gvcaSchools: 33, bkjSchools: 22, ngscSchools: 10, plantation: 3500 },
  { sno: 16, district: 'Jodhpur',   brNo: 4, branch: 'Saraswati Nagar',   members2024: 52,  target2025: 80,  gvcaSchools: 10, bkjSchools: 5,  ngscSchools: 5,  plantation: 500 },
  { sno: 17, district: 'Jodhpur',   brNo: 5, branch: 'Ratanada',          members2024: 40,  target2025: 50,  gvcaSchools: 5,  bkjSchools: 5,  ngscSchools: 3,  plantation: 2000 },
  { sno: 18, district: 'Jodhpur',   brNo: 6, branch: 'Paota',             members2024: 40,  target2025: 51,  gvcaSchools: 15, bkjSchools: 10, ngscSchools: 8,  plantation: 500 },
  { sno: 19, district: 'Jodhpur',   brNo: 7, branch: 'Suryanagari',       members2024: 45,  target2025: 50,  gvcaSchools: 3,  bkjSchools: 3,  ngscSchools: 3,  plantation: 251 },
  { sno: 20, district: 'Jodhpur',   brNo: 8, branch: 'Mathaniya',         members2024: 30,  target2025: 40,  gvcaSchools: 3,  bkjSchools: 3,  ngscSchools: 3,  plantation: 200 },
  { sno: 21, district: 'Jodhpur',   brNo: 9, branch: 'Osian',             members2024: 100, target2025: 110, gvcaSchools: 4,  bkjSchools: 3,  ngscSchools: 3,  plantation: 500 },
  { sno: 22, district: 'Jodhpur',   brNo: 10,branch: 'Pipar Nagar',       members2024: 71,  target2025: 151, gvcaSchools: 11, bkjSchools: 8,  ngscSchools: 3,  plantation: 2100 },
  { sno: 23, district: 'Phalodi',   brNo: 1, branch: 'Bap',               members2024: 40,  target2025: 50,  gvcaSchools: 5,  bkjSchools: 15, ngscSchools: 5,  plantation: 500 },
  { sno: 24, district: 'Phalodi',   brNo: 2, branch: 'Phalodi',           members2024: 40,  target2025: 60,  gvcaSchools: 5,  bkjSchools: 8,  ngscSchools: 3,  plantation: 500 },
  { sno: 25, district: 'Pali',      brNo: 1, branch: 'Pali',              members2024: 85,  target2025: 110, gvcaSchools: 38, bkjSchools: 20, ngscSchools: 8,  plantation: 100 },
  { sno: 26, district: 'Pali',      brNo: 2, branch: 'Sojat',             members2024: 70,  target2025: 80,  gvcaSchools: 20, bkjSchools: 20, ngscSchools: 15, plantation: 200 },
  { sno: 27, district: 'Pali',      brNo: 3, branch: 'Sumerpur Sheoganj', members2024: 135, target2025: 150, gvcaSchools: 20, bkjSchools: 40, ngscSchools: 10, plantation: 100 },
  { sno: 28, district: 'Pali',      brNo: 4, branch: 'Falna Bali',        members2024: 64,  target2025: 80,  gvcaSchools: 20, bkjSchools: 15, ngscSchools: 10, plantation: 500 },
  { sno: 29, district: 'Pali',      brNo: 5, branch: 'Sadri',             members2024: 60,  target2025: 80,  gvcaSchools: 5,  bkjSchools: 10, ngscSchools: 5,  plantation: 200 },
  { sno: 30, district: 'Sirohi',    brNo: 1, branch: 'Devnagri Sirohi',   members2024: 112, target2025: 120, gvcaSchools: 15, bkjSchools: 15, ngscSchools: 10, plantation: 200 },
  { sno: 31, district: 'Sirohi',    brNo: 2, branch: 'Pindwara',          members2024: 78,  target2025: 90,  gvcaSchools: 15, bkjSchools: 15, ngscSchools: 5,  plantation: 500 },
  { sno: 32, district: 'Sirohi',    brNo: 3, branch: 'Aburoad',           members2024: 50,  target2025: 60,  gvcaSchools: 5,  bkjSchools: 5,  ngscSchools: 3,  plantation: 500 },
  { sno: 33, district: 'Sirohi',    brNo: 4, branch: 'Mount Abu',         members2024: 45,  target2025: 55,  gvcaSchools: 5,  bkjSchools: 5,  ngscSchools: 3,  plantation: 200 },
];
 
const DISTRICTS = [...new Set(BRANCHES.map(b => b.district))];
const BRANCH_NAMES = BRANCHES.map(b => b.branch);
const PRANT_NAME = 'Rajasthan Pashchim';
 
const MONTHS = ['April','May','June','July','August','September','October','November','December','January','February','March'];
 
function getBranchByName(name) {
  return BRANCHES.find(b => b.branch === name);
}
 
function getBranchesByDistrict(district) {
  return BRANCHES.filter(b => b.district === district);
}
 
module.exports = { BRANCHES, DISTRICTS, BRANCH_NAMES, PRANT_NAME, MONTHS, getBranchByName, getBranchesByDistrict };
 