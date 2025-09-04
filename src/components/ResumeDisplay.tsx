'use client';

import { ParsedResume } from '@/types';

interface ResumeDisplayProps {
  data: ParsedResume;
}

export default function ResumeDisplay({ data }: ResumeDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-gray-600">
          <span>{data.email}</span>
          <span>{data.phone}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">{exp.title}</h4>
              <p className="text-gray-600">{exp.company} • {exp.duration}</p>
              <p className="text-gray-700 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
        <div className="space-y-2">
          {data.education.map((edu, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution} • {edu.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}