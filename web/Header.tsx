export default function Header({
  doctorLastName,
  doctorSpecialty,
}: {
  doctorLastName: string;
  doctorSpecialty: string;
}) {
  return (
    <header className="header">
      <div className="header__content row-content">
        <div className="header__brand">
          Dr. {doctorLastName}
          <div className="header__brand_sub_title">{doctorSpecialty}</div>
        </div>
      </div>
    </header>
  );
}
