import React, { useState } from 'react';
import SlashCommand from "./SlashCommand";
import './App.css'


function Popover(props) {
	return (
		<div className="popover">
			<div className="inner">
				<h3>{props.title}</h3>
				{props.children}
			</div>
		</div>
	);
}

class App extends React.Component {
	state = {
		popoverIsOpen: false
	}
	constructor(props) {
		super(props);
	}
	openPopover = (val) => {
		this.setState({popoverIsOpen: val || true});
	}
	closePopover = () => {
		this.setState({popoverIsOpen: false});
	}
	render () {
		let popoverMarkup = null;
		if (this.state.popoverIsOpen) {
			popoverMarkup = (
				<Popover title={this.state.popoverIsOpen.title}>
					{this.state.popoverIsOpen.children}
				</Popover>
			);
		}
		return (
			<div>
				{popoverMarkup}
				<SlashCommand openPopover={this.openPopover} closePopover={this.closePopover} />
			</div>
				);
	}
}
export default App;
