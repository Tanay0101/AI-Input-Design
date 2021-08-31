import { Component } from "react";
import './Node.css'

export default class Node extends Component {
	render() {
		const {row, col, isStart, isEnd, isIcon} = this.props;
		const extraClassName = isStart ? 'node-start' : isEnd ? 'node-end' : isIcon? 'node-icon' :'';
    return (
			<div 
			id = {`node-${row}-${col}`} 
			key = {`node-${row}-${col}`}
      className = {`node ${extraClassName}`}
      >
			</div>
		);
  }
}
