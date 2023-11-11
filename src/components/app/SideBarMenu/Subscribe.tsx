//This is just temporary solution
import react, { useEffect, useState } from "react";

const Subscribe = () => {
  const [subscribeCount, setSubScribeCount] = useState<number>(5);

  useEffect(() => {
    let prevCount = "";
    const count = localStorage.getItem("ui-design-subscribe");

    if (count == undefined) {
      localStorage.setItem("ui-design-subscribe", `5`);
    }
    setInterval(() => {
      const count = localStorage.getItem("ui-design-subscribe");
      console.log(count);

      if (count !== prevCount) {
        setSubScribeCount(Number(count));
      }
      prevCount = "" + count;
    }, 1000);
  }, []);

  if (typeof window == "undefined") {
    return null;
  }

  return (
    <div
      className="text-light d-flex flex-column justify-content-center align-items-center m-2 word-wrap rounded-2 p-2"
      style={{ backgroundColor: "#10503D" }}
    >
      <img src="images/star.png" />
      <p className="p-0 m-0" style={{ fontSize: "11px" }}>
        Subscribe
      </p>
      <p className="p-0 m-0 fw-semibold" style={{ fontSize: "12px" }}>
        {`${subscribeCount} tries left`}
      </p>
    </div>
  );
};
export default Subscribe;
