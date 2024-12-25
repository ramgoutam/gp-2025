import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateExaminationPDF = async (formData: any) => {
  console.log("Generating PDF for examination data:", formData);
  
  // Create a temporary div to render the content
  const element = document.createElement('div');
  element.className = 'p-6 space-y-6 bg-white';
  
  // Create the content HTML
  element.innerHTML = `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold mb-4">Head and Neck Examination Report</h2>
        <p class="text-gray-600">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      ${formData.vital_signs ? `
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Vital Signs</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            ${Object.entries(formData.vital_signs).map(([key, value]) => `
              <div class="mb-2">
                <span class="font-medium">${key.replace(/_/g, ' ').toUpperCase()}: </span>
                <span>${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${formData.medical_history ? `
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Medical History</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            ${Object.entries(formData.medical_history).map(([key, value]) => `
              <div class="mb-2">
                <span class="font-medium">${key.replace(/_/g, ' ').toUpperCase()}: </span>
                <span>${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${formData.chief_complaints ? `
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Chief Complaints</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            ${Object.entries(formData.chief_complaints).map(([key, value]) => `
              <div class="mb-2">
                <span class="font-medium">${key.replace(/_/g, ' ').toUpperCase()}: </span>
                <span>${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${formData.evaluation_notes ? `
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Evaluation Notes</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p>${formData.evaluation_notes}</p>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Append to body temporarily
  document.body.appendChild(element);

  try {
    // Generate PDF
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('examination-report.pdf');

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Clean up
    document.body.removeChild(element);
  }
};