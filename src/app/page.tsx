import Chart from "@/components/Chart/Chart";
import "./page.css";

export default function Home() {
  return (
    <div className="page">
      <div className="headers">
        <div className="item">
          <h1>Devs Kickoff</h1>
        </div>
        <div className="item">
          <h3>Send emails to this url: localhost:3000/emails/send</h3>
        </div>
      </div>
      <Chart />
    </div>
  );
}
