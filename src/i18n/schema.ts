export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'time';

export interface BiodataField {
  id: string;
  dictKey: string;
  type: FieldType;
  options?: string[]; // If type is select
  required?: boolean;
}

export interface BiodataSection {
  id: string;
  titleKey: string;
  fields: BiodataField[];
}

export const BIODATA_FORM_SCHEMA: BiodataSection[] = [
  {
    id: 'personal',
    titleKey: 'personalDetails',
    fields: [
      { id: 'fullName', dictKey: 'fullName', type: 'text', required: true },
      { id: 'gender', dictKey: 'gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'dob', dictKey: 'dob', type: 'date', required: true },
      { id: 'birthTime', dictKey: 'birthTime', type: 'time' },
      { id: 'birthPlace', dictKey: 'birthPlace', type: 'text' },
      { id: 'height', dictKey: 'height', type: 'text' },
      { id: 'weight', dictKey: 'weight', type: 'text' },
      { id: 'bloodGroup', dictKey: 'bloodGroup', type: 'text' },
      { id: 'complexion', dictKey: 'complexion', type: 'text' },
      { id: 'religion', dictKey: 'religion', type: 'text' },
      { id: 'caste', dictKey: 'caste', type: 'text' },
      { id: 'subCaste', dictKey: 'subCaste', type: 'text' },
      { id: 'gotra', dictKey: 'gotra', type: 'text' },
      { id: 'nakshatra', dictKey: 'nakshatra', type: 'text' },
      { id: 'rashi', dictKey: 'rashi', type: 'text' },
      { id: 'manglik', dictKey: 'manglik', type: 'select', options: ['Yes', 'No', 'Not Sure'] },
      { id: 'maritalStatus', dictKey: 'maritalStatus', type: 'select', options: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'] },
      { id: 'motherTongue', dictKey: 'motherTongue', type: 'text' },
    ]
  },
  {
    id: 'educationCareer',
    titleKey: 'educationCareer',
    fields: [
      { id: 'education', dictKey: 'education', type: 'text' },
      { id: 'occupation', dictKey: 'occupation', type: 'text' },
      { id: 'companyBusiness', dictKey: 'companyBusiness', type: 'text' },
      { id: 'annualIncome', dictKey: 'annualIncome', type: 'text' },
      { id: 'workLocation', dictKey: 'workLocation', type: 'text' },
    ]
  },
  {
    id: 'family',
    titleKey: 'familyDetails',
    fields: [
      { id: 'fatherName', dictKey: 'fatherName', type: 'text' },
      { id: 'fatherOccupation', dictKey: 'fatherOccupation', type: 'text' },
      { id: 'motherName', dictKey: 'motherName', type: 'text' },
      { id: 'motherOccupation', dictKey: 'motherOccupation', type: 'text' },
      { id: 'brothers', dictKey: 'brothers', type: 'text' },
      { id: 'sisters', dictKey: 'sisters', type: 'text' },
      { id: 'familyType', dictKey: 'familyType', type: 'select', options: ['Nuclear', 'Joint'] },
      { id: 'nativePlace', dictKey: 'nativePlace', type: 'text' },
      { id: 'currentAddress', dictKey: 'currentAddress', type: 'textarea' },
    ]
  },
  {
    id: 'partner',
    titleKey: 'partnerExpectations',
    fields: [
      { id: 'expectedEducation', dictKey: 'expectedEducation', type: 'text' },
      { id: 'expectedOccupation', dictKey: 'expectedOccupation', type: 'text' },
      { id: 'expectedLocation', dictKey: 'expectedLocation', type: 'text' },
      { id: 'otherExpectations', dictKey: 'otherExpectations', type: 'textarea' },
    ]
  },
  {
    id: 'contact',
    titleKey: 'contactDetails',
    fields: [
      { id: 'contactPerson', dictKey: 'contactPerson', type: 'text' },
      { id: 'mobileNumber', dictKey: 'mobileNumber', type: 'text', required: true },
      { id: 'email', dictKey: 'email', type: 'text' },
      { id: 'address', dictKey: 'address', type: 'textarea' },
    ]
  },
  {
    id: 'other',
    titleKey: 'other',
    fields: [
      { id: 'aboutMe', dictKey: 'aboutMe', type: 'textarea' },
      { id: 'hobbies', dictKey: 'hobbies', type: 'textarea' },
      { id: 'additionalInfo', dictKey: 'additionalInfo', type: 'textarea' },
    ]
  }
];
