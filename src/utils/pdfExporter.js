/**
 * PDF Exporter Utility
 * Captures the resume DOM node using html2canvas and compiles it into an A4 PDF document.
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPDF(elementId, actorName = 'resume') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Target DOM element #${elementId} not found.`);
  }

  try {
    // Generate a high-resolution canvas capture of the resume component
    const canvas = await html2canvas(element, {
      scale: 2.5, // Enhances sharpness for print
      useCORS: true, // Crucial for loading cross-origin Wikipedia/TMDb photos into the canvas
      allowTaint: false,
      logging: false,
      backgroundColor: '#0a0d14' // Match our theme background color
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Create standard A4 PDF: 210mm x 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Write image to fill the entire A4 sheet
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    
    // Format file name
    const formattedName = actorName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    pdf.save(`starcv_${formattedName}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error(`Failed to download PDF: ${error.message}`);
  }
}
