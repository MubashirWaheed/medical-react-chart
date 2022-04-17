import React, { useEffect } from "react";
import { visits, testlabs } from '../data'
import Chart from "./Chart";

const Metrics = ()=>{
    // export let testlabs = [];
    // export let visits = [];
  
    let height = "600px";
    let width = "800px";
    // $: metrics = process_labs(testlabs);
    // $: vsort = visits.map((d) => new Date(d)).sort((a, b) => a - b);
  
    function process_labs() {
      if (testlabs.length == 0) return [];
  
      const m = testlabs.reduce((acc, d) => {
        if (!Object.keys(acc).includes(d["lab/name"])) acc[d["lab/name"]] = [];
        acc[d["lab/name"]].push({
          value: d["lab/value"],
          date: new Date(d["lab/when"]),
          demographic: d["lab/demographic"],
        });
        return acc;
      }, {});
  
      Object.keys(m).forEach((key) => {
        m[key].sort((a, b) => a.date - b.date);
      });
      return m;
    }
    const metrics = process_labs(testlabs);
    const vsort = visits.map((d) => new Date(d)).sort((a, b) => a - b);
    
    return (
        <div id="container-grid" style={{height:height, width:width}}>
            <div>Tracking Labs & Disease Metrics</div>
            <Chart metrics={metrics} visits={vsort} />
        </div>
    )
}

export default Metrics