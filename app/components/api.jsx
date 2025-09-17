const API_BASE = "https://rendercode-rm8x.onrender.com";

export async function executeCode(language, code) {
  const res = await fetch(`${API_BASE}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language, code }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.statusText}`);
  }

  return res.json();
}
