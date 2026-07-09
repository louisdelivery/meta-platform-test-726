import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import slugify from 'slugify';

export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function truncateDate(date: Date): Date {
  const truncated = new Date(date);
  truncated.setHours(0, 0, 0, 0);
  return truncated;
}

export function parseDateAsLocalMidnight(input: string): Date {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date input: ${input}`);
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainPassword, salt);
  } catch {
    throw new Error('Erreur lors du hash du mot de passe');
  }
};

export const generateMatricule = (role: string): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const roleCode =
    {
      SUPER_ADMIN: 'ADM',
      SCHOOL_ADMIN: 'SCH',
      TEACHER: 'TCH',
      PARENT: 'PAR',
      STUDENT: 'STD',
      SCHOOL: 'SH',
      ACADEMIC_LEVEL: 'AL',
      SCHOOL_TEACHER: 'TE',
      ACADEMIC_YEAR: 'AY',
      SCHOOL_CLASS: 'CL',
      SCHOOL_TAUGHT_SUBJECT: 'TS',
      PAYMENT_CONFIG: 'PC',
      STUDENT_PAYMENT: 'SP',
      PAYMENT_DISCOUNT: 'PD',
      META_ACCOUNT: 'MA',
      PHONE_NUMBER: 'PN',
      CONTACT: 'CT',
      CONVERSATION: 'CV',
      MESSAGE: 'MS',
      MEDIA: 'MD',
      WEBHOOK_EVENT: 'WE',
      TEMPLATE: 'TP',
      API_LOG: 'AL',
    }[role] || 'E';

  const unique = randomBytes(2).toString('hex').toUpperCase();
  return `${year}${roleCode}${unique}`;
};

export const extractUserProfile = (account: any) => {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    role: account.role,
    firstName: account.firstName,
    lastName: account.lastName,
    gender: account.gender,
    photo: account.photo,
    birthDate: account.birthDate,
    emailConfirmed: account.emailConfirmed,
    lastLogin: account.lastLogin,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    matricule: account.matricule,
    phoneNumber: account.phoneNumber,
    city: account.city,
    region: account.region,
    blocked: account.blocked,
    lockedUntil: account.lockedUntil,
    notes: account.notes,
    userPermissions: account.userPermissions || [],
    rolePermissions: account.rolePermissions || [],
    schools: account.schools || [],
  };
};

export const getSlug = (title: string) => {
  return slugify(title, { lower: true });
};

export function parsePagination(filter: { page?: number; limit?: number }) {
  const page = Math.max(1, Number(filter.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filter.limit) || 10));
  return { page, limit, skip: (page - 1) * limit };
}
