import React, { useState } from 'react';

const InsurancePolicy = ({ onInsuranceValidated }) => {
  const [insuranceType, setInsuranceType] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleValidation = async () => {
    if (insuranceType === 'None') {
      setValidationMessage('No insurance was selected. Payment will be made onsite after the appointment.');
      setIsValid(true); // Allow the user to proceed without insurance
      onInsuranceValidated(true);
      return;
    }

    if (!policyId) {
      setValidationMessage('Please enter a policy ID to validate your insurance.');
      return;
    }

    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) throw new Error('No session token found. Please log in.');

      const response = await fetch(`http://localhost:5000/api/validate-insurance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ insuranceType, policyId }),
      });

      if (!response.ok) {
        setValidationMessage('Failed to validate insurance. Please check your details.');
        setIsValid(false);
        onInsuranceValidated(false);
        return;
      }

      const data = await response.json();
      if (data.isValid) {
        setValidationMessage(
          'Insurance validated successfully! A copayment of $25 will need to be paid, then insurance will cover up to 75% of the total amount.'
        );
        setIsValid(true);
        onInsuranceValidated(true);
      } else {
        setValidationMessage('Invalid insurance details. Please try again.');
        setIsValid(false);
        onInsuranceValidated(false);
      }
    } catch (error) {
      console.error('Error validating insurance:', error);
      setValidationMessage('An error occurred during validation. Please try again later.');
      setIsValid(false);
      onInsuranceValidated(false);
    }
  };

  return (
    <div className="insurance-policy-container">
      <h2>Insurance Details</h2>

      <label htmlFor="insuranceType">Select Insurance Type:</label>
      <select
        id="insuranceType"
        value={insuranceType}
        onChange={(e) => {
          setInsuranceType(e.target.value);
          setValidationMessage(''); // Clear previous validation message
        }}
        required
      >
        <option value="">-- Choose Insurance --</option>
        <option value="PetSecure">PetSecure</option>
        <option value="HealthyPets">HealthyPets</option>
        <option value="None">None</option>
      </select>

      {insuranceType !== 'None' && (
        <>
          <label htmlFor="policyId">Enter Policy ID:</label>
          <input
            type="text"
            id="policyId"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            required
          />
        </>
      )}

      <button type="button" onClick={handleValidation}>
        Validate Insurance
      </button>

      {validationMessage && <p className="validation-message">{validationMessage}</p>}
    </div>
  );
};

export default InsurancePolicy;
