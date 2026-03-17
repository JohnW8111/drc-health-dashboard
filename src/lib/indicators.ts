export type Dimension =
  | "population-health"
  | "access-quality"
  | "resources-efficiency";

export type ApiSource = "dhs" | "worldbank" | "who-gho" | "unicef";

export interface Indicator {
  id: string;
  name: string;
  dimension: Dimension;
  unit: string;
  definition: string;
  apiSource: ApiSource;
  apiCode: string;
  backupSource?: ApiSource;
  backupCode?: string;
  hasSubnational: boolean;
  higherIsBetter: boolean;
  ssaBenchmark?: number; // Sub-Saharan Africa average for traffic-light
  sourceUrl: string;
}

export const DIMENSION_LABELS: Record<Dimension, string> = {
  "population-health": "Population Health",
  "access-quality": "Access & Quality of Care",
  "resources-efficiency": "Health System Resources & Efficiency",
};

export const DIMENSION_COLORS: Record<Dimension, string> = {
  "population-health": "#2563eb",
  "access-quality": "#059669",
  "resources-efficiency": "#d97706",
};

export const indicators: Indicator[] = [
  // ── Population Health (12) ──
  {
    id: "life-expectancy",
    name: "Life Expectancy at Birth",
    dimension: "population-health",
    unit: "years",
    definition:
      "Average number of years a newborn is expected to live if current mortality rates continue.",
    apiSource: "worldbank",
    apiCode: "SP.DYN.LE00.IN",
    hasSubnational: false,
    higherIsBetter: true,
    ssaBenchmark: 61,
    sourceUrl:
      "https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=CD",
  },
  {
    id: "under5-mortality",
    name: "Under-5 Mortality Rate",
    dimension: "population-health",
    unit: "per 1,000 live births",
    definition:
      "Probability of dying between birth and exactly 5 years of age, per 1,000 live births.",
    apiSource: "dhs",
    apiCode: "CM_ECMT_C_U5M",
    hasSubnational: true,
    higherIsBetter: false,
    ssaBenchmark: 74,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "infant-mortality",
    name: "Infant Mortality Rate",
    dimension: "population-health",
    unit: "per 1,000 live births",
    definition:
      "Probability of dying between birth and exactly 1 year of age, per 1,000 live births.",
    apiSource: "dhs",
    apiCode: "CM_ECMT_C_IMR",
    backupSource: "worldbank",
    backupCode: "SP.DYN.IMRT.IN",
    hasSubnational: true,
    higherIsBetter: false,
    ssaBenchmark: 49,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "neonatal-mortality",
    name: "Neonatal Mortality Rate",
    dimension: "population-health",
    unit: "per 1,000 live births",
    definition:
      "Probability of dying within the first 28 days of life, per 1,000 live births.",
    apiSource: "dhs",
    apiCode: "CM_ECMT_C_NNR",
    hasSubnational: true,
    higherIsBetter: false,
    ssaBenchmark: 27,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "maternal-mortality",
    name: "Maternal Mortality Ratio",
    dimension: "population-health",
    unit: "per 100,000 live births",
    definition:
      "Number of maternal deaths per 100,000 live births during a given time period.",
    apiSource: "worldbank",
    apiCode: "SH.STA.MMRT",
    hasSubnational: false,
    higherIsBetter: false,
    ssaBenchmark: 536,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.STA.MMRT?locations=CD",
  },
  {
    id: "hiv-prevalence",
    name: "HIV Prevalence (15-49)",
    dimension: "population-health",
    unit: "%",
    definition:
      "Percentage of population ages 15-49 who are living with HIV.",
    apiSource: "dhs",
    apiCode: "HA_HIVP_B_HIV",
    hasSubnational: true,
    higherIsBetter: false,
    ssaBenchmark: 3.4,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "malaria-incidence",
    name: "Malaria Incidence",
    dimension: "population-health",
    unit: "per 1,000 at risk",
    definition:
      "Number of new malaria cases per 1,000 population at risk per year.",
    apiSource: "worldbank",
    apiCode: "SH.MLR.INCD.P3",
    hasSubnational: false,
    higherIsBetter: false,
    ssaBenchmark: 218,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.MLR.INCD.P3?locations=CD",
  },
  {
    id: "tb-incidence",
    name: "TB Incidence",
    dimension: "population-health",
    unit: "per 100,000",
    definition:
      "Estimated number of new and relapse tuberculosis cases per 100,000 population.",
    apiSource: "worldbank",
    apiCode: "SH.TBS.INCD",
    hasSubnational: false,
    higherIsBetter: false,
    ssaBenchmark: 212,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.TBS.INCD?locations=CD",
  },
  {
    id: "stunting",
    name: "Stunting Prevalence (Under 5)",
    dimension: "population-health",
    unit: "%",
    definition:
      "Percentage of children under 5 whose height-for-age is below minus 2 standard deviations from the median.",
    apiSource: "dhs",
    apiCode: "CN_NUTS_C_HA2",
    hasSubnational: true,
    higherIsBetter: false,
    ssaBenchmark: 32,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "wasting",
    name: "Wasting Prevalence (Under 5)",
    dimension: "population-health",
    unit: "%",
    definition:
      "Percentage of children under 5 whose weight-for-height is below minus 2 standard deviations from the median.",
    apiSource: "dhs",
    apiCode: "CN_NUTS_C_WH2",
    hasSubnational: true,
    higherIsBetter: false,
    ssaBenchmark: 6,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "dpt3-coverage",
    name: "DPT3/Penta3 Vaccination Coverage",
    dimension: "population-health",
    unit: "%",
    definition:
      "Percentage of surviving infants who received 3 doses of DPT-containing vaccine.",
    apiSource: "dhs",
    apiCode: "CH_VACS_C_DP3",
    backupSource: "worldbank",
    backupCode: "SH.IMM.IDPT",
    hasSubnational: true,
    higherIsBetter: true,
    ssaBenchmark: 72,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "contraceptive-prevalence",
    name: "Contraceptive Prevalence Rate",
    dimension: "population-health",
    unit: "%",
    definition:
      "Percentage of women of reproductive age (15-49) who are using (or whose partner is using) a contraceptive method.",
    apiSource: "dhs",
    apiCode: "FP_CUSA_W_ANY",
    hasSubnational: true,
    higherIsBetter: true,
    ssaBenchmark: 28,
    sourceUrl: "https://api.dhsprogram.com/",
  },

  // ── Access & Quality of Care (6) ──
  {
    id: "skilled-birth",
    name: "Skilled Birth Attendance",
    dimension: "access-quality",
    unit: "%",
    definition:
      "Percentage of live births attended by skilled health personnel (doctor, nurse, or midwife).",
    apiSource: "dhs",
    apiCode: "RH_DELA_C_SKP",
    hasSubnational: true,
    higherIsBetter: true,
    ssaBenchmark: 60,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "anc4-visits",
    name: "Antenatal Care (4+ Visits)",
    dimension: "access-quality",
    unit: "%",
    definition:
      "Percentage of women aged 15-49 with a live birth who received antenatal care 4 or more times.",
    apiSource: "dhs",
    apiCode: "RH_ANCN_W_N4P",
    hasSubnational: true,
    higherIsBetter: true,
    ssaBenchmark: 52,
    sourceUrl: "https://api.dhsprogram.com/",
  },
  {
    id: "facility-density",
    name: "Health Facility Density",
    dimension: "access-quality",
    unit: "per 10,000 pop",
    definition: "Number of health facilities per 10,000 population.",
    apiSource: "who-gho",
    apiCode: "HWF_0006",
    hasSubnational: false,
    higherIsBetter: true,
    sourceUrl: "https://www.who.int/data/gho",
  },
  {
    id: "physician-density",
    name: "Physician Density",
    dimension: "access-quality",
    unit: "per 10,000 pop",
    definition: "Number of physicians per 10,000 population.",
    apiSource: "worldbank",
    apiCode: "SH.MED.PHYS.ZS",
    hasSubnational: false,
    higherIsBetter: true,
    ssaBenchmark: 0.2,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.MED.PHYS.ZS?locations=CD",
  },
  {
    id: "nurse-midwife-density",
    name: "Nurse & Midwife Density",
    dimension: "access-quality",
    unit: "per 10,000 pop",
    definition: "Number of nurses and midwives per 10,000 population.",
    apiSource: "worldbank",
    apiCode: "SH.MED.NUMW.P3",
    hasSubnational: false,
    higherIsBetter: true,
    ssaBenchmark: 1.0,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.MED.NUMW.P3?locations=CD",
  },
  {
    id: "tb-treatment-success",
    name: "TB Treatment Success Rate",
    dimension: "access-quality",
    unit: "%",
    definition:
      "Percentage of new TB cases that were successfully treated (cured plus treatment completed).",
    apiSource: "worldbank",
    apiCode: "SH.TBS.CURE.ZS",
    hasSubnational: false,
    higherIsBetter: true,
    ssaBenchmark: 76,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.TBS.CURE.ZS?locations=CD",
  },

  // ── Health System Resources & Efficiency (5) ──
  {
    id: "health-expenditure-capita",
    name: "Health Expenditure per Capita",
    dimension: "resources-efficiency",
    unit: "USD",
    definition:
      "Current health expenditure per capita in current US dollars.",
    apiSource: "worldbank",
    apiCode: "SH.XPD.CHEX.PC.CD",
    hasSubnational: false,
    higherIsBetter: true,
    ssaBenchmark: 83,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.XPD.CHEX.PC.CD?locations=CD",
  },
  {
    id: "oop-expenditure",
    name: "Out-of-Pocket Expenditure (% of Health Spending)",
    dimension: "resources-efficiency",
    unit: "%",
    definition:
      "Out-of-pocket payments as a percentage of current health expenditure.",
    apiSource: "worldbank",
    apiCode: "SH.XPD.OOPC.CH.ZS",
    hasSubnational: false,
    higherIsBetter: false,
    ssaBenchmark: 33,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.XPD.OOPC.CH.ZS?locations=CD",
  },
  {
    id: "govt-health-expenditure",
    name: "Government Health Expenditure (% of GDP)",
    dimension: "resources-efficiency",
    unit: "%",
    definition:
      "Domestic general government health expenditure as a percentage of GDP.",
    apiSource: "worldbank",
    apiCode: "SH.XPD.GHED.GD.ZS",
    hasSubnational: false,
    higherIsBetter: true,
    ssaBenchmark: 1.9,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.XPD.GHED.GD.ZS?locations=CD",
  },
  {
    id: "external-health-expenditure",
    name: "External Health Expenditure (% of Total)",
    dimension: "resources-efficiency",
    unit: "%",
    definition:
      "External health expenditure as a percentage of current health expenditure.",
    apiSource: "worldbank",
    apiCode: "SH.XPD.EHEX.CH.ZS",
    hasSubnational: false,
    higherIsBetter: false,
    ssaBenchmark: 12,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.XPD.EHEX.CH.ZS?locations=CD",
  },
  {
    id: "hospital-beds",
    name: "Hospital Bed Density",
    dimension: "resources-efficiency",
    unit: "per 1,000 pop",
    definition: "Number of hospital beds per 1,000 population.",
    apiSource: "worldbank",
    apiCode: "SH.MED.BEDS.ZS",
    hasSubnational: false,
    higherIsBetter: true,
    ssaBenchmark: 1.0,
    sourceUrl:
      "https://data.worldbank.org/indicator/SH.MED.BEDS.ZS?locations=CD",
  },
];

export function getIndicatorsByDimension(dimension: Dimension): Indicator[] {
  return indicators.filter((i) => i.dimension === dimension);
}

export function getIndicatorById(id: string): Indicator | undefined {
  return indicators.find((i) => i.id === id);
}

export function getSubnationalIndicators(): Indicator[] {
  return indicators.filter((i) => i.hasSubnational);
}
