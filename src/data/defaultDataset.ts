import { Subject, StudentRaw } from "../types/school";

export const DEFAULT_SUBJECTS: Subject[] = [
  { code: "BAN", name: "Bangla", practical: false },
  { code: "ENG", name: "English", practical: false },
  { code: "MAT", name: "Mathematics", practical: false },
  { code: "PHY", name: "Physics", practical: true },
  { code: "CHE", name: "Chemistry", practical: true },
  { code: "BIO", name: "Biology", practical: true },
  { code: "HMT", name: "Higher Mathematics", practical: true },
  { code: "AGR", name: "Agriculture", practical: true },
  { code: "REL", name: "Religion", practical: false },
];

export const DEFAULT_COMPULSORY_CODES = ["BAN", "ENG", "MAT", "PHY", "CHE", "BIO"];

/**
 * 64 Students across Class 9 and Class 10
 * Specifically highlights the 8 required hard edge cases + realistic distributions.
 */
export const DEFAULT_STUDENTS: StudentRaw[] = [
  // ==========================================
  // 8 HARD EDGE CASES (Explicitly Tagged & Documented)
  // ==========================================
  {
    id: "S-EDGE-01",
    name: "Tariqul Islam",
    class: "Class 9",
    optional: "HMT",
    edgeCaseTag: "High Average with Failed Compulsory Subject (Bio = 0)",
    marks: {
      BAN: 88,
      ENG: 82,
      MAT: 95,
      PHY: { theory: 62, practical: 22 }, // Total 84 (5.0)
      CHE: { theory: 60, practical: 20 }, // Total 80 (5.0)
      BIO: { theory: 10, practical: 5 },  // Failed both -> GP 0.0
      HMT: { theory: 68, practical: 24 }, // Total 92 (5.0) -> Bonus +3.0
    },
  },
  {
    id: "S-EDGE-02",
    name: "Nusrat Jahan",
    class: "Class 9",
    optional: "AGR",
    edgeCaseTag: "Practical Component Fail (< 8) with Passing Theory in Physics",
    marks: {
      BAN: 72,
      ENG: 68,
      MAT: 75,
      PHY: { theory: 55, practical: 6 }, // Practical < 8 -> Fail! Total 61 ignored
      CHE: { theory: 48, practical: 18 }, // Total 66 (3.5)
      BIO: { theory: 50, practical: 19 }, // Total 69 (3.5)
      AGR: { theory: 60, practical: 20 }, // Total 80 (5.0) -> Bonus +3.0
    },
  },
  {
    id: "S-EDGE-03",
    name: "Farhan Ahmed",
    class: "Class 9",
    optional: "HMT",
    edgeCaseTag: "Theory Fail (< 25) with Passing Practical in Chemistry",
    marks: {
      BAN: 80,
      ENG: 75,
      MAT: 82,
      PHY: { theory: 45, practical: 15 }, // Total 60 (3.5)
      CHE: { theory: 20, practical: 24 }, // Theory < 25 -> Fail! Total 44 ignored
      BIO: { theory: 42, practical: 16 }, // Total 58 (3.0)
      HMT: { theory: 70, practical: 25 }, // Total 95 (5.0) -> Bonus +3.0
    },
  },
  {
    id: "S-EDGE-04",
    name: "Sabrina Akter",
    class: "Class 9",
    optional: "AGR",
    edgeCaseTag: "4th Optional Subject GP <= 2.0 (GP 2.00) -> Adds 0 Bonus GP",
    marks: {
      BAN: 62,
      ENG: 58,
      MAT: 65,
      PHY: { theory: 40, practical: 15 }, // Total 55 (3.0)
      CHE: { theory: 42, practical: 16 }, // Total 58 (3.0)
      BIO: { theory: 38, practical: 14 }, // Total 52 (3.0)
      AGR: { theory: 30, practical: 12 }, // Total 42 (2.0) -> Bonus: max(0, 2-2) = 0.0
    },
  },
  {
    id: "S-EDGE-05",
    name: "Mahmud Hasan",
    class: "Class 10",
    optional: "HMT",
    edgeCaseTag: "Absent ('AB') in Optional Subject -> Contributes 0 Bonus",
    marks: {
      BAN: 78,
      ENG: 74,
      MAT: 85,
      PHY: { theory: 50, practical: 20 }, // Total 70 (4.0)
      CHE: { theory: 52, practical: 18 }, // Total 70 (4.0)
      BIO: { theory: 54, practical: 20 }, // Total 74 (4.0)
      HMT: "AB",                          // Absent in optional -> 0 bonus
    },
  },
  {
    id: "S-EDGE-06",
    name: "Sadia Afrin",
    class: "Class 10",
    optional: "AGR",
    edgeCaseTag: "Absent ('AB') in Compulsory Subject (English) -> Result Cancelled (F)",
    marks: {
      BAN: 85,
      ENG: "AB",                          // Absent in compulsory -> Result F
      MAT: 90,
      PHY: { theory: 60, practical: 20 }, // Total 80 (5.0)
      CHE: { theory: 58, practical: 22 }, // Total 80 (5.0)
      BIO: { theory: 62, practical: 21 }, // Total 83 (5.0)
      AGR: { theory: 65, practical: 20 }, // Total 85 (5.0) -> Bonus +3.0
    },
  },
  {
    id: "S-EDGE-07",
    name: "Rifat Ahmed",
    class: "Class 10",
    optional: "HMT",
    edgeCaseTag: "Numerical 0 vs Absent Distinction (Scored 0 in Bangla)",
    marks: {
      BAN: 0,                             // Scored zero mark (not absent)
      ENG: 65,
      MAT: 70,
      PHY: { theory: 45, practical: 18 }, // Total 63 (3.5)
      CHE: { theory: 40, practical: 15 }, // Total 55 (3.0)
      BIO: { theory: 42, practical: 16 }, // Total 58 (3.0)
      HMT: { theory: 55, practical: 18 }, // Total 73 (4.0) -> Bonus +2.0
    },
  },
  {
    id: "S-EDGE-08",
    name: "Ayman Chowdhury (Edge: Capped 5.00)",
    class: "Class 10",
    optional: "HMT",
    edgeCaseTag: "Edge 8: Perfect 5.00 GPA with 4th Subject Bonus Capping at 5.00 Max",
    marks: {
      BAN: 92,
      ENG: 90,
      MAT: 98,
      PHY: { theory: 70, practical: 25 }, // Total 95 (5.0)
      CHE: { theory: 68, practical: 24 }, // Total 92 (5.0)
      BIO: { theory: 72, practical: 25 }, // Total 97 (5.0)
      HMT: { theory: 70, practical: 25 }, // Total 95 (5.0) -> Bonus +3.0 (Capped at 5.00)
    },
  },

  // ==========================================
  // CLASS 9 REGULAR BATCH (28 Students: S009 to S036)
  // ==========================================
  {
    id: "S009",
    name: "Anika Tabassum",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 78, ENG: 70, MAT: 82, PHY: { theory: 52, practical: 20 }, CHE: { theory: 50, practical: 18 }, BIO: { theory: 58, practical: 21 }, AGR: { theory: 56, practical: 20 } }
  },
  {
    id: "S010",
    name: "Tanvir Hossain",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 65, ENG: 62, MAT: 74, PHY: { theory: 44, practical: 16 }, CHE: { theory: 46, practical: 17 }, BIO: { theory: 48, practical: 18 }, HMT: { theory: 50, practical: 18 } }
  },
  {
    id: "S011",
    name: "Mehnaz Parveen",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 84, ENG: 80, MAT: 88, PHY: { theory: 58, practical: 22 }, CHE: { theory: 60, practical: 21 }, BIO: { theory: 62, practical: 23 }, AGR: { theory: 60, practical: 22 } }
  },
  {
    id: "S012",
    name: "Shakil Khan",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 52, ENG: 48, MAT: 58, PHY: { theory: 36, practical: 14 }, CHE: { theory: 38, practical: 15 }, BIO: { theory: 40, practical: 14 }, HMT: { theory: 42, practical: 15 } }
  },
  {
    id: "S013",
    name: "Nafisa Kamal",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 71, ENG: 66, MAT: 79, PHY: { theory: 48, practical: 19 }, CHE: { theory: 49, practical: 18 }, BIO: { theory: 53, practical: 20 }, AGR: { theory: 54, practical: 19 } }
  },
  {
    id: "S014",
    name: "Zubair Al Mahmud",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 89, ENG: 85, MAT: 92, PHY: { theory: 64, practical: 23 }, CHE: { theory: 62, practical: 22 }, BIO: { theory: 66, practical: 24 }, HMT: { theory: 65, practical: 23 } }
  },
  {
    id: "S015",
    name: "Raihana Fariha",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 58, ENG: 54, MAT: 60, PHY: { theory: 40, practical: 15 }, CHE: { theory: 42, practical: 16 }, BIO: { theory: 44, practical: 15 }, AGR: { theory: 46, practical: 16 } }
  },
  {
    id: "S016",
    name: "Sabbir Ahmed",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 42, ENG: 38, MAT: 45, PHY: { theory: 30, practical: 12 }, CHE: { theory: 32, practical: 11 }, BIO: { theory: 35, practical: 12 }, HMT: { theory: 38, practical: 13 } }
  },
  {
    id: "S017",
    name: "Sumaiya Binte Alam",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 76, ENG: 72, MAT: 80, PHY: { theory: 54, practical: 20 }, CHE: { theory: 52, practical: 19 }, BIO: { theory: 56, practical: 21 }, AGR: { theory: 58, practical: 20 } }
  },
  {
    id: "S018",
    name: "Kazi Ashiqur Rahman",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 81, ENG: 78, MAT: 86, PHY: { theory: 56, practical: 21 }, CHE: { theory: 58, practical: 22 }, BIO: { theory: 60, practical: 22 }, HMT: { theory: 62, practical: 23 } }
  },
  {
    id: "S019",
    name: "Ishrat Zahan",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 64, ENG: 60, MAT: 68, PHY: { theory: 42, practical: 16 }, CHE: { theory: 44, practical: 17 }, BIO: { theory: 46, practical: 18 }, AGR: { theory: 48, practical: 17 } }
  },
  {
    id: "S020",
    name: "Moinul Haque",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 73, ENG: 68, MAT: 77, PHY: { theory: 49, practical: 18 }, CHE: { theory: 51, practical: 19 }, BIO: { theory: 53, practical: 20 }, HMT: { theory: 55, practical: 19 } }
  },
  {
    id: "S021",
    name: "Tahmina Khatun",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 86, ENG: 82, MAT: 90, PHY: { theory: 60, practical: 22 }, CHE: { theory: 62, practical: 23 }, BIO: { theory: 64, practical: 23 }, AGR: { theory: 62, practical: 22 } }
  },
  {
    id: "S022",
    name: "Ariful Islam",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 49, ENG: 44, MAT: 50, PHY: { theory: 32, practical: 12 }, CHE: { theory: 34, practical: 13 }, BIO: { theory: 36, practical: 13 }, HMT: { theory: 38, practical: 14 } }
  },
  {
    id: "S023",
    name: "Tasnim Begum",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 79, ENG: 75, MAT: 83, PHY: { theory: 55, practical: 21 }, CHE: { theory: 53, practical: 20 }, BIO: { theory: 57, practical: 21 }, AGR: { theory: 59, practical: 22 } }
  },
  {
    id: "S024",
    name: "Rakibul Hasan",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 67, ENG: 63, MAT: 72, PHY: { theory: 46, practical: 17 }, CHE: { theory: 47, practical: 18 }, BIO: { theory: 49, practical: 18 }, HMT: { theory: 52, practical: 19 } }
  },
  {
    id: "S025",
    name: "Humayun Kabir",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 55, ENG: 50, MAT: 62, PHY: { theory: 38, practical: 15 }, CHE: { theory: 40, practical: 15 }, BIO: { theory: 42, practical: 16 }, AGR: { theory: 44, practical: 16 } }
  },
  {
    id: "S026",
    name: "Jannatul Ferdous",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 88, ENG: 84, MAT: 94, PHY: { theory: 63, practical: 24 }, CHE: { theory: 61, practical: 23 }, BIO: { theory: 65, practical: 24 }, HMT: { theory: 64, practical: 23 } }
  },
  {
    id: "S027",
    name: "Monirul Islam",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 61, ENG: 57, MAT: 66, PHY: { theory: 41, practical: 16 }, CHE: { theory: 43, practical: 16 }, BIO: { theory: 45, practical: 17 }, AGR: { theory: 47, practical: 17 } }
  },
  {
    id: "S028",
    name: "Fatema Tuz Zohra",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 75, ENG: 71, MAT: 78, PHY: { theory: 51, practical: 19 }, CHE: { theory: 53, practical: 20 }, BIO: { theory: 55, practical: 20 }, HMT: { theory: 57, practical: 20 } }
  },
  {
    id: "S029",
    name: "Mahbubur Rahman",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 82, ENG: 79, MAT: 87, PHY: { theory: 57, practical: 22 }, CHE: { theory: 59, practical: 21 }, BIO: { theory: 61, practical: 22 }, AGR: { theory: 60, practical: 21 } }
  },
  {
    id: "S030",
    name: "Sharmin Sultana",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 46, ENG: 40, MAT: 48, PHY: { theory: 28, practical: 10 }, CHE: { theory: 30, practical: 11 }, BIO: { theory: 32, practical: 11 }, HMT: { theory: 34, practical: 12 } }
  },
  {
    id: "S031",
    name: "Golam Mostafa",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 70, ENG: 65, MAT: 76, PHY: { theory: 47, practical: 18 }, CHE: { theory: 49, practical: 18 }, BIO: { theory: 51, practical: 19 }, AGR: { theory: 53, practical: 19 } }
  },
  {
    id: "S032",
    name: "Rabeya Basri",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 87, ENG: 83, MAT: 91, PHY: { theory: 61, practical: 23 }, CHE: { theory: 60, practical: 22 }, BIO: { theory: 63, practical: 23 }, HMT: { theory: 66, practical: 24 } }
  },
  {
    id: "S033",
    name: "Delwar Hossain",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 59, ENG: 55, MAT: 63, PHY: { theory: 39, practical: 15 }, CHE: { theory: 41, practical: 15 }, BIO: { theory: 43, practical: 16 }, AGR: { theory: 45, practical: 16 } }
  },
  {
    id: "S034",
    name: "Shirin Akter",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 77, ENG: 73, MAT: 81, PHY: { theory: 53, practical: 20 }, CHE: { theory: 54, practical: 20 }, BIO: { theory: 57, practical: 21 }, HMT: { theory: 58, practical: 21 } }
  },
  {
    id: "S035",
    name: "Asaduzzaman Noor",
    class: "Class 9",
    optional: "AGR",
    marks: { BAN: 66, ENG: 61, MAT: 71, PHY: { theory: 45, practical: 17 }, CHE: { theory: 47, practical: 17 }, BIO: { theory: 49, practical: 18 }, AGR: { theory: 51, practical: 18 } }
  },
  {
    id: "S036",
    name: "Nasrin Akhter",
    class: "Class 9",
    optional: "HMT",
    marks: { BAN: 83, ENG: 80, MAT: 89, PHY: { theory: 59, practical: 22 }, CHE: { theory: 61, practical: 22 }, BIO: { theory: 62, practical: 23 }, HMT: { theory: 63, practical: 22 } }
  },

  // ==========================================
  // CLASS 10 REGULAR BATCH (28 Students: S037 to S064)
  // ==========================================
  {
    id: "S037",
    name: "Kamrul Hasan",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 74, ENG: 70, MAT: 78, PHY: { theory: 51, practical: 19 }, CHE: { theory: 53, practical: 19 }, BIO: { theory: 55, practical: 20 }, AGR: { theory: 57, practical: 20 } }
  },
  {
    id: "S038",
    name: "Laila Arjumand",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 85, ENG: 81, MAT: 93, PHY: { theory: 62, practical: 23 }, CHE: { theory: 60, practical: 22 }, BIO: { theory: 64, practical: 23 }, HMT: { theory: 65, practical: 24 } }
  },
  {
    id: "S039",
    name: "Shahidul Alam",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 63, ENG: 59, MAT: 67, PHY: { theory: 43, practical: 16 }, CHE: { theory: 45, practical: 17 }, BIO: { theory: 47, practical: 17 }, AGR: { theory: 49, practical: 18 } }
  },
  {
    id: "S040",
    name: "Rumana Yesmin",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 91, ENG: 88, MAT: 96, PHY: { theory: 66, practical: 24 }, CHE: { theory: 64, practical: 23 }, BIO: { theory: 68, practical: 25 }, HMT: { theory: 67, practical: 24 } }
  },
  {
    id: "S041",
    name: "Enamul Haque",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 53, ENG: 47, MAT: 56, PHY: { theory: 35, practical: 13 }, CHE: { theory: 37, practical: 14 }, BIO: { theory: 39, practical: 14 }, AGR: { theory: 41, practical: 15 } }
  },
  {
    id: "S042",
    name: "Farzana Boby",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 80, ENG: 76, MAT: 84, PHY: { theory: 56, practical: 21 }, CHE: { theory: 57, practical: 21 }, BIO: { theory: 59, practical: 22 }, HMT: { theory: 61, practical: 22 } }
  },
  {
    id: "S043",
    name: "Jashim Uddin",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 68, ENG: 64, MAT: 73, PHY: { theory: 47, practical: 18 }, CHE: { theory: 48, practical: 18 }, BIO: { theory: 50, practical: 19 }, AGR: { theory: 52, practical: 19 } }
  },
  {
    id: "S044",
    name: "Tahmina Akter",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 87, ENG: 83, MAT: 90, PHY: { theory: 60, practical: 22 }, CHE: { theory: 62, practical: 23 }, BIO: { theory: 63, practical: 23 }, HMT: { theory: 64, practical: 23 } }
  },
  {
    id: "S045",
    name: "Sirajul Islam",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 57, ENG: 52, MAT: 61, PHY: { theory: 38, practical: 15 }, CHE: { theory: 40, practical: 15 }, BIO: { theory: 42, practical: 16 }, AGR: { theory: 44, practical: 16 } }
  },
  {
    id: "S046",
    name: "Nusrat Jahan Chowdhury",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 78, ENG: 74, MAT: 82, PHY: { theory: 54, practical: 20 }, CHE: { theory: 55, practical: 20 }, BIO: { theory: 58, practical: 21 }, HMT: { theory: 60, practical: 22 } }
  },
  {
    id: "S047",
    name: "Babul Mia",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 62, ENG: 56, MAT: 65, PHY: { theory: 42, practical: 16 }, CHE: { theory: 44, practical: 16 }, BIO: { theory: 46, practical: 17 }, AGR: { theory: 48, practical: 17 } }
  },
  {
    id: "S048",
    name: "Nazmun Nahar",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 89, ENG: 86, MAT: 94, PHY: { theory: 64, practical: 24 }, CHE: { theory: 63, practical: 23 }, BIO: { theory: 67, practical: 24 }, HMT: { theory: 68, practical: 24 } }
  },
  {
    id: "S049",
    name: "Shahadat Hossain",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 70, ENG: 66, MAT: 75, PHY: { theory: 48, practical: 18 }, CHE: { theory: 50, practical: 19 }, BIO: { theory: 52, practical: 19 }, AGR: { theory: 54, practical: 20 } }
  },
  {
    id: "S050",
    name: "Sabina Yasmin",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 82, ENG: 78, MAT: 86, PHY: { theory: 57, practical: 21 }, CHE: { theory: 58, practical: 22 }, BIO: { theory: 60, practical: 22 }, HMT: { theory: 62, practical: 23 } }
  },
  {
    id: "S051",
    name: "Al Amin",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 48, ENG: 42, MAT: 51, PHY: { theory: 31, practical: 12 }, CHE: { theory: 33, practical: 13 }, BIO: { theory: 35, practical: 13 }, AGR: { theory: 37, practical: 14 } }
  },
  {
    id: "S052",
    name: "Rokeya Sultana",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 76, ENG: 72, MAT: 80, PHY: { theory: 52, practical: 20 }, CHE: { theory: 54, practical: 20 }, BIO: { theory: 56, practical: 21 }, HMT: { theory: 58, practical: 21 } }
  },
  {
    id: "S053",
    name: "Mizanur Rahman",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 65, ENG: 61, MAT: 70, PHY: { theory: 45, practical: 17 }, CHE: { theory: 46, practical: 17 }, BIO: { theory: 48, practical: 18 }, AGR: { theory: 50, practical: 18 } }
  },
  {
    id: "S054",
    name: "Afroza Parveen",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 84, ENG: 81, MAT: 88, PHY: { theory: 59, practical: 22 }, CHE: { theory: 60, practical: 22 }, BIO: { theory: 63, practical: 23 }, HMT: { theory: 64, practical: 23 } }
  },
  {
    id: "S055",
    name: "Azizul Haque",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 56, ENG: 51, MAT: 60, PHY: { theory: 37, practical: 14 }, CHE: { theory: 39, practical: 15 }, BIO: { theory: 41, practical: 15 }, AGR: { theory: 43, practical: 16 } }
  },
  {
    id: "S056",
    name: "Shamima Nasrin",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 79, ENG: 75, MAT: 83, PHY: { theory: 55, practical: 21 }, CHE: { theory: 56, practical: 21 }, BIO: { theory: 58, practical: 22 }, HMT: { theory: 61, practical: 22 } }
  },
  {
    id: "S057",
    name: "Rezaul Karim",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 69, ENG: 65, MAT: 74, PHY: { theory: 48, practical: 18 }, CHE: { theory: 49, practical: 18 }, BIO: { theory: 51, practical: 19 }, AGR: { theory: 53, practical: 19 } }
  },
  {
    id: "S058",
    name: "Bilkis Banu",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 88, ENG: 84, MAT: 92, PHY: { theory: 63, practical: 23 }, CHE: { theory: 62, practical: 23 }, BIO: { theory: 65, practical: 24 }, HMT: { theory: 66, practical: 24 } }
  },
  {
    id: "S059",
    name: "Jahidul Islam",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 60, ENG: 55, MAT: 64, PHY: { theory: 40, practical: 15 }, CHE: { theory: 42, practical: 16 }, BIO: { theory: 44, practical: 16 }, AGR: { theory: 46, practical: 17 } }
  },
  {
    id: "S060",
    name: "Maksuda Begum",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 77, ENG: 73, MAT: 81, PHY: { theory: 53, practical: 20 }, CHE: { theory: 55, practical: 20 }, BIO: { theory: 57, practical: 21 }, HMT: { theory: 59, practical: 21 } }
  },
  {
    id: "S061",
    name: "Abdur Rahim",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 51, ENG: 45, MAT: 54, PHY: { theory: 34, practical: 13 }, CHE: { theory: 36, practical: 14 }, BIO: { theory: 38, practical: 14 }, AGR: { theory: 40, practical: 15 } }
  },
  {
    id: "S062",
    name: "Zinat Ara",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 83, ENG: 80, MAT: 87, PHY: { theory: 58, practical: 22 }, CHE: { theory: 59, practical: 22 }, BIO: { theory: 61, practical: 23 }, HMT: { theory: 63, practical: 23 } }
  },
  {
    id: "S063",
    name: "Golam Rabbani",
    class: "Class 10",
    optional: "AGR",
    marks: { BAN: 67, ENG: 62, MAT: 71, PHY: { theory: 46, practical: 17 }, CHE: { theory: 47, practical: 18 }, BIO: { theory: 49, practical: 18 }, AGR: { theory: 52, practical: 19 } }
  },
  {
    id: "S064",
    name: "Farhana Parveen",
    class: "Class 10",
    optional: "HMT",
    marks: { BAN: 86, ENG: 82, MAT: 91, PHY: { theory: 61, practical: 23 }, CHE: { theory: 62, practical: 23 }, BIO: { theory: 64, practical: 24 }, HMT: { theory: 65, practical: 24 } }
  },
];
