interface HeaderProps {
  category: string;
  dayIndex: number;
}

export function Header({ category, dayIndex }: HeaderProps) {
  return (
    <header className="header">
      <h1>OMSCS Wordle</h1>
      <div className="day-number">#{dayIndex}</div>
      <div className="category">{category}</div>
    </header>
  );
}