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
        <nav className="header__nav">
          <ul className="header__menu_list">
            <li className="header__menu_list_item">
              <a href="#booking">Booking</a>
            </li>
            <li className="header__menu_list_item">
              <a href="#office">Office</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
