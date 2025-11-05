import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import './FAREQuestionnaire.css';

const QUESTIONS = [
  {
    id: 'clinical_exception',
    section: 1,
    text: 'Was DCFS Clinical or child\'s therapist consulted for an exception to completing the FARE for this youth\'s move and did DCFS Clinical or child\'s therapist approve a clinical exception? If yes, please provide contact information and date of the exception consultation in text box.',
    category: 'HB4304 FARE contraindicators',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        endInterview: true,
        allowInterviewerComment: true,
        requireInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: 'child_refusal',
    section: 2,
    text: 'Did the child refuse to complete the questionnaire? If yes, please provide the date and time the questionnaire was attempted in text box.',
    category: 'HB4304 FARE contraindicators',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        endInterview: true,
        allowYouthComment: true,
        allowInterviewerComment: true,
        requireInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: '14day_notice',
    section: 3,
    text: 'Was this move a result of 14-Day Notice? If yes, please indicate in text box if foster parent provided notice and date or if the agency issued notice of decision and date notice of decision provided to the foster parent in text box.',
    category: 'HB4304 FARE contraindicators',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowInterviewerComment: true,
        requireInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: 'prepared_food',
    section: 4,
    text: 'Who prepared food for you while you were in the home?',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Foster Parent', 
        value: 'Foster Parent',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Child', 
        value: 'Child',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Other Household Member', 
        value: 'Other Household Member',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Non-Household Member', 
        value: 'Non-Household Member',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'sufficient_food',
    section: 5,
    text: 'Was there sufficient food while you were in the home? Did you get enough to eat? Please indicate youth\'s response in text box',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'approp_clothing',
    section: 6,
    text: 'Did you have enough clothing while you were in the home that was appropriate for the weather?',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'own_bed',
    section: 7,
    text: 'Did you have your own bed? Did anyone share a bed with you. Please indicate youth\'s response in text box',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'child_roommate',
    section: 8,
    text: 'Did anyone else sleep in your room? If yes, please indicate youth\'s response in text box.',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - Age Appropriate roommate', 
        value: 'Yes - Age Appropriate roommate',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - Adult or improper roommate', 
        value: 'Yes - Adult or improper roommate',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'approp_supervision',
    section: 9,
    text: 'Did you have supervision appropriate to your age and special needs while you were in the home?',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'school_enrollment',
    section: 10,
    text: 'Did you attend school while you were in the home?',
    category: 'Education',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable - School not in session', 
        value: 'Not Applicable - School not in session',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'homework_help',
    section: 11,
    text: 'Did you receive the support you needed to complete your schoolwork while you were in the home?',
    category: 'Education',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable - School not in session', 
        value: 'Not Applicable - School not in session',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'caseworker_access',
    section: 12,
    text: 'Did you have access to your caseworker while you were in the home?',
    category: 'Access to Support',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - In Person', 
        value: 'Yes - In Person',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Phone', 
        value: 'Yes - By Phone',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Email', 
        value: 'Yes - By Email',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Video Chat or Instant Messaging', 
        value: 'Yes - By Video Chat or Instant Messaging',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'therapist_access',
    section: 13,
    text: 'Did you have access to your therapist while you were in the home?',
    category: 'Access to Support',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - In Person', 
        value: 'Yes - In Person',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Phone', 
        value: 'Yes - By Phone',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Email', 
        value: 'Yes - By Email',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Video Chat or Instant Messaging', 
        value: 'Yes - By Video Chat or Instant Messaging',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable', 
        value: 'Not Applicable',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'gal_access',
    section: 14,
    text: 'Did you request to see or talk to your court-appointed representative (GAL, attorney, etc.) while you were in the home?',
    category: 'Access to Support',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - In Person', 
        value: 'Yes - In Person',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Phone', 
        value: 'Yes - By Phone',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Email', 
        value: 'Yes - By Email',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Video Chat or Instant Messaging', 
        value: 'Yes - By Video Chat or Instant Messaging',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'feel_safe',
    section: 15,
    text: 'Did you feel safe in the home? If the child answers no, interviewers shall ask additional questions to elicit additional responses. For example, if a child responds that they didn\'t feel safe, after asking why and receiving one response, the interviewer should prompt with, "Was there anything else that made you not feel safe." The prompts should continue until the child responds no.',
    category: 'Safety and Well-being',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_accepting',
    section: 16,
    text: 'Were there things that the foster parent did that made you feel good about yourself (e.g., race/ethnicity, culture, gender/sexual identity)?',
    category: 'Safety and Well-being',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'happy_event',
    section: 17,
    text: 'Did anything happen that made you happy?',
    category: 'Emotional Experiences',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'scary_event',
    section: 18,
    text: 'Did anything happen that was scary?',
    category: 'Emotional Experiences',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'sad_event',
    section: 19,
    text: 'Did anything happen that made you sad?',
    category: 'Emotional Experiences',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'discipline_type',
    section: 20,
    text: 'What happened when you did something you should not have done?',
    category: 'Discipline and Recognition',
    multiSelect: true,
    options: [
      { 
        text: 'Time Out', 
        value: 'Time Out',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Lost Privileges', 
        value: 'Lost Privileges',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Corporal Punishment', 
        value: 'Corporal Punishment',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yelling/Shouting', 
        value: 'Yelling/Shouting',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable', 
        value: 'Not Applicable',
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'recognize_good',
    section: 21,
    text: 'Did the family recognize the good things that you did?',
    category: 'Discipline and Recognition',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable', 
        value: 'Not Applicable',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'family_origin',
    section: 22,
    text: 'Did the foster parent act/talk positively about your family of origin including parents and siblings (if applicable)?',
    category: 'Family Relationships',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_support_prmgoal',
    section: 23,
    text: 'Was your foster parent supportive of your permanency goal?',
    category: 'Family Relationships',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'family_inclusion',
    section: 24,
    text: 'Did you feel included in the family? If yes, what things made you feel included? If no, what things made you feel like you were not included?\nChild\'s responses captured in text box below:',
    category: 'Family Relationships',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'extra_activities',
    section: 25,
    text: 'Did you participate in extracurricular activities?',
    category: 'Participation and Engagement',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_cftm_participation',
    section: 26,
    text: 'Did your Foster Parent participate in CFTMs?',
    category: 'Participation and Engagement',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_school_participation',
    section: 27,
    text: 'Did your Foster Parent participate in School Meetings?',
    category: 'Participation and Engagement',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable - School not in session', 
        value: 'Not Applicable',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'child_openend',
    section: 28,
    text: 'Is there anything else you think other children or adults should know about the home? If yes, provide answer in text box.',
    category: 'Additional Information',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: 'scr_report',
    section: 29,
    text: 'Does the interviewer have any observations or any information relevant to understanding the child\'s responses? If so, please record on the interview form below',
    category: 'Additional Information',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        potentialViolation: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  }
];


export default function FAREQuestionnaire() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [effectiveDate, setEffectiveDate] = useState('12/08/2025 08:41 AM');
  const [description, setDescription] = useState('');
  const [showEndInterviewWarning, setShowEndInterviewWarning] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [endedReason, setEndedReason] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (unsavedChanges) {
        handleAutoSave();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [unsavedChanges, formData, effectiveDate, description]);

  const handleAutoSave = () => {
    const saveData = {
      effectiveDate,
      description,
      formData,
      status: 'draft',
      savedAt: new Date().toISOString(),
      autoSaved: true
    };
    console.log('Auto-saved:', saveData);
    // You can show a subtle notification here if needed
    setUnsavedChanges(false);
  };

  const handleOptionChange = (questionId, value) => {
    const question = QUESTIONS.find(q => q.id === questionId);
    const option = question.options.find(o => o.value === value);

    setFormData(prev => ({
      ...prev,
      [questionId]: {
        selectedOption: value,
        description: prev[questionId]?.description || '',
        requireComment: option?.requireComment || false,
        potentialViolation: option?.potentialViolation || false,
        endInterview: option?.endInterview || false
      }
    }));

    setUnsavedChanges(true);

    if (option?.endInterview) {
      setInterviewEnded(true);
      setEndedReason(`Interview ended: Question ${question.section} - "${question.text}" - Selected "${option.text}"`);
      setTimeout(() => setShowEndInterviewWarning(true), 100);
    }
  };

  const handleDescriptionChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        description: value
      }
    }));
  };

  const goToQuestion = (index) => {
    if (interviewEnded) return;
    setCurrentQuestionIndex(index);
  };

  const goToFirst = () => {
    if (interviewEnded) return;
    setCurrentQuestionIndex(0);
  };
  
  const goToLast = () => {
    if (interviewEnded) return;
    setCurrentQuestionIndex(QUESTIONS.length - 1);
  };
  
  const goToPrev = () => {
    if (interviewEnded) return;
    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
  };
  
  const goToNext = () => {
    if (interviewEnded) return;
    setCurrentQuestionIndex(Math.min(QUESTIONS.length - 1, currentQuestionIndex + 1));
  };

  const validateForm = () => {
    const errors = [];
    QUESTIONS.forEach(question => {
      const data = formData[question.id];
      if (data?.selectedOption && data?.requireComment && !data?.description?.trim()) {
        errors.push(`Question ${question.section}: Description is required`);
      }
    });
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    const saveData = {
      effectiveDate,
      description,
      formData,
      status: 'completed',
      submittedAt: new Date().toISOString()
    };
    console.log('Assessment Submitted:', saveData);
    alert('Assessment submitted successfully!');
    setUnsavedChanges(false);
  };

  const handleSaveDraft = () => {
    const saveData = {
      effectiveDate,
      description,
      formData,
      status: 'draft',
      savedAt: new Date().toISOString()
    };
    console.log('Draft Saved:', saveData);
    alert('Draft saved successfully!');
    setUnsavedChanges(false);
  };

  return (
    <div className="fare-app">
      {/* Header with DCFS Logo */}
      <div className="fare-header">
        <div className="fare-header-top">
          <div className="fare-header-left">
            <div className="dcfs-logo">
              <div className="dcfs-text">Illinois Department of</div>
              <div className="dcfs-main">DCFS</div>
              <div className="dcfs-subtitle">Children & Family Services</div>
            </div>
            <div className="fare-title-section">
              <span className="fare-title">F.A.R.E</span>
            </div>
          </div>
          <div className="fare-header-right">
            <div className="questionnaire-heading">Questionnaire</div>
          </div>
        </div>
        
        {/* Bottom section with Effective Date and Description */}
        <div className="fare-header-bottom">
          <div className="fare-header-info">
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
              <label style={{fontSize: '13px', fontWeight: '500', minWidth: '100px', color: '#111827'}}>Effective Date:</label>
              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="header-input"
                placeholder="MM/DD/YYYY HH:MM AM/PM"
              />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <label style={{fontSize: '13px', fontWeight: '500', minWidth: '100px', color: '#111827'}}>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="header-input"
                placeholder="Enter description..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="fare-layout">
        {/* Sidebar */}
        <div className="fare-sidebar">
          <h3 className="sidebar-title">Sections</h3>
          <div className="sidebar-list">
            {QUESTIONS.map((question, index) => (
              <div
                key={question.id}
                className={`sidebar-item ${currentQuestionIndex === index ? 'active' : ''} ${interviewEnded ? 'disabled' : ''}`}
                onClick={() => !interviewEnded && goToQuestion(index)}
                style={{cursor: interviewEnded ? 'not-allowed' : 'pointer', opacity: interviewEnded ? 0.5 : 1}}
              >
                <div className="sidebar-content">
                  <span className="sidebar-number">{question.section}</span>
                  <span className="sidebar-text">{question.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                {formData[question.id]?.selectedOption && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="check-icon">
                    <circle cx="8" cy="8" r="8" fill="#10B981"/>
                    <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="fare-content">
          {/* Interview Ended Banner */}
          {interviewEnded && (
            <div className="interview-ended-banner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#DC2626"/>
              </svg>
              <div className="banner-content">
                <strong>🛑 Interview Has Been Ended</strong>
                <p>{endedReason}</p>
                <p style={{fontSize: '13px', marginTop: '4px'}}>Navigation is disabled. Please complete the description field and save or submit this assessment.</p>
              </div>
            </div>
          )}

          {/* CANS-Style Section Header */}
          <div className="cans-section-header">
            <div className="section-name">
              {currentQuestion.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className="section-navigation">
              <button className="nav-link-btn" onClick={goToFirst} disabled={currentQuestionIndex === 0 || interviewEnded}>
                « First
              </button>
              <button className="nav-link-btn" onClick={goToPrev} disabled={currentQuestionIndex === 0 || interviewEnded}>
                ‹ Prev
              </button>
              <span className="section-counter">Section {currentQuestion.section} / {QUESTIONS.length}</span>
              <button className="nav-link-btn" onClick={goToNext} disabled={currentQuestionIndex === QUESTIONS.length - 1 || interviewEnded}>
                Next ›
              </button>
              <button className="nav-link-btn" onClick={goToLast} disabled={currentQuestionIndex === QUESTIONS.length - 1 || interviewEnded}>
                Last »
              </button>
            </div>
          </div>

          {/* Circle Navigation Numbers */}
          <div className="circle-navigation">
            <div className="circle-container">
              {QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  className={`circle-btn ${idx === currentQuestionIndex ? 'active' : ''} ${formData[q.id]?.selectedOption ? 'completed' : ''}`}
                  onClick={() => goToQuestion(idx)}
                  disabled={interviewEnded}
                  title={q.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                >
                  {q.section}
                </button>
              ))}
            </div>
          </div>

          {/* Question Content */}
          <div className="question-box">
            <h3 className="question-text">
              {currentQuestion.section}. {currentQuestion.text}
            </h3>

            {/* Radio Options */}
            <div className="radio-list">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = formData[currentQuestion.id]?.selectedOption === option.value;
                return (
                  <div key={idx}>
                    <label
                      className={`radio-row ${isSelected ? 'selected' : ''} ${interviewEnded ? 'disabled' : ''}`}
                      style={{cursor: interviewEnded ? 'not-allowed' : 'pointer', opacity: interviewEnded ? 0.6 : 1}}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleOptionChange(currentQuestion.id, option.value)}
                        className="radio-input"
                        disabled={interviewEnded}
                      />
                      <span className="radio-text">
                        {option.text}
                      </span>
                    </label>

                    {/* Show comment fields if option is selected AND has comments or violation */}
                    {isSelected && (option.allowYouthComment || option.requireYouthComment || option.allowInterviewerComment || option.requireInterviewerComment || option.potentialViolation) && (
                      <div className="comment-fields">
                        {/* Potential Violation Warning */}
                        {option.potentialViolation && (
                          <div className="violation-warning">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0}}>
                              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#DC2626"/>
                            </svg>
                            <div>
                              <strong>Warning: Potential Licensing Violation Detected</strong>
                              <p>This response may indicate a licensing violation. The interviewer must remain alert and may need to file a report to State Central Registry (SCR) consistent with mandated reporter requirements. Please document thoroughly in the comments section.</p>
                            </div>
                          </div>
                        )}

                        {/* Youth Comment */}
                        {(option.allowYouthComment || option.requireYouthComment) && (
                          <div className="comment-field">
                            <label className="comment-label">
                              Youth Comment
                              {option.requireYouthComment && <span className="required-mark">*</span>}
                            </label>
                            <textarea
                              value={formData[currentQuestion.id]?.youthComment || ''}
                              onChange={(e) => {
                                setFormData(prev => ({
                                  ...prev,
                                  [currentQuestion.id]: {
                                    ...prev[currentQuestion.id],
                                    youthComment: e.target.value
                                  }
                                }));
                              }}
                              className="comment-textarea"
                              placeholder="Enter youth's comments..."
                              rows="3"
                            />
                            {option.requireYouthComment && !formData[currentQuestion.id]?.youthComment?.trim() && (
                              <span className="error-text">This field is required before finalizing</span>
                            )}
                          </div>
                        )}

                        {/* Interviewer Comment */}
                        {(option.allowInterviewerComment || option.requireInterviewerComment) && (
                          <div className="comment-field">
                            <label className="comment-label">
                              Interviewer Comment
                              {option.requireInterviewerComment && <span className="required-mark">*</span>}
                            </label>
                            <textarea
                              value={formData[currentQuestion.id]?.interviewerComment || ''}
                              onChange={(e) => {
                                setFormData(prev => ({
                                  ...prev,
                                  [currentQuestion.id]: {
                                    ...prev[currentQuestion.id],
                                    interviewerComment: e.target.value
                                  }
                                }));
                              }}
                              className="comment-textarea"
                              placeholder="Enter interviewer's observations..."
                              rows="3"
                            />
                            {option.requireInterviewerComment && !formData[currentQuestion.id]?.interviewerComment?.trim() && (
                              <span className="error-text">This field is required before finalizing</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons - After all options */}
            <div className="question-footer-buttons">
              <button className="btn btn-cancel" onClick={() => {
                if (unsavedChanges) {
                  if (window.confirm('You have unsaved changes for this question. Are you sure you want to clear them?')) {
                    // Clear only the current question's data
                    setFormData(prev => {
                      const updated = {...prev};
                      delete updated[currentQuestion.id];
                      return updated;
                    });
                    setUnsavedChanges(false);
                  }
                } else {
                  // No changes, just show message
                  alert('No unsaved changes to cancel.');
                }
              }}>
                Cancel
              </button>
              <button className="btn btn-draft" onClick={handleSaveDraft}>
                <Save size={18} />
                Save Draft
              </button>
              <button className="btn btn-submit" onClick={handleSubmit}>
                <Save size={18} />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showValidationModal && (
        <div className="modal-overlay" onClick={() => setShowValidationModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">⚠️ Required Fields Missing</h3>
            <p className="modal-desc">Please complete the following required fields:</p>
            <ul className="error-list">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <button className="btn btn-submit" onClick={() => setShowValidationModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      {showEndInterviewWarning && (
        <div className="modal-overlay" onClick={() => setShowEndInterviewWarning(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">🛑 End Interview Option Selected</h3>
            <p className="modal-desc">
              This selection will end the interview when submitted. Please complete all required comments before proceeding.
            </p>
            <button className="btn btn-submit" onClick={() => setShowEndInterviewWarning(false)}>
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}