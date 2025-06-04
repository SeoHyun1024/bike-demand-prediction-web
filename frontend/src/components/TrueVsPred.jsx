import Plot from "react-plotly.js";

function TrueVsPred({ data }) {
  console.log("📊 TrueVsPred 데이터:", data); // 추가

  if (!data || data.length === 0) return null;

  const trueVals = data.map((d) => d.true);
  const predVals = data.map((d) => d.pred);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>True vs Predicted</h2>
      <Plot
        data={[
          {
            x: trueVals,
            y: predVals,
            mode: "markers",
            type: "scatter",
            marker: { color: "blue", opacity: 0.5 },
          },
          {
            x: [Math.min(...trueVals), Math.max(...trueVals)],
            y: [Math.min(...trueVals), Math.max(...trueVals)],
            mode: "lines",
            line: { dash: "dash", color: "red" },
          },
        ]}
        layout={{
          xaxis: { title: "True" },
          yaxis: { title: "Predicted" },
          width: 600,
          height: 500,
        }}
      />
    </div>
  );
}

export default TrueVsPred;
