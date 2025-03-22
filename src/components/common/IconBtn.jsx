import style from "./style/Btn.module.css";

export const IconBtn = ({
  icon: Icon,
  onClick,
  className,
  type = "button",
  label,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${style.IconBtn} ${className || ""}`}
    >
      <span className={style.Icon}>
        {typeof Icon === 'function' ? <Icon /> : Icon}
      </span>
    </button>
  );
};
