"use client";

import { NextPage } from "next";
import c from "./page.module.css";
import { Text, Box, Button, Grid } from "@mantine/core";
import clsx from "clsx";
import { useReducer } from "react";

type State = string;

type Action = {
  type: string;
  btn: string;
};

const numBtn = [
  "del",
  "AC",
  "%",
  "%off",
  "7",
  "8",
  "9",
  "÷",
  "4",
  "5",
  "6",
  "x",
  "1",
  "2",
  "3",
  "-",
  ".",
  "0",
  "=",
  "+",
] as const;

const multiplicationDivision = (arr: string[]) => {
  let i = 0;
  while (i < arr.length) {
    if (["x", "÷"].includes(arr[i])) {
      const num1 = parseFloat(arr[i - 1]);
      const num2 = parseFloat(arr[i + 1]);
      let mulDiv;
      switch (arr[i]) {
        case "x":
          mulDiv = num1 * num2;
          break;
        case "÷":
          mulDiv = num2 !== 0 ? num1 / num2 : 0;
          break;
        default:
          mulDiv = "";
      }
      arr.splice(i - 1, 3, mulDiv.toString());
      i = 0;
    } else {
      i++;
    }
  }
};
const addSubtract = (arr: string[]) => {
  multiplicationDivision(arr);
  let result = parseFloat(arr[0]);
  for (let i = 1; i < arr.length; i += 2) {
    const op = arr[i];
    const num = parseFloat(arr[i + 1]);
    if (op === "+") result += num;
    if (op === "-") result -= num;
  }
  return parseFloat(result.toFixed(10)).toString();
};

const CalcPage: NextPage = () => {
  const reducer = (state: State, action: Action) => {
    const { type, btn } = action;
    switch (type) {
      case "number":
        if (
          ["+", "-", "x", "÷"].includes(state.at(-1) ?? "") &&
          ["+", "-", "x", "÷"].includes(btn)
        ) {
          return state;
        } else {
          return state + btn;
        }
      case "dot":
        const lastNum = state.split(/([\+\-x÷%])/).at(-1);
        if (lastNum?.includes(".")) {
          return state;
        } else {
          return state + btn;
        }

      case "clear":
        return "";
      case "delete":
        return state.slice(0, -1);
      case "per":
        const pushPer = (formula: string) => {
          const arr = formula.split(/([\+\-x÷%])/);
          const i = arr.indexOf("%");
          arr.splice(i, 2, "÷", "100");
          return addSubtract(arr);
        };
        return pushPer(state + btn);

      case "peroff":
        const pushPeroff = (formula: string) => {
          const tempFormula = formula.replace(/%off/, "&");
          const arr = tempFormula.split(/([\+\-x÷%&])/);
          const i = arr.indexOf("&");
          const num = parseFloat(arr[i - 1]);
          const offValue = (1 - num / 100).toString();
          arr.splice(i - 1, 3, offValue);
          return addSubtract(arr);
        };
        return pushPeroff(state + btn);

      case "equal":
        const pushEqual = (formula: string) => {
          let arr = formula.split(/([\+\-x÷])/);
          if (arr.at(-1) === "") {
            arr = arr.slice(0, -2);
          }
          return addSubtract(arr);
        };
        return pushEqual(state);
      default:
        throw Error;
    }
  };
  const [state, dispatch] = useReducer(reducer, "");

  const handleClick = (btn: string) => {
    if (!["del", "AC", "%", "%off", "=", "."].includes(btn)) {
      dispatch({ type: "number", btn });
    } else if (btn === "del") {
      dispatch({ type: "delete", btn });
    } else if (btn === "AC") {
      dispatch({ type: "clear", btn });
    } else if (btn === "=") {
      dispatch({ type: "equal", btn });
    } else if (btn === "%") {
      dispatch({ type: "per", btn });
    } else if (btn === "%off") {
      dispatch({ type: "peroff", btn });
    } else if (btn === ".") {
      dispatch({ type: "dot", btn });
    }
  };

  return (
    <Box className={c.main}>
      <Box className={c.result}>
        <Text fz={30} ta="right" lineClamp={1}>
          {state}
        </Text>
      </Box>
      <Box>
        <Grid className={c.grid} grow={false}>
          {numBtn.map((btn) => (
            <Grid.Col key={btn} span={3}>
              <Button
                key={btn}
                value={btn}
                variant="subtle"
                onClick={() => handleClick(btn)}
                className={clsx(c.btn, {
                  [c.abc]: ["del", "AC", ".", "%", "%off"].includes(btn),
                  [c.def]: ["+", "-", "x", "÷", "="].includes(btn),
                  [c.number]: ![
                    "del",
                    "AC",
                    ".",
                    "%",
                    "%off",
                    "=",
                    "+",
                    "-",
                    "x",
                    "÷",
                  ].includes(btn),
                })}
              >
                <Text size={btn === "%off" ? "sm" : "xl"} fw={700}>
                  {btn}
                </Text>
              </Button>
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CalcPage;
