function ResultsTable({ data }) {
  if (!data || data.length === 0) return <p>📭 데이터 없음</p>;

  return (
    <table
      border="1"
      cellPadding="8"
      style={{ marginTop: "2rem", width: "100%", borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key} style={{ background: "#f0f0f0" }}>
              {key.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((val, j) => (
              <td key={j} style={{ textAlign: "center" }}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ResultsTable;
