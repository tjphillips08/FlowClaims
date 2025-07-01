import { claims } from "../api/mockData";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const totalClaims = claims.length;
  const inProgress = claims.filter(c => c.status === "In Progress").length;
  const completed = claims.filter(c => c.status === "Completed").length;
  const received = claims.filter(c => c.status === "Received").length;

  const chartData = {
    labels: ["Received", "In Progress", "Completed"],
    datasets: [
      {
        data: [received, inProgress, completed],
        backgroundColor: ["#f0ad4e", "#0275d8", "#5cb85c"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2 className="mb-4">📊 Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Claims</h5>
              <p className="card-text fs-4">{totalClaims}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">In Progress</h5>
              <p className="card-text fs-4">{inProgress}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="card-text fs-4">{completed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h5 className="mb-3">Claim Status Breakdown</h5>
        <Pie data={chartData} />
      </div>
    </div>
  );
}
