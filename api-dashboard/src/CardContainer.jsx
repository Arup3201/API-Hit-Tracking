function Card(props) {
    return (
        <div className={"card " + (props.leftBorder?"left-border":"")}>
            <i className={"card-icon ph ph-" + props.icon.name} style={{backgroundColor: props.icon.background, color:props.icon.color}}></i>
            <div className="card-data">
                <p className="card-heading">{props.heading}</p>
                <p className="card-value">{props.value}</p>
            </div>
        </div>
    );
}
  
export function CardContainer(props) {
    return (
        <div className="card-container shadow box">
        {
            props.cards.map((card, i)=> <Card icon={card.icon} heading={card.heading} value={card.value} leftBorder={i!==0?true:false}/>)
        }
        </div>
    );
}