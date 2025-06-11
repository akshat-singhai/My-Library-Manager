import React, { useEffect, useState } from 'react';
import './IssueData.css';

const ITEMS_PER_PAGE = 5;

const IssueData = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('students'); // 'students' or 'books'
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700); // simulate loading
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    // Ensure each student has a 'due' property for legacy data
    const migratedStudents = storedStudents.map(s => ({
      ...s,
      due: s.due !== undefined ? s.due : false
    }));
    setStudents(migratedStudents);
    setBooks(storedBooks);
    return () => clearTimeout(timer);
  }, []);

  const updateStudents = (newList) => {
    setStudents(newList);
    localStorage.setItem('students', JSON.stringify(newList));
  };

  const updateBooks = (newList) => {
    setBooks(newList);
    localStorage.setItem('books', JSON.stringify(newList));
  };

  const toggleReturned = (index) => {
    const updated = [...students];
    updated[index].returned = !updated[index].returned;
    updateStudents(updated);
  };

  // Toggle due/undue status
  const toggleDue = (index) => {
    const updated = [...students];
    updated[index].due = !updated[index].due;
    updateStudents(updated);
  };

  const deleteStudent = (index) => {
    const updated = students.filter((_, i) => i !== index);
    updateStudents(updated);
  };

  const deleteBook = (index) => {
    const updated = books.filter((_, i) => i !== index);
    updateBooks(updated);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.bookName.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollment.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  return (
    <div className="cardBox">
      <div className="tab-switch">
        <button onClick={() => setView('students')} className={view === 'students' ? 'active' : ''}>Students</button>
        <button onClick={() => setView('books')} className={view === 'books' ? 'active' : ''}>Books</button>
      </div>

      <input
        type="text"
        className="searchBox"
        placeholder={`Search ${view === 'students' ? 'student' : 'book'}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="spinner"></div>
      ) : view === 'students' ? (
        <>
          {paginatedStudents.map((student, i) => (
            <div key={i} className={`student-card ${student.returned ? 'returned' : ''}`}>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Book:</strong> {student.bookName} ({student.bookNum})</p>
              <p><strong>Branch:</strong> {student.className}</p>
              <p><strong>Enrollment:</strong> {student.enrollment}</p>
              <p><strong>Issue:</strong> {student.issueDate}</p>
              <p><strong>Due:</strong> {student.endDate}</p>
              <p><strong>Status:</strong> {student.returned ? '✅ Returned' : '📕 Not Returned'}</p>
              <p>
                <strong>Due Status:</strong>{' '}
                {student.due ? (
                  <span style={{ color: 'red' }}>Due</span>
                ) : (
                  <span style={{ color: 'green' }}>Undue</span>
                )}
              </p>
              <div className='BtnDiv'>
              <button onClick={() => toggleReturned(i)} className="ReBtn">
                {student.returned ? 'Mark as Not Returned' : 'Mark as Returned'}
              </button>
              <button onClick={() => toggleDue(i)} className="ReBtn" style={{ marginLeft: 8 }}>
                {student.due ? 'Mark as Undue' : 'Mark as Due'}
              </button>
              <button onClick={() => deleteStudent(i)} className="delBtn">❌ Delete</button>
            </div></div>
          ))}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active-page' : ''}
              >
                {i + 1}
              </button>
              
            ))}
          </div>
        </>
      ) : (
        <>
          {books
            .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
            .map((book, i) => (
              <div key={i} className="student-card">
                <p><strong>Name:</strong> {book.name}</p>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Category:</strong> {book.category}</p>
                <button onClick={() => deleteBook(i)} className="delBtn">❌ Delete</button>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default IssueData;