import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
export default class AreaChartReport extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          width={500}
          height={250}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="amt" stroke="#64395e" fill="#64395e" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
