import './SlashCommand.css';
import React, { useRef, useEffect } from 'react';

const SPECIAL_COMMAND = '/addCommand';

// keeps track of all of the commands we have
class commandManager {
	commands = {};
	/*
	 * @cmd: the name of the script i.e. "/test"
	 */
	scriptNameExists(cmd) {
		for (let scriptName  in this.commands) {
			const foundScriptName = scriptName === cmd;
			if (foundScriptName) {
				return true;
			}
		}
		return false;
	}
	/*
	 * @name: the name of the script i.e. "test"
	 */
	add(name, scripts) {
		this.commands['/' + name] = scripts;
		return true;
	}
	/*
	 * @cmd: the name of the script i.e. "/test"
	 */
	run = (cmd) => {
		if (!this.scriptNameExists(cmd)) {
			return;
		}
		try {
			// trying to make it a bit more secure by binding your code to the window...
			return eval.call(window, this.commands[cmd]);
		} catch (exception) {
			alert(`There was a problem running your script: ${exception.message} on line number: ${exception.lineNumber}`);
			return '';
		}
	}
}

function Form(props) {
	const input = useRef();
	useEffect(function() {
		console.log('use effect');
		input.current.focus();
	}, []);

	return (
		<form onSubmit={props.handlePopupDone}>
			<label>Name</label>
			<input type="text" name="name" ref={input} />
			<label>Code</label>
			<textarea name="code"></textarea>
			<input type="submit" />
		</form>
		);
}
class SlashCommand extends React.Component {
	state = {
		inputVal: ''
	}
	constructor(props) {
		super(props);
		this.commands = new commandManager();
		this.mainInput = React.createRef();
	}
	handleFormSubmit = (evt) => {
		evt.preventDefault();
		evt.stopPropagation();
		const formObj = evt.currentTarget;
		const name = formObj.name.value;
		const code = formObj.code.value;
		this.commands.add(name, code);
		// cleanup our Modal
		formObj.name.value = '';
		formObj.code.value = '';
		this.props.closePopover();
		this.mainInput.current.focus();
	}
	findCommandsInArr = (strArr) => {
		let addCommandIdx = 0;
		while (
			addCommandIdx < strArr.length 									// We're inside of the array
			&& strArr[addCommandIdx] !== SPECIAL_COMMAND 					// it is the special Add command
			&& !this.commands.scriptNameExists(strArr[addCommandIdx]) 		// it is one of the commands the user has added
		)
		{
			addCommandIdx++;
		}
		return addCommandIdx;
	}
	handleInput = (evt) => {
		const textareaValArr = evt.target.value.split(' ');
		const commandIdx = this.findCommandsInArr(textareaValArr);
		console.log(commandIdx);
		const foundAnyCommand = textareaValArr.length > 0 && commandIdx < textareaValArr.length;
		if (!foundAnyCommand) {
			this.setState({inputVal: textareaValArr.join(' ')});
			return;
		}
		const commandStr = textareaValArr[commandIdx]

		let replacementStr

		// finally since we know a command was found, figure out which one it was and run it
		const foundSpecialAddCommand = commandStr === SPECIAL_COMMAND;
		if (foundSpecialAddCommand) {
			// Actually do some magic, we have found the command and know where it is.
			this.props.openPopover({
				callbackFn: this.handleFormSubmit,
				title: "Add a command",
				children: <Form handlePopupDone={this.handleFormSubmit} />
			});
			textareaValArr[commandIdx] = '';
		} else {
			// replace the string that was there with whatever was returned
			// can very easily cause an infinite loop with malicious actors
			textareaValArr[commandIdx] = this.commands.run(commandStr);
		}

		// remove the found command from the string
		this.setState({inputVal: textareaValArr.join(' ')});

	}
	componentDidMount() {
		this.mainInput.current.focus();
	}
	render() {
		return (
			<div>
				<textarea
					ref={this.mainInput}
					value={this.state.inputVal}
					onChange={this.handleInput}>
				</textarea>
			</div>
		);
	}
}

export default SlashCommand;
