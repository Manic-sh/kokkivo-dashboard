import React, { PureComponent } from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis } from "recharts";

const data = [
  {
    name: "Mon",
    orders: 24,
    avg: 100,
    amt: 2400,
  },
  {
    name: "Tue",
    orders: 30,
    avg: 200,
    amt: 4800,
  },
  {
    name: "Wed",
    orders: 34,
    avg: 210,
    amt: 5200,
  },
  {
    name: "Thu",
    orders: 22,
    avg: 150,
    amt: 4000,
  },
  {
    name: "Fri",
    orders: 30,
    avg: 200,
    amt: 4800,
  },
  {
    name: "Sat",
    orders: 36,
    avg: 240,
    amt: 5400,
  },
  {
    name: "Sun",
    orders: 28,
    avg: 200,
    amt: 4900,
  },
];

export default class ChartLine extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={74}>
        <LineChart width="100%" height={74} data={data}>
          <XAxis
            dataKey="name"
            interval={0}
            mirror={true}
            padding={{ left: 15, right: 10 }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amt"
            stroke="#64395e"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
