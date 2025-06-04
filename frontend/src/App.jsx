import { useEffect, useState } from "react";
import ResultsTable from "./components/ResultsTable";

function App() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("/api/results")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setResults(data))
      .catch((err) => console.error("❌ fetch 실패:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🚲 바이크 수요 예측 결과</h1>
      <ResultsTable data={results} />
    </div>
  );
}

export default App;
