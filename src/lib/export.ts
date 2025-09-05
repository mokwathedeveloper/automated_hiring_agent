import { EnhancedAnalysis } from '@/types/enhanced-analysis';

interface ExportData {
  fileName: string;
  analysis: EnhancedAnalysis;
}

export async function exportToExcel(data: ExportData[]): Promise<Blob> {
  // For now, create CSV format (can be upgraded to XLSX later)
  const headers = [
    'Candidate Name',
    'File Name', 
    'Overall Score',
    'Technical Skills Score',
    'Experience Match',
    'Education Fit',
    'Cultural Fit',
    'Salary Expectation',
    'Availability',
    'Top Skills',
    'Strengths',
    'Weaknesses',
    'Recommendations'
  ];

  const rows = data.map(item => [
    item.analysis.technicalSkills[0]?.skill || 'N/A', // Placeholder for name
    item.fileName,
    item.analysis.overallScore,
    Math.round(item.analysis.technicalSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / item.analysis.technicalSkills.length || 0),
    item.analysis.experienceMatch,
    item.analysis.educationFit,
    item.analysis.culturalFit,
    item.analysis.salaryExpectation,
    item.analysis.availabilityDate,
    item.analysis.technicalSkills.slice(0, 3).map(s => s.skill).join(', '),
    item.analysis.strengths.join('; '),
    item.analysis.weaknesses.join('; '),
    item.analysis.recommendations.join('; ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

export async function exportToPDF(data: ExportData[]): Promise<Blob> {
  // Simple HTML to PDF conversion (can be upgraded with proper PDF library)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resume Analysis Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .candidate { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
        .score { font-size: 24px; font-weight: bold; color: #2563eb; }
        .section { margin: 10px 0; }
        .skills { display: flex; flex-wrap: wrap; gap: 5px; }
        .skill { background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Resume Analysis Report</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-NG')}</p>
      </div>
      
      ${data.map(item => `
        <div class="candidate">
          <h2>${item.fileName}</h2>
          <div class="score">Overall Score: ${item.analysis.overallScore}/100</div>
          
          <div class="section">
            <h3>Score Breakdown</h3>
            <p>Experience Match: ${item.analysis.experienceMatch}/100</p>
            <p>Education Fit: ${item.analysis.educationFit}/100</p>
            <p>Cultural Fit: ${item.analysis.culturalFit}/100</p>
          </div>
          
          <div class="section">
            <h3>Technical Skills</h3>
            <div class="skills">
              ${item.analysis.technicalSkills.map(skill => 
                `<span class="skill">${skill.skill} (${skill.proficiency}%)</span>`
              ).join('')}
            </div>
          </div>
          
          <div class="section">
            <h3>Strengths</h3>
            <ul>${item.analysis.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          
          <div class="section">
            <h3>Areas for Improvement</h3>
            <ul>${item.analysis.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
          </div>
          
          <div class="section">
            <h3>Recommendations</h3>
            <ul>${item.analysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
          </div>
        </div>
      `).join('')}
    </body>
    </html>
  `;

  return new Blob([htmlContent], { type: 'text/html' });
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}