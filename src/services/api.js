async function fetcher(url, options = {}) {
  try {
    // Use relative URL to go through Next.js proxy
    const res = await fetch(`/api${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!res.ok) {
      // Create a more user-friendly error
      const error = new Error();
      error.status = res.status;
      error.statusText = res.statusText;
      
      // Set different messages based on status
      if (res.status === 401) {
        error.message = 'Unauthorized';
      } else if (res.status === 404) {
        error.message = 'not found';
      } else if (res.status >= 500) {
        error.message = 'Network error';
      } else {
        error.message = 'API error';
      }
      
      throw error;
    }

    return res.json();
  } catch (err) {
    // If it's already our custom error, re-throw it
    if (err.status) {
      throw err;
    }
    
    // Handle network errors
    const networkError = new Error();
    networkError.message = 'Network error';
    networkError.status = 0;
    throw networkError;
  }
}

const api = {
  login: (email, password) => fetcher('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getStudents: () => fetcher('/students'),
  getStudent: (id) => fetcher(`/students/${id}`),
  createNote: (noteData) => fetcher('/internal_notes', {
    method: 'POST',
    body: JSON.stringify(noteData),
  }),
  getStudentNotes: (studentId) => fetcher(`/internal_notes?student_id=${studentId}`),
};

export default api;