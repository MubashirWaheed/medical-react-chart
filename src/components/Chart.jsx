import React, { useEffect, useRef, useState } from 'react'
import linear from '../linear'


const Chart = ({metrics, visits}) => {
    const ref = useRef(null);
    const [mounted, setMounted] = useState(false)
    const [tW , setTotalWidth] = useState();
    const [tH, setTotalHeight] = useState();
    const [width,setWidth] = useState()
    const [height, setHeight] = useState();
    const [heightLarge, setHeightLarge] = useState();
    const [activevisit, setactivevisit] = useState(null)
    const [activescale, setactivescale] = useState('All time');
    const [activedisplay, setactivedisplay] = useState()
    const [activeMetric, setactiveMetric] = useState()
    // const [test , setTest] = useState()
    // const [chartMinDate, setchartMinDate] = useState()

    //find ranges for x and y scales
    function min_max(arr, field) {
      return arr.reduce(
        (acc, d) => {
          if (d[field] < acc[0]) acc[0] = d[field];
          if (d[field] > acc[1]) acc[1] = d[field];
          return acc;
        },
        [Infinity, -Infinity]
      );
    }
  
    //x range
    let [minDate, maxDate] = Object.values(metrics).reduce(
      (acc, d) => {
        let [mn, mx] = min_max(d, "date");
        if (mn < acc[0]) acc[0] = mn;
        if (mx > acc[1]) acc[1] = mx;
        return acc;
      },
      [Infinity, -Infinity]
    );

    if (visits[0] < minDate) minDate = visits[0];
    if (visits[visits.length - 1] < maxDate) maxDate = visits[visits.length - 1];
  
    //y ranges
    Object.entries(metrics).forEach(([k, v]) => {
      [metrics[k].min, metrics[k].max] = min_max(v, "value");
    });
  
    const scales = ["3 months", "6 months", "1 year", "All time"];
    // let activeScale = "All time";
    // setactiveMetric( Object.keys(metrics)[0]);
    // let activeDisplay = "values";
    
    let activeVisit = null;
    
    // setchartMinDate(minDate)
    let chartMinDate = minDate;
    console.log('chartMinDate at the start',chartMinDate.valueOf())
    // setTest(minDate.valueOf())
  
    const labelWidthPct = 30; //width of first column (%)
    const rowHeightPct = 50 / Object.keys(metrics).length; //in % for css
    let totalWidth, totalHeight;
    let svgWidth, svgHeight, svgHeightLarge;
    let xScale;
    let hticks, hlabels;
  
    function set_xScale(start) {
      xScale = linear([start, maxDate], [width * 0.05, width * 0.92]);
    }

    set_xScale(chartMinDate)
    set_hAxis();
  
    function set_hAxis() {
      const count = activescale == "All time" ? 8 : 6;
      const step = (maxDate - chartMinDate) / count;
      hticks = Array.from(
        { length: count + 1 },
        (_, i) => new Date(step * i + chartMinDate.valueOf())
        );
    }
  
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    function format_tick(t) {
      if (activescale == "All time") return t.getFullYear();
      return MONTHS[t.getMonth()] + "/" + ("" + t.getFullYear()).slice(2, 4);
    }
 
    function make_path(yScale, arr) {
      return (
        "M" +
        arr
          .map(({ date, value }) => ` ${xScale(date)},${yScale(value)} `)
          .join("L")
      );
    }
  
    function handle_wheel({ wheelDelta }) {
      if (!activeVisit) return;
      let i = visits.indexOf(activeVisit);
      wheelDelta < 0 ? --i : i++;
      if (i < 0 || i > activeVisit.length - 1) return;
      setactivevisit(visits[i])
    }
  
    function handle_scale_change(timescale) {
      if (activescale == timescale) return;
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      chartMinDate =
      timescale == "All time"
      ? minDate
          : timescale == "1 year"
          ? new Date() - MS_PER_DAY * 365
          : timescale == "6 months"
          ? new Date() - MS_PER_DAY * 180
          : new Date() - MS_PER_DAY * 90;

      // activeScale = timescale;
      // setTest(chartMinDate)
      console.log('chartMinDate',chartMinDate)
      setactivescale(timescale)
      // setchartMinDate(chartmindate)
    }
    // NEW
    // set_xScale(chartMinDate)
    // set_hAxis();
    
    // let mounted = false;
    useEffect(()=>{
      setTotalWidth(ref.current.offsetWidth)
      setTotalHeight(ref.current.offsetHeight)
      totalWidth = ref.current.offsetWidth;
      totalHeight = ref.current.offsetHeight;
      svgWidth = (totalWidth * (100 - labelWidthPct)) / 100;
      setWidth(svgWidth);
      svgHeight = (totalHeight * rowHeightPct) / 100;
      svgHeightLarge = totalHeight * 0.5
      setHeight(svgHeight)
      setHeightLarge(svgHeightLarge)
      setactivedisplay('values')
      setactiveMetric( Object.keys(metrics)[0]);
      
      set_xScale(chartMinDate);
      set_hAxis();
      setMounted(true)
      // mounted = true;
    },[])

  return (
    <div>
      <div id="chart-grid" >
          <div className="region" id="options-bar">
          <div className="options-group">
            <div className="bold">VIEW BY:</div>
            <div className="button-group">
              {scales.map((sc,i)=>{
                return(
                    <div
                      key={i}
                      className={`button ${i==0 ? 'button-right': ''} ${i == scales.length - 1 ? 'button-right': ''} ${activescale == sc ? 'bold': ''} `}                      
                      onClick={()=> {
                        console.log('sc clicked',sc);
                        handle_scale_change(sc)}
                      }
                    >
                      {sc}
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="options-group">
            <div><b>DISPLAY:</b></div>
            <div className="button-group">
              <div
                className={`button button-left ${activedisplay == "charts" ? 'bold' : ''} `}
                onClick={() => {
                  if (activedisplay != "charts") setactivedisplay('charts') 

                  // if (activedisplay != "charts") activedisplay = "charts";
                }}                
              >
                charts
              </div>
              <div
                className={`button button-right ${activedisplay == "values" ? "bold": ''}`}
                onClick= {() => {
                  if (activedisplay != "values") setactivedisplay("values")  
                }}
              >
                values
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* INSIDE ACTIVE SCALE */}
      <div id="chart"
      ref={ref}
      style={{border:'5px solid black'}}
      >
        <div className="chart-row" style={{height:+ rowHeightPct + "%"}}>
            <div className="column-header" style={{width: +labelWidthPct + "%"}}>
              <div>LAB/METRIC</div>
            </div>
            <div style={{width: + 100 - labelWidthPct + "%"}}>
              {mounted &&        
              <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                onWheel={handle_wheel}
              >
                {hticks.map((tick)=>{
                  return (
                    <text
                      className="axis-horizontal"
                      x={xScale(tick)}
                      y={height * 0.4}
                      textAnchor="middle">{format_tick(tick)}
                    </text>
                  )
                })}

                { visits.map((v)=>{
                  const x = xScale(v)
                  return (
                    <g className={`visit ${activevisit === v ? 'active-visit':''}`} >
                      <line x1={x} x2={x} y1={height * 0.8} y2={height} />
                      <circle
                        cx={x}
                        cy={height * 0.8}
                        r={7}
                        onClick={()=>{
                          // console.log('activevisit',activevisit)
                          return (
                            setactivevisit( activevisit == v ? null : v) 
                          )
                        }}
                      />
                    </g>
                  )
                })}
              </svg>
            }
            </div>
        </div>
        
        {Object.keys(metrics).map((key)=>{
          const active = activeMetric == key ? true : false
          const h = active ? heightLarge : height
          const yScale = linear([metrics[key].min, metrics[key].max], [h * 0.9, h * 0.1])
          const midY = yScale((metrics[key].min + metrics[key].max) / 2)
          // console.log('key',key)
          return (
          <div
            className={`chart-row metric-row ${active ? "active-metric": ''}`}
          
            style={{height: + active ? 50 + "%" : rowHeightPct + '%'  }}
          >
            <div
              className="metric-header"
              style={{width: + labelWidthPct + '%'}}
              onClick={() => setactiveMetric(key)}
                
            >
              <div className="metric-text">{key}</div>
              <div
                className="axis-vertical"
                style={{padding:+ (active  ? h * 0.05 + "px 0": "0")}}
              >
                <div>{metrics[key].max}</div>
                {active &&
                  <div>
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                  </div>
                }
                <div>{metrics[key].min}</div>
              </div>
            </div>

            {/* Graph is being drawn here */}
            <div style={{width: + (100 - labelWidthPct) + "%"}}>
              {mounted && 
                <svg
                  width={width}
                  height={h}
                  viewBox={`0 0 ${width} ${h}`}
                  preserveAspectRatio="none"
                  // xmlns="http://www.w3.org/2000/svg"
                >
                  {/* {console.log('width, h', width,h)} */}
                  {/* Vertical lines are drawn usin this code */}
                  {visits.map((v)=>{
                   return(
                      <g className={`${activevisit == v ? "active-visit": ''}`} >
                        <line x1={xScale(v)} x2={xScale(v)} y1={0} y2={h} />
                      </g>
                   )
                  })}
                  
                  {/* Fucntion below is used to make teh path in the chart*/}
                  {(active || activedisplay == "charts") ? (
                    <svg>           
                        {/* {console.log('make_path',yScale)} */}
                      <path  d={make_path(yScale, metrics[key])} />
                        {metrics[key].map((val)=>{
                          const x = xScale(val.date)
                          const y = yScale(val.value)
                          // console.log('x,y',x,y)
                          // let styleValue = val.date - activeVisit == 0
                          // console.log('styleValue',styleValue)
                          // 27.160000000000004 173.16857142857143
                          // 87.49755963302752 183.5457142857143
                          return(
                            <React.Fragment>
                                <circle className="value-dot" cx={x} cy={y} r={3} />
                              <g
                                className="tooltip"
                                style={{visibility: val.date - activevisit == 0 ? "visible": "" }}
                              >
                                <rect
                                  x={x + 3}
                                  y={y < 26 ? 4 : y - 22}
                                  rx="3"
                                  ry="3"
                                  width="24"
                                  height="18"
                                />
                                <text
                                  x={x + 15}
                                  y={y < 26 ? 19 : y - 7}
                                  textAnchor="middle">{val.value}
                                </text>
                              </g>
                            </React.Fragment>
                          )
                        })}
                    </svg>
                  ) :(
                    <svg>
                      {metrics[key].map((val)=>{
                        const x = xScale(val.date)
                        return(
                          <React.Fragment>
                            <rect
                              className="value-box"
                              x={x - 12}
                              y={midY - 12}
                              rx="3"
                              ry="3"
                              width="24"
                              height="24"
                            />
                            <text
                              className="value-text"
                              x={x}
                              // {x}
                              y={midY + 6}
                              textAnchor="middle">{val.value}
                            </text>
                          </React.Fragment>
                        )
                      })}
                    </svg>
                  )
                }
                </svg>
              }
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}

export default Chart
