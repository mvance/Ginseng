var Intervaller = React.createClass({
    getInitialState() {
        return {
            modifyType: "change",
            changeType: "minutes",
            modifyAmount: 10,
            activeKeyIndex: false
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            modifyType: nextProps.lastInterval===0?"set":"change",
            activeKeyIndex: false
        });
    },
    onModeChange(newModeStr){
        if(newModeStr !== this.state.modifyType) {
            this.setState({
                modifyType: newModeStr,
                activeKeyIndex: false
            });
        }
    },
    getNewInterval(){
        var intervalDiff = this.state.changeType === "percent"?
            this.props.lastInterval * this.state.modifyAmount/100.0:
            moment.duration(this.state.modifyAmount, this.state.changeType.toLowerCase()).asMilliseconds();
        return (this.state.modifyType === "change")?
            this.props.lastInterval + intervalDiff:
            intervalDiff;
    },
    onIntervalChoice(modifyAmount, keyIndex, changeType){
        if(this.state.activeKeyIndex === keyIndex){
            this.props.applyInterval(this.getNewInterval());
        }
        this.setState({
            activeKeyIndex: keyIndex,
            changeType: changeType,
            modifyAmount: modifyAmount
        });
    },
    render(){
        var intervals = [];
        var keyIndex = 0;
        for (let timeframeKey in this.props.timeIntervalChoices) {
            for (let i = 0; i < this.props.timeIntervalChoices[timeframeKey].length; ++i) {
                if(!(timeframeKey === "Percent" && this.state.modifyType === "set")) {
                    var bc = [
                        "unselectable",
                        (keyIndex === this.state.activeKeyIndex) ? "buttonGood" : ("interval" + timeframeKey)
                    ];
                    var plusEL = <span className={this.state.modifyType === "change" ? "" : "invisible"}>+</span>;
                    var amount = this.props.timeIntervalChoices[timeframeKey][i];
                    var buttonStr = amount + (timeframeKey === "Percent" ? "%" : timeframeKey.slice(0, 1).toLowerCase());
                    intervals.push(
                        <button
                            key={keyIndex}
                            className={bc.join(" ")}
                            onClick={this.onIntervalChoice.bind(this, amount, keyIndex, timeframeKey.toLowerCase())}>{plusEL} {buttonStr}
                        </button>
                    );
                    keyIndex += 1;
                }
            }
        }

        var lastInterval = getPreciseIntervalStr( this.props.lastInterval);
        return(
            <div className={this.props.show?"":"invisible"}>
                <button
                    disabled={this.props.lastInterval===0}
                    className={" "+ (this.state.modifyType==="change"?"buttonGood":"")}
                    onClick={this.onModeChange.bind(this, "change")}>change</button>
                <button
                    className={" "+ (this.state.modifyType==="set"?"buttonGood":"")}
                    onClick={this.onModeChange.bind(this, "set")}>set</button>
                <div className="flexRowStacked">
                    {intervals}
                </div>
                {lastInterval === "<1 min"?
                    <span>First review!</span>:
                    <span>Last interval: {lastInterval}</span>
                }

                <div className={this.state.activeKeyIndex?"":"invisible"}>New interval: {getPreciseIntervalStr( this.getNewInterval() )}</div>
                <div className={this.state.activeKeyIndex?"":"invisible"}>Due on: {moment().add(moment.duration(this.getNewInterval())).format("dddd, YYYY-MM-DD, HH:mm") }</div>
            </div>
        );
    }
});
