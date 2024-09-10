import Chart from "@/components/Chart/Chart";
import "./page.css";

export default function Home() {
  return (
    <div className="page">
      <div className="headers">
        <h1>Devs Kickoff</h1>
        <span className="sub-head">
          Send NetIDs to:{" "}
          <span className="link-text">
            https://bootcamp.hoyadevelopers.com/api/bootcamp/submitNetId
          </span>
        </span>
      </div>
      <Chart />
    </div>
  );
}
