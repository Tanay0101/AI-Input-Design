import React, { Component, useState, useEffect } from "react";
import Axios from "axios";
import Node from "./Node";
import "./Grid.css";

const ROWS = 11;
const COLS = 11;
const START = [0, 5];
const END = [9, 10];

export default class Grid extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      start: START, //[new position]
      end: END,
    };
    this.ChangeLocation = this.ChangeLocation.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ChangeLocation);
    const grid = this.getInitialGrid();
    // console.log(grid);
    this.setState({ grid: grid });
  }

  ChangeLocation(event) {
    const code = event.code;
    console.log(code);
    if (
      code !== "ArrowUp" &&
      code !== "ArrowDown" &&
      code !== "ArrowLeft" &&
      code !== "ArrowRight"
    )
      return;
    const arr = [];
    if (code === "ArrowLeft") arr.push(1);
    else arr.push(0);
    if (code === "ArrowRight") arr.push(1);
    else arr.push(0);
    if (code === "ArrowUp") arr.push(1);
    else arr.push(0);
    if (code === "ArrowDown") arr.push(1);
    else arr.push(0);
    console.log(this.state.start);
    arr.push(this.state.start[0] / 10);
    arr.push(this.state.start[1] / 10);
    let done = false;
    
    console.log(arr, done);
    /*
      Left
      Right 
      Up
      Down
    */
    Axios.post(
      "http://127.0.0.1:5000/give_ans",
      {
        arr: arr,
        done: done,
      }
    ).then((res, err) => {
      if (err) console.log("Error", err);
      else {
        // const steps = res.data.ans;
        if (this.state.start[0] === this.state.end[0] && this.state.start[1] === this.state.end[1]){
          console.log('end')
          done = true;
          Axios.post(
            "http://127.0.0.1:5000/give_ans",
            {
              arr: arr,
              done: done,
            }
          )
          .then((resp, err) =>{
            res = resp;
            console.log(resp.data)
          })
      }
        console.log(res.data);
        this.setState({ start: res.data.state });
      }
    });
    
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < ROWS; row++) {
      const curr = [];
      for (let col = 0; col < COLS; col++) {
        curr.push(getNode(row, col));
      }
      grid.push(curr);
    }
    this.setIcons(grid);
    return grid;
  }

  setIcons(grid) {
    const icons = [[0, 0], [10, 10], [0, 10], [10, 0], [5, 3], [5, 7]];
    icons.forEach((node) => {
      grid[node[0]][node[1]].isIcon = true;
    });
  }

  onSubmit(){
    const st = document.getElementById("start").value;
    const en = document.getElementById("end").value;
    const stArray = st.split(",")
    const enArray = en.split(",")
    this.setState({start: [Number(stArray[0]), Number(stArray[1])]});
    this.setState({end: [Number(enArray[0]), Number(enArray[1])]});
  }

  render() {
    const { grid } = this.state;
    return (
      <>
        <div>
          <input type="text" id="start"></input><br></br>
          <input type="text" id="end"></input><br></br>
          <input type="submit" value="Submit" onClick={() => this.onSubmit()}></input>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="rowgap">
                {row.map((node, nodeIdx) => {
                  const { row, col, isIcon } = node;
                  // console.log("Start is ", this.state.start);
                  const isStart =
                    row === this.state.start[0] && col === this.state.start[1]
                      ? true
                      : false;
                  const isEnd =
                    row === this.state.end[0] && col === this.state.end[1]
                      ? true
                      : false;
                  return (
                    <Node
                      row={row}
                      col={col}
                      isStart={isStart}
                      isEnd={isEnd}
                      isIcon={isIcon}
                      // isWall={isWall}
                      // onMouseEnter={(row, col) => this.onMouseEnter(row, col)}
                      // onMouseDown={(row, col) => this.onMouseDown(row, col)}
                      // onMouseUp={(row, col) => this.onMouseUp(row, col)}
                      // onMouseLeave={(row, col) => this.onMouseLeave(row, col)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

function getInitialGrid() {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const curr = [];
    for (let col = 0; col < COLS; col++) {
      curr.push(getNode(row, col));
    }
    grid.push(curr);
  }
  return grid;
}

// export default function Grid() {
//   const [grid, setGrid] = useState([]);
//   const [start, setStart] = useState(START);
//   const [end, setEnd] = useState(END);
//   document.addEventListener("keyup", (event) => {
//     // console.log('here')
//     const code = event.code;
//     console.log(code);
//     if (
//       code !== "ArrowUp" &&
//       code !== "ArrowDown" &&
//       code !== "ArrowLeft" &&
//       code !== "ArrowRight"
//     )
//       return;
//     const arr = [];
//     if (code === "ArrowLeft") 
//       arr.push(1);
//     else 
//       arr.push(0);
//     if (code === "ArrowRight") 
//       arr.push(1);
//     else  
//       arr.push(0);
//     if (code === "ArrowUp") 
//       arr.push(1);
//     else 
//       arr.push(0);
//     if (code === "ArrowDown") 
//       arr.push(1);
//     else 
//       arr.push(0);
//     console.log(start);
//     arr.push(start[0] / 10);
//     arr.push(start[1] / 10);
//     let done = false;
//     if (start === end) 
//       done = true;
//     console.log(arr, done);
//     /*
//     Left
//     Right 
//     Up
//     Down
//   */
//     Axios.post(
//       "https://3044-2405-201-2001-13-ac87-fdd2-6cbd-4847.ngrok.io/give_ans",
//       {
//         arr: arr,
//         done: done,
//       }
//     ).then((res, err) => {
//       if (err) console.log("Error", err);
//       else {
//         // const steps = res.data.ans;
//         console.log(res.data);
//         // this.setState({ start: res.data.state });
//         setStart(res.data.state)
//       }
//     });
//   });
//   useEffect(() => {
//     // Update the document title using the browser API
//     const grid = getInitialGrid();
//     setIcons(grid)
//     setGrid(grid);
//   }, [start, end]);
//   function setIcons(grid){
//     const icons = [
//       [7, 1],
//       [1, 1],
//       [5, 7],
//       [6, 2],
//       [7, 4],
//       [2, 9],
//     ];
//     icons.forEach((node) => {
//       grid[node[0]][node[1]].isIcon = true;
//     });
//   }

//   return (
//     <>
//       <div className="grid">
//         {grid.map((row, rowIdx) => {
//           return (
//             <div key={rowIdx} className="rowgap">
//               {row.map((node, nodeIdx) => {
//                 const { row, col, isIcon } = node;
//                 // console.log("Start is ", this.state.start);
//                 const isStart =
//                   row === start[0] && col === start[1] ? true : false;
//                 const isEnd = row === end[0] && col === end[1] ? true : false;
//                 return (
//                   <Node
//                     row={row}
//                     col={col}
//                     isStart={isStart}
//                     isEnd={isEnd}
//                     isIcon={isIcon}
//                     // isWall={isWall}
//                     // onMouseEnter={(row, col) => this.onMouseEnter(row, col)}
//                     // onMouseDown={(row, col) => this.onMouseDown(row, col)}
//                     // onMouseUp={(row, col) => this.onMouseUp(row, col)}
//                     // onMouseLeave={(row, col) => this.onMouseLeave(row, col)}
//                   />
//                 );
//               })}
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

const getNode = (row, col) => {
  // const isStart = START[0] === row && START[1] === col;
  // const isEnd = END[0] === row && END[1] === col;
  return {
    row,
    col,
    isIcon: false,
  };
};
