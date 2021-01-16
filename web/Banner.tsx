export default function Banner({
  doctorPhoto,
  officePhone,
  onButtonClick,
}: {
  doctorPhoto: string;
  officePhone: string;
  onButtonClick: () => void;
}) {
  return (
    <div className="banner">
      <div
        className="banner__content row-content"
        style={{ backgroundImage: `url(${doctorPhoto})` }}
      >
        <div className="banner__header">BECAUSE WE CARE</div>
        <div className="banner__subheader">EMERGENCY CALL {officePhone}</div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onButtonClick();
          }}
          className="banner__button"
        >
          {" "}
          Make an Apppointment{" "}
        </a>
      </div>
    </div>
  );
}
