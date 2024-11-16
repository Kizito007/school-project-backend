export enum KeyType {
  ALPHANUMERIC = 'ALPHANUMERIC',
  NUMERIC = 'NUMERIC',
  UPPER_ALPHANUMERIC = 'UPPER_ALPHANUMERIC',
}

export enum MimeType {
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
}

export enum Departments {
  IT = 'IT',
  BUSINESS = 'BUSINESS',
  HR = 'HR',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  ENGINEERING = 'ENGINEERING',
  FINANCE = 'FINANCE',
  CLEANING = 'CLEANING',
}

export enum ArrivalStatus {
  EARLY = 'EARLY',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  ONTIME = 'ONTIME',
}

export const departmentsSchedule = {
  IT: {
    scheduleIn: '9:00',
    scheduleOut: '17:00',
  },
  BUSINESS: {
    scheduleIn: '9:00',
    scheduleOut: '17:00',
  },
  HR: {
    scheduleIn: '8:00',
    scheduleOut: '17:00',
  },
  ADMINISTRATIVE: {
    scheduleIn: '10:00',
    scheduleOut: '17:00',
  },
  ENGINEERING: {
    scheduleIn: '9:00',
    scheduleOut: '17:00',
  },
  FINANCE: {
    scheduleIn: '9:00',
    scheduleOut: '17:00',
  },
  CLEANING: {
    scheduleIn: '7:00',
    scheduleOut: '17:00',
  },
};
