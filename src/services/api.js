async function fetcher(url, options = {}) {
  // Use relative URL to go through Next.js proxy
  console.log(`Fetching: /api${url}`);
  const res = await fetch(`/api${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

const api = {
  getStudents: () => fetcher('/students'),
  getStudent: (id) => fetcher(`/students/${id}`),
};

export default api;