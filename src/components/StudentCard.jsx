import React, { useState, useEffect } from 'react';
import './StudentCard.css';

const initialFormState = {
  name: '',
  bookNum: '',
  bookName: '',
  className: '',
  enrollment: '',
  issueDate: '',
  endDate: '',
};

const StudentCard = () => {
  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem('students');
    return stored ? JSON.parse(stored) : [];
  });

  const [studentForm, setStudentForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return Object.values(studentForm).every((field) => field.trim() !== '');
  };

  const addStudent = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError('Please fill in all fields.');
      return;
    }

    const { enrollment, issueDate, endDate } = studentForm;

    // Prevent duplicate enrollment numbers
    if (students.some((s) => s.enrollment === enrollment)) {
      setError('Enrollment number already exists.');
      return;
    }

    // Check date logic
    if (new Date(issueDate) > new Date(endDate)) {
      setError('End date must be after issue date.');
      return;
    }

    const newStudent = {
      ...studentForm,
      returned: false,
    };

    setStudents((prev) => [...prev, newStudent]);
    setStudentForm(initialFormState);
    setError('');
    setSuccess('Book issued successfully!');
  };

  return (
    <div className="studentCart">
      {error && <div className="toast-message toast-error">{error}</div>}
      {success && <div className="toast-message toast-success">{success}</div>}
      <form onSubmit={addStudent} className="student-form">
        {[
          { name: 'name', placeholder: 'Name' },
          { name: 'bookNum', placeholder: 'Book Number' },
          { name: 'bookName', placeholder: 'Book Name' },
          { name: 'className', placeholder: 'Branch Name' },
          { name: 'enrollment', placeholder: 'Enrollment Number' },
        ].map(({ name, placeholder }) => (
          <input
            key={name}
            type="text"
            name={name}
            placeholder={placeholder}
            className="InputBox"
            value={studentForm[name]}
            onChange={handleChange}
            aria-label={placeholder}
          />
        ))}

        <input
          type="date"
          name="issueDate"
          className="InputBox"
          value={studentForm.issueDate}
          onChange={handleChange}
          aria-label="Issue Date"
        />

        <input
          type="date"
          name="endDate"
          className="InputBox"
          value={studentForm.endDate}
          onChange={handleChange}
          aria-label="Ending Date"
        />

        <button type="submit" className="BtnBox">Add Book</button>

      </form>
    </div>
  );
};

export default StudentCard;
