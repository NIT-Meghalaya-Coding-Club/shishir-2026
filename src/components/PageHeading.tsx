"use client";

import { RiSparkling2Fill } from "@remixicon/react";
import "animate.css";
import styles from "./PageHeading.module.css";

type PageHeadingProps = {
  title: string;
};

export default function PageHeading({
  title,
}: PageHeadingProps) {
  return (
    <header className={styles.pageHeading}>
      <div className={styles.pageHeadingWrapper}>
        <RiSparkling2Fill
          className={styles.pageHeadingIcon}
          aria-hidden="true"
        />

        <h1
          className={`${styles.pageHeadingTitle} animate__animated`}
          onMouseEnter={(event) => {
            event.currentTarget.classList.add(
              "animate__rubberBand"
            );
          }}
          onAnimationEnd={(event) => {
            event.currentTarget.classList.remove(
              "animate__rubberBand"
            );
          }}
        >
          {title}
        </h1>

        <RiSparkling2Fill
          className={styles.pageHeadingIcon}
          aria-hidden="true"
        />
      </div>
    </header>
  );
}