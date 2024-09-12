"use client";

import Chart from "@/components/Chart/Chart";
import "./page.css";
import { useEffect, useState } from "react";

export default function Home() {
  //countdown to update every second
  // const [countdown, setCountdown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2024-09-12T22:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ hours, minutes, seconds });
      } else {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

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
      {
        <div className="countdown">
          <h2>Challenge ends in:</h2>
          <div className="time">
            <div className="time-box">
              <span>{timeRemaining.hours}</span>
              <span>Hours</span>
            </div>
            <div className="time-box">
              <span>{timeRemaining.minutes}</span>
              <span>Minutes</span>
            </div>
            <div className="time-box">
              <span>{timeRemaining.seconds}</span>
              <span>Seconds</span>
            </div>
          </div>
        </div>
      }
      {(timeRemaining.hours > 0 || timeRemaining.minutes >= 30) && <Chart />}
      {timeRemaining.hours == 0 &&
        timeRemaining.minutes > 0 &&
        timeRemaining.minutes < 30 && (
          <p className="time-message">
            Total counts are hidden for the last 30 minutes of the challenge! We
            will see you all at 10PM in Vil A B302 to announce the winner!
          </p>
        )}
    </div>
  );
}
