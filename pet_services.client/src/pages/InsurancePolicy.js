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
    <div className="appointment-container mt-12 mb-20 mx-auto px-4 lg:px-8 max-w-screen-md border-[#F7ECE9] border-4 rounded-2xl">
      <div className="insurance-policy-container">
        <h2 className="text-center mb-4">Insurance Details</h2>
  
        <div className="flex justify-evenly mb-4">
          {/* Select Insurance Type */}
          <div>
            <label htmlFor="insuranceType" className="block">Select Insurance Type:</label>
            <select
              id="insuranceType"
              value={insuranceType}
              onChange={(e) => {
                setInsuranceType(e.target.value);
                setValidationMessage(''); // Clear previous validation message
              }}
              className="border-black border-2 rounded-lg p-1 w-48 text-left"
              required
            >
              <option value="">-- Choose Insurance --</option>
              <option value="PetSecure">PetSecure</option>
              <option value="HealthyPets">HealthyPets</option>
              <option value="None">None</option>
            </select>
          </div>
  
          {/* Enter Policy ID */}
          {insuranceType !== 'None' && (
            <div>
              <label htmlFor="policyId" className="block">Enter Policy ID:</label>
              <input
                type="text"
                id="policyId"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                required
                className="border-black border-2 rounded-lg p-1 w-48 text-left bg-gray-100 text-gray-500"
              />
            </div>
          )}
        </div>
  
        {/* Validate Insurance Button */}
        <div className="flex justify-end p-2">
          <button
            type="button"
            onClick={handleValidation}
            className={`bg-[#FFEDEC] border-black border-2 rounded-md px-4 py-1 ${
              insuranceType && policyId ? "hover:bg-[#F7ECE9]" : "cursor-not-allowed"
            }`}
            disabled={!insuranceType || (!policyId && insuranceType !== 'None')} // Disable if conditions are not met
          >
            Validate Insurance
          </button>
        </div>
  
        {/* Validation Message */}
        {validationMessage && (
          <p
            className={`mt-4 text-sm font-medium ${
              isValid ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {validationMessage}
          </p>
        )}
      </div>
    </div>
  );
  
};

export default InsurancePolicy;
