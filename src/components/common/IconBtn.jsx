import style from "./style/Btn.module.css";

export const IconBtn = ({
  icon: Icon,
  onClick,
  className,
  type = "button",
  label,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${style.IconBtn} ${className || ""}`}
    >
      <span className={style.Icon}>
        {typeof Icon === "function" ? <Icon /> : Icon}
      </span>
    </button>
  );
};
