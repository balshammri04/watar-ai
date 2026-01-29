// const BASE_URL = "http://localhost:3000";

// export async function apiFetch(path, options = {}) {
//   const token = localStorage.getItem("token");

//   const res = await fetch(`${BASE_URL}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error(data.error || data.message || "Backend error");
//   }

//   return data;
// }
