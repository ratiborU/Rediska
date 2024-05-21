type SidebarButtonProps = {
  text: string,
  callback: () => void,
  active: boolean,
}

const SidebarButton = ({text, callback, active}: SidebarButtonProps) => {

  return (
    <button className={`sidebar__button ${active && "sidebar__button-active"}`} onClick={() => {
      callback()
    }}>{text}</button>
  );
};

export default SidebarButton;