import React from 'react';
import { BIODATA_FORM_SCHEMA } from '@/i18n/schema';
import { getLanguageConfig, LanguageCode } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface DynamicFormProps {
  dict: any;
  langCode: LanguageCode;
}

export function DynamicForm({ dict, langCode }: DynamicFormProps) {
  const langConfig = getLanguageConfig(langCode);
  const dir = langConfig.dir; // 'ltr' or 'rtl'
  
  // Font class selection (Next.js fonts would be imported in layout, but we apply classes here if needed)
  // Example: We can add a data-lang attribute or specific font class based on langCode

  return (
    <form className="space-y-12 max-w-4xl mx-auto" dir={dir}>
      {BIODATA_FORM_SCHEMA.map((section) => (
        <div key={section.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-semibold leading-7 text-gray-900 mb-6 border-b pb-4">
            {dict[section.titleKey] || section.titleKey}
          </h3>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {section.fields.map((field) => {
              const label = dict[field.dictKey] || field.dictKey;
              
              return (
                <div key={field.id} className={cn("sm:col-span-3", field.type === 'textarea' ? 'sm:col-span-6' : '')}>
                  <label htmlFor={field.id} className="block text-sm font-medium leading-6 text-gray-900">
                    {label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="mt-2">
                    {field.type === 'text' || field.type === 'date' || field.type === 'time' ? (
                      <input
                        type={field.type}
                        name={field.id}
                        id={field.id}
                        required={field.required}
                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        name={field.id}
                        id={field.id}
                        required={field.required}
                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">{dict.ui?.selectLanguage ? `-- ${dict.ui.selectLanguage.split(' ')[0]} --` : '-- Select --'}</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option> // In a real app, 'opt' should also be translated!
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.id}
                        id={field.id}
                        rows={3}
                        required={field.required}
                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          {dict.ui?.back || 'Back'}
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {dict.ui?.submit || 'Generate Biodata'}
        </button>
      </div>
    </form>
  );
}
