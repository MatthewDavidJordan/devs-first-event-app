import Chart from "@/components/Chart/Chart";
import "./page.css";

export default function Home() {
  return (
    <div className="page">
      <div className="headers">
        <h1>Devs Kickoff</h1>
        <h3>
          Send NetIDs to:
          https://bootcamp.hoyadevelopers.com/api/bootcamp/submitNetId
        </h3>
      </div>
      <Chart />
    </div>
  );
}
