import { Typography } from "@mui/material";
import styles from "../styles/about.module.css";
import Image from "next/image";
import { Fragment } from "react";

export default function About() {
  return (
    <Fragment>
      <div className={styles.about}>
        <Typography variant="h4">Helping Travelers Explore</Typography>
        <Typography variant="h5">
          I understand the challenges travelers face when it comes to planning
          for a trip. This tool provides a quick and easy solution to save
          travelers time and energy, allowing them to focus on making meaningful
          connections with new places and inspiring them to explore.
        </Typography>
      </div>
      <div
        style={{
          opacity: 0.1,
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <Image width={500} height={500} src={"/composition.png"}></Image>
      </div>
    </Fragment>
  );
}
