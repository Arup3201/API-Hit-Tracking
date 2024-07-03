import sideHeaderImg from './assets/side-header.svg';

export function MenuOption(props) {
    return (
        <div className={'menu-option ' + (props.isActive ? 'menu-option--active' : '')}>
        <i className={"ph ph-" + props.icon}></i>
        <p>{props.option}</p>
        </div>
    );
}

export function SideHeader() {
return (
    <div className='side-header'>
    <img src={sideHeaderImg} alt="API dashboard logo" />
    <h2>API Dashboard</h2>
    </div>
);
}
  
export function Menu(props) {
    return (
      <div className='menu'>
        {
          props.options.map((option, i) => <MenuOption option={option.option} icon={option.icon} isActive={i==props.activeOption ? true:false}/>
          )
        }
      </div>
    );
  }
  
export function SideMenu(props) {
return (
    <div className='side-menu shadow'>
    <SideHeader />
    <Menu activeOption={props.activeIndex} options={props.options}/>
    </div>
);
}
