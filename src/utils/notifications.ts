// Notification helper functions
export const triggerPatientAddedNotification = (patientName: string) => {
  window.dispatchEvent(new CustomEvent('patient-added', {
    detail: { patientName }
  }));
};

export const triggerPatientDiagnosedNotification = (patientName: string, diagnosis: string) => {
  window.dispatchEvent(new CustomEvent('patient-diagnosed', {
    detail: { patientName, diagnosis }
  }));
};

export const triggerRiskAssessmentNotification = (patientName: string, riskLevel: string) => {
  window.dispatchEvent(new CustomEvent('risk-assessment', {
    detail: { patientName, riskLevel }
  }));
};

// Risk değerlendirmesi sonucu bildirim göster
export const showRiskAssessmentResult = (patientName: string, riskLevel: 'low' | 'medium' | 'high') => {
  const riskLevelText = {
    low: 'Düşük Risk',
    medium: 'Orta Risk', 
    high: 'Yüksek Risk'
  };

  const emoji = {
    low: '✅',
    medium: '⚠️',
    high: '🚨'
  };

  triggerRiskAssessmentNotification(patientName, `${emoji[riskLevel]} ${patientName} için risk değerlendirmesi: ${riskLevelText[riskLevel]}`);
}; 