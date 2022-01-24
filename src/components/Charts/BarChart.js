import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    orders: 240,
    avg: 100,
    amt: 24000,
  },
  {
    name: "Feb",
    orders: 300,
    avg: 200,
    amt: 48000,
  },
  {
    name: "Mar",
    orders: 340,
    avg: 210,
    amt: 52000,
  },
  {
    name: "Apr",
    orders: 220,
    avg: 150,
    amt: 40000,
  },
  {
    name: "May",
    orders: 300,
    avg: 200,
    amt: 48000,
  },
  {
    name: "Jun",
    orders: 360,
    avg: 240,
    amt: 54000,
  },
  {
    name: "Jul",
    orders: 280,
    avg: 200,
    amt: 48900,
  },
];

export default class BarChartReport extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          width={500}
          height={250}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="name"
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amt" stackId="a" fill="#64395e" />
          <Bar dataKey="orders" stackId="a" fill="#200F21" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
